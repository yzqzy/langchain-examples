import { getLocalDocs, initVectorStore, chat } from '../../../05-chat/chat.js'
import { join } from 'path'

export default defineEventHandler(async event => {
  const { text } = await readBody(event)

  const base = join(process.cwd(), '../../../')
  const target = join(base, 'static/data')
  const dest = join(base, 'static/data_venctor')

  const fiels = await getLocalDocs(target)
  const vectorStore = await initVectorStore(fiels, dest)
  const answer = await chat(vectorStore, text)

  return answer.text
})
