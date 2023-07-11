const { ChatOpenAI } = require('langchain/chat_models/openai')
const { HumanMessage } = require('langchain/schema')

const { OPENAI_API_KEY } = require('../../config/index.module')

const App = async () => {
  try {
    const chat = new ChatOpenAI(
      { temperature: 0, openAIApiKey: OPENAI_API_KEY }
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
