import { LLMChat } from '../../../05-chat/chat.js'
import { ZHICHENG_PROMPT_TEMPLATE, ZHICHENG_CHAT_PROMPT_TEMPLATE } from '../../../05-chat/prompt.js'

import { join } from 'path'

let llmChat: LLMChat

export default defineEventHandler(async event => {
  const { type, text } = await readBody(event)

  let prompt

  switch (type) {
    case 'text':
      prompt = ZHICHENG_PROMPT_TEMPLATE
      break
    case 'charts':
      prompt = ZHICHENG_CHAT_PROMPT_TEMPLATE
      break
    default:
      prompt = ZHICHENG_PROMPT_TEMPLATE
      break
  }

  const base = join(process.cwd(), '../../../')
  const target = join(base, 'static/zhicheng_data')
  const dest = join(base, 'static/zhicheng_venctor_data')

  if (!llmChat) {
    llmChat = new LLMChat({
      target,
      dest,
      prompt
    })
  }

  const fiels = await llmChat.getLocalDocs('csv')
  const vectorStore = await llmChat.initVectorStore(fiels)
  const answer = await llmChat.chatWithCache(vectorStore, text)

  return answer.text
})
