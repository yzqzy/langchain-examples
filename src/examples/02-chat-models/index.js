import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'

import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate
} from 'langchain/prompts'

import { LLMChain } from 'langchain/chains'

import { OPENAI_API_KEY } from '../../config/index.js'

const insert = htmlStr => (document.body.innerHTML = htmlStr)

// modal and completions
const case01 = async () => {
  const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: OPENAI_API_KEY })

  // 1. chat
  // const response = await chat.call([
  //   new HumanMessage(
  //     'Translate this sentence from English to French. I love programming.'
  //   )
  // ])
  // console.log(response)

  // 2. multiple completions
  const response = await chat.generate([
    [
      new SystemMessage(
        'You are a helpful assistant that translates English to French.'
      ),
      new HumanMessage(
        'Translate this sentence from English to French. I love programming.'
      )
    ],
    [
      new SystemMessage(
        'You are a helpful assistant that translates English to French.'
      ),
      new HumanMessage(
        'Translate this sentence from English to French. I love artificial intelligence。'
      )
    ]
  ])

  console.log(response)
}

// prompt templates
const case02 = async () => {
  const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: OPENAI_API_KEY })

  const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'You are a helpful assistant that translates {input_language} to {output_language}.'
    ),
    HumanMessagePromptTemplate.fromTemplate('{text}')
  ])

  const response = await chat.generatePrompt([
    await translationPrompt.formatPromptValue({
      input_language: 'English',
      output_language: 'Chinese',
      text: 'I love programming.'
    })
  ])

  console.log(response)
}

// modal prompt => llmchain
const case03 = async () => {
  const chat = new ChatOpenAI({ temperature: 0, openAIApiKey: OPENAI_API_KEY })

  const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'You are a helpful assistant that translates {input_language} to {output_language}.'
    ),
    HumanMessagePromptTemplate.fromTemplate('{text}')
  ])

  const chain = new LLMChain({
    llm: chat,
    prompt: translationPrompt
  })

  const response = await chain.call({
    input_language: 'English',
    output_language: 'Chinese',
    text: 'I love programming.'
  })

  console.log(response)
}

const App = async () => {
  // await case01()
  // await case02()
  // await case03()
}

App()
