import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'

import axios from 'axios'

import { OPENAI_API_KEY } from '../../config/index.js'

const App = () => {
  const getData = async () => {
    const docs = await axios.get('http://localhost:3000')

    if (Array.isArray(docs.data)) return docs.data
    return []
  }

  const init = async () => {
    const data = await getData()
  }


  return {
    init
  }
}

App()