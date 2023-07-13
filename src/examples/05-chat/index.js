import { config } from 'dotenv'
import { join } from 'path'

import { LLMChat } from './chat.js'
import { PROMPT_TEMPLATE, ZHICHENG_CHAT_PROMPT_TEMPLATE } from './prompt.js'

config()

const jdCase = async () => {
  const DATA_PATH = join(process.cwd(), 'static/data')
  const VENCTOR_DATA_PATH = join(process.cwd(), 'static/data_venctor')

  const llmChat = new LLMChat({
    target: DATA_PATH,
    dest: VENCTOR_DATA_PATH,
    prompt: PROMPT_TEMPLATE
  })

  const fiels = await llmChat.getLocalDocs()
  const vectorStore = await llmChat.initVectorStore(fiels)
  const answer = await llmChat.chat(vectorStore, "元气森林有哪些店铺")

  try {
    const { text } = answer

    console.log(text)

    const data = JSON.parse(text)
    console.log(data)
  } catch (error) {
    console.log('analysis failed')
  }
}

let llmChat
const zhichengCase = async (question) => {
  const DATA_PATH = join(process.cwd(), 'static/zhicheng_data')
  const VENCTOR_DATA_PATH = join(process.cwd(), 'static/zhicheng_venctor_data')

  if (!llmChat) {
    llmChat = new LLMChat({
      target: DATA_PATH,
      dest: VENCTOR_DATA_PATH,
      prompt: ZHICHENG_CHAT_PROMPT_TEMPLATE
    })
  }

  const fiels = await llmChat.getLocalDocs('csv')
  const vectorStore = await llmChat.initVectorStore(fiels)
  const answer = await llmChat.chatWithCache(vectorStore, question)

  try {
    console.log(answer.text)
    console.log(JSON.parse(answer.text))
  } catch (error) {
    console.log('analysis failed')
  }
}

const timemout = (ms) => new Promise((resolve) => {
  console.log(`delay ${ms}ms`)
  setTimeout(() => {
    resolve()
    console.log(`delay finished`)
  }, ms)
})

const App = async () => {
  // await jdCase()

  await zhichengCase("天津市的GDP年度数据")
  // await timemout(3 * 1000)
  // await zhichengCase("人口数据")
}

App()
