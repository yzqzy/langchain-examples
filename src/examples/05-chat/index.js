import { config } from 'dotenv'
import { join } from 'path'

import { LLMChat } from './chat.js'
import { PROMPT_TEMPLATE } from './prompt.js'

config()

const App = async () => {
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

App()
