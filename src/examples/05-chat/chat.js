import fs from 'fs'

import { LLMChain } from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain/llms/openai'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { CSVLoader } from "langchain/document_loaders/fs/csv";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

class LLMChat {
  constructor(options) {
    const { target, dest, prompt } = options

    this.target = target
    this.dest = dest
    this.prompt = prompt
  }

  getLocalFiles() {
    return fs.readdirSync(this.target)
  }

  async getLocalDocs(type = 'json') {
    let loader

    switch (type) {
      case 'json':
        loader = new DirectoryLoader(this.target, {
          '.json': path => new JSONLoader(path, [
            'wareId',
            'wname',
            'shop_id',
            'shop_name',
            'sales_rank',
            "brand"
          ].map(field => `/${field}`))
        })
        break;
      case 'csv':
        loader = new DirectoryLoader(this.target, {
          '.csv': path => new CSVLoader(path)
        })
        break

      default:
        break;
    }

    const docs = await loader.load()

    return docs
  }

  async initVectorStore(rawDocs) {
    const { dest } = this

    if (fs.existsSync(`${dest}/docstore.json`)) {
      const vectorStore = await HNSWLib.load(dest, new OpenAIEmbeddings({}))
      return vectorStore
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const docs = await textSplitter.splitDocuments(rawDocs)
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        verbose: true
      })
    )

    await vectorStore.save(dest)

    console.log('create data success')

    return vectorStore
  }

  _generateChain() {
    const model = new OpenAI({ temperature: 0, maxTokens: -1 })
    const prompt = PromptTemplate.fromTemplate(
      this.prompt
    )
    return new LLMChain({
      llm: model,
      prompt
    })
  }

  async _chatWithLLM(options) {
    const { question, referenceContext } = options
    const chain = this._generateChain()
    const res = await chain.call({ question, context: referenceContext })
    return res
  }

  _getFileName(path) {
    const parts = path.split("/");
    return parts.pop() || '';
  }

  async chat(vectorStore, question) {
    const referenceContextDocuments = await vectorStore.similaritySearch(question, 1);
    const contextString = (referenceContextDocuments || []).map(docItem => `[${this._getFileName(docItem.metadata.source)}] ${docItem.pageContent}`).join('/n')
    const answer = await this._chatWithLLM({ question, referenceContext: contextString })
    return answer
  }
}


export {
  LLMChat
}