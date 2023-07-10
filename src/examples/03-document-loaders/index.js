import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'
import axios from 'axios'

import { OPENAI_API_KEY } from '../../config/index.js'

const App = async () => {
  const docs = await axios.get('http://localhost:3000')

  if (!Array.isArray(docs.data)) return

  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY })
  const chain = loadQAStuffChain(model)

  const res = await chain.call({
    input_documents: docs.data.slice(0, 8),
    question: '有几个品牌商品'
  })

  console.log(res)
}

App()
