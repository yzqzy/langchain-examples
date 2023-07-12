import axios from 'axios'
import { config } from 'dotenv'

import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { CSVLoader } from "langchain/document_loaders/fs/csv";

config()

// get remote data
const case01 = async () => {
  const docs = await axios.get('http://localhost:3000')

  if (!Array.isArray(docs.data)) return

  const model = new OpenAI({})
  const chain = loadQAStuffChain(model)

  const res = await chain.call({
    input_documents: docs.data.slice(0, 8),
    question: '有几个品牌商品'
  })

  console.log(res)
}

// load csv file
const case02 = async () => {
  const loader = new CSVLoader("static/zhicheng_data/近20年分省总人口年度数据.csv");

  const docs = await loader.load();

  console.log(docs)
}

// load csv files
const case03 = async () => {
  const loader = new DirectoryLoader('static/zhicheng_data', {
    '.csv': path => new CSVLoader(path)
  })
  const docs = await loader.load()

  console.log(docs)
}

const App = async () => {
  // case01()
  case02()
  // case03()
}

App()
