import fs from 'fs'

import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain/llms/openai'
import { ConversationSummaryMemory } from 'langchain/memory'
import { ConversationChain, LLMChain } from 'langchain/chains'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { CSVLoader } from "langchain/document_loaders/fs/csv";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import { QUESTION_PROMPT_TEMPLATE } from './prompt.js'

class LLMChat {
  constructor(options) {
    const { target, dest, prompt } = options

    this.target = target
    this.dest = dest
    this.prompt = prompt
    this.model = new OpenAI({ temperature: 0, maxTokens: -1 })
    this.memory = new ConversationSummaryMemory({
      inputKey: "question",
      memoryKey: "chat_history",
      llm: new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
    })
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

  async _chatWithLLM(question, context) {
    const prompt = PromptTemplate.fromTemplate(this.prompt)
    const chain = new LLMChain({ llm: this.model, prompt })
    const res = await chain.call({ question, context })
    return res
  }

  async _chatWithMemoryLLM(question, context) {
    const prompt = PromptTemplate.fromTemplate(this.prompt)
    const chain = new ConversationChain({ llm: this.model, prompt, memory: this.memory })
    const res = await chain.call({ question, context })
    return res
  }

  async _chatWithQuestion(question) {
    const prompt = PromptTemplate.fromTemplate(QUESTION_PROMPT_TEMPLATE)
    const chain = new ConversationChain({ llm: this.model, prompt, memory: this.memory })
    const res = await chain.call({ question })
    return res
  }

  async _chat(options) {
    const { question, referenceContext } = options
    const res = await this._chatWithLLM(question, referenceContext)
    return res
  }

  _getFileName(path) {
    const parts = path.split("/");
    return parts.pop() || '';
  }

  async chat(vectorStore, question) {
    const referenceContextDocuments = await vectorStore.similaritySearch(question, 1);
    const contextString = (referenceContextDocuments || []).map(docItem => `[${this._getFileName(docItem.metadata.source)}] ${docItem.pageContent}`).join('/n')
    const answer = await this._chat({ question, referenceContext: contextString })
    return answer
  }

  async chatWithCache(vectorStore, question) {
    const qs = await this._chatWithQuestion(question)
    console.log(qs.response)
    const res = await this.chat(vectorStore, qs.response)
    console.log(res.text)
    return res
  }
}


export {
  LLMChat
}