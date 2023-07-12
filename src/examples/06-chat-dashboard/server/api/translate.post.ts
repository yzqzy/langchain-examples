import { ChatOpenAI } from 'langchain/chat_models/openai'

import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate
} from 'langchain/prompts'

import { LLMChain } from 'langchain/chains'

export default defineEventHandler(async event => {
  const { source, target, text } = await readBody(event)

  const chat = new ChatOpenAI({ temperature: 0 })

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

  const res = await chain.call({
    input_language: source,
    output_language: target,
    text
  })

  return res.text
})
