import { getLocalFiles } from '../../../05-chat/chat.js'
import { join } from 'path'

export default defineEventHandler(async () => {
  const dir = join(process.cwd(), '../../../static/data')
  const files = getLocalFiles(dir)
  return files
})
