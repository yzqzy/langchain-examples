import { OpenAI } from 'langchain/llms/openai'

import { OPENAI_API_KEY } from '../../config/index.js'

const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 })

const App = async () => {
  try {
    const res = await model.call('一家生产彩色袜子的公司起什么名字好？')

    console.log(JSON.stringify(res))
  } catch (error) {
    console.log(error)
  }
}

App()
