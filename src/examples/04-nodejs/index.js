// use node.js commonjs, must remove package.json type field.

const { ChatOpenAI } = require('langchain/chat_models/openai')
const { HumanMessage } = require('langchain/schema')

require('dotenv').config()

const App = async () => {
  try {
    const chat = new ChatOpenAI(
      { temperature: 0  }
    )
    const response = await chat.call([
      new HumanMessage(
        'Translate this sentence from English to French. I love programming.'
      )
    ])
    console.log(response)
  } catch (error) {
    console.log(error.message)
  }
}

App()
