import { config } from 'dotenv'
import { getLocalDocs, initVectorStore, chat } from './chat.js'

config()

const App = async () => {
  const fiels = await getLocalDocs()
  const vectorStore = await initVectorStore(fiels)
  const answer = await chat(vectorStore, "元气森林有哪些店铺")

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
