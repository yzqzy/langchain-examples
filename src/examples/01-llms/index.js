import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

import { OPENAI_API_KEY } from '../../config/index.js'

const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 })

const insertToHtml = htmlStr

const case01 = async () => {
  const res = await model.call('一家生产彩色袜子的公司起什么名字好？')

  console.log(res)
  document.body.innerHTML = res
}

const case02 = async () => {
  const template = '一家生产{product}的公司起什么名字好？'
  const prompt = new PromptTemplate({ template, inputVariables: ['product'] })

  // const res = await prompt.format({ product: "小票打印机" })

  const chain = new LLMChain({ llm: model, prompt })
  const res = await chain.call({ product: '小票打印机' })

  console.log(res)

  document.body.i
}

const App = async () => {
  // await case01()

  await case02()
}

App()
