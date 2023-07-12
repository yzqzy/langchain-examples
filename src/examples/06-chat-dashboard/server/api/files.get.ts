import { readdirSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  const dir = join(process.cwd(), '../../../static/data')
  const files = readdirSync(dir)
  return files
})
