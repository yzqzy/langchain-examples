import path from 'path'
import fs from 'fs'

import { LLMChain } from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain/llms/openai'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import { PROMPT_TEMPLATE } from './prompt.js'

const CWD_PATH = process.cwd()

const DATA_PATH = path.join(CWD_PATH, 'static/data')
const VENCTOR_DATA_PATH = path.join(CWD_PATH, 'static/data_venctor')

const getFileName = (path) => {
  const parts = path.split("/");
  return parts.pop() || '';
}

const getLocalFiles = () => fs.readFileSync(DATA_PATH)

const getLocalDocs = async () => {
  const useedFields = [
    'wareId',
    'wname',
    'shop_id',
    'shop_name',
    'sales_rank',
    "brand"
  ]

  const loader = new DirectoryLoader(DATA_PATH, {
    // '.json': path => new JSONLoader(path)
    '.json': path => new JSONLoader(path, useedFields.map(field => `/${field}`))
  })
  const docs = await loader.load()
  return docs
}

const initVectorStore = async rawDocs => {
  if (fs.existsSync(`${VENCTOR_DATA_PATH}/docstore.json`)) {
    const vectorStore = await HNSWLib.load(VENCTOR_DATA_PATH, new OpenAIEmbeddings({}))
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

  await vectorStore.save(VENCTOR_DATA_PATH)

  console.log('create data success')

  return vectorStore
}

const _generateChain = () => {
  const model = new OpenAI({ temperature: 0 })
  const prompt = PromptTemplate.fromTemplate(
    PROMPT_TEMPLATE
  )
  return new LLMChain({
    llm: model,
    prompt
  })
}

const _chatWithLLM = async (options) => {
  const { question, referenceContext } = options
  const chain = _generateChain()
  const res = await chain.call({ question, context: referenceContext })
  return res
}

const chat = async (vectorStore, question) => {
  const referenceContextDocuments = await vectorStore.similaritySearch(question, 1);
  const contextString = (referenceContextDocuments || []).map(docItem => `[${getFileName(docItem.metadata.source)}] ${docItem.pageContent}`).join('/n')
  const answer = await _chatWithLLM({ question, referenceContext: contextString })
  return answer
}

export {
  getLocalFiles,
  getLocalDocs,
  initVectorStore,
  chat
}