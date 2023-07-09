import { OpenAI } from 'langchain/llms/openai'

import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'

import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

import { OPENAI_API_KEY, SERPAPI_API_KEY } from '../../config/index.js'

const insert = htmlStr => (document.body.innerHTML = htmlStr)

// llms
const case01 = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 })
  const res = await model.call('一家生产彩色袜子的公司起什么名字好？')

  console.log(res)

  insert(res)
}

// prompt and chains
const case02 = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 })

  const template = '一家生产{product}的公司起什么名字好？'
  const prompt = new PromptTemplate({ template, inputVariables: ['product'] })

  // const res = await prompt.format({ product: "小票打印机" })

  const chain = new LLMChain({ llm: model, prompt })
  const res = await chain.call({ product: '小票打印机' })

  console.log(res)

  insert(res.text)
}

// agents
const case03 = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 })
  const tools = [
    new SerpAPI(SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us'
    }),
    new Calculator()
  ]

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'zero-shot-react-description'
  })

  console.log('Loaded agent.')

  const input =
    "Who is Olivia Wilde's boyfriend?" +
    ' What is his current age raised to the 0.23 power?'
  console.log(`Executing with input "${input}"...`)

  const result = await executor.call({ input })

  console.log(`Got output ${result.output}`)
}

// memory
const case04 = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY })
  const memory = new BufferMemory()

  const chain = new ConversationChain({ llm: model, memory })

  const res1 = await chain.call({ input: '你好，我是 heora。' })
  console.log(res1)

  const res2 = await chain.call({ input: '我的名字是什么' })
  console.log(res2)
}

const App = async () => {
  // await case01()
  // await case02()
  // await case03()
  // await case04()
}

App()
