import path from 'path'
import fs from 'fs'
import { config } from 'dotenv'

import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

config()

const App = () => {
  const CWD_PATH = process.cwd()

  const DATA_PATH = path.join(CWD_PATH, 'static/data')
  const VENCTOR_DATA_PATH = path.join(CWD_PATH, 'static/data_venctor')

  const getLocalFiles = async () => {
    const useedFields = [
      'wareId',
      'wname',
      'imageurl',
      'jdPrice',
      'shop_id',
      'shop_name',
      'sales_rank',
      'isNew',
      'isHot',
      'cateId'
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
      console.log('read local data')
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

  const chatWithLLM = () => {
    
  }

  const init = async () => {
    const data = await getLocalFiles()
    const vectorData = await initVectorStore(data)

    console.log(vectorData)
  }

  return {
    init
  }
}

App().init()
