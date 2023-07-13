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

const zhichengCase = async () => {
  const DATA_PATH = join(process.cwd(), 'static/zhicheng_data')
  const VENCTOR_DATA_PATH = join(process.cwd(), 'static/zhicheng_venctor_data')

  const llmChat = new LLMChat({
    target: DATA_PATH,
    dest: VENCTOR_DATA_PATH,
    prompt: ZHICHENG_CHAT_PROMPT_TEMPLATE
  })

  const fiels = await llmChat.getLocalDocs('csv')
  const vectorStore = await llmChat.initVectorStore(fiels)
  const answer = await llmChat.chat(vectorStore, "北京的地区生产总值数据")

  try {
    const { text } = answer

    console.log(text)

    const data = JSON.parse(text)

    console.log(data)
  } catch (error) {
    console.log('analysis failed')
  }
}

const App = async () => {
  // await jdCase()
  await zhichengCase()
}

App()
