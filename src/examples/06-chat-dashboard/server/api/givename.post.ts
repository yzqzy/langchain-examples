import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

export default defineEventHandler(async event => {
  const { text } = await readBody(event)

  const model = new OpenAI({ temperature: 0.9 })

  const template =
    '一家生产{product}的公司起什么名字好？ 必须返回中文名称，请返回不小于 3 个推荐名称。'
  const prompt = new PromptTemplate({ template, inputVariables: ['product'] })

  const chain = new LLMChain({ llm: model, prompt })
  const res = await chain.call({ product: text })

  return res.text
})
