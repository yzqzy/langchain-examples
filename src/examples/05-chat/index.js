import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import axios from 'axios'

import { OPENAI_API_KEY } from '../../config/index.js'

const App = () => {
  const VENCTOR_DATA_PATH = './data/'

  const getLocalFiles = async () => {
    const docs = await axios.get('http://localhost:3000')

    if (Array.isArray(docs.data)) return docs.data
    return []
  }

  const initVectorStore = async rawDocs => {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const docs = await textSplitter.splitDocuments(rawDocs)
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        verbose: true
      })
    )

    await vectorStore.save(VENCTOR_DATA_PATH)

    console.log('init success')

    return vectorStore
  }

  const init = async () => {
    const data = await getLocalFiles()
    const vectorData = await initVectorStore(data.slice(0, 20))

    console.log(vectorData)
  }

  return {
    init
  }
}

App().init()
