import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'

// import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
// import { JSONLoader } from 'langchain/document_loaders/fs/json'

import { OPENAI_API_KEY } from '../../config/index.js'

const App = async () => {
  const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY })
  const chain = loadQAStuffChain(model)

  // const loader = new DirectoryLoader('src/data/test', {
  //   '.json': path => new JSONLoader(path, ['/wname'])
  // })
  // const docs = await loader.load()

  const docs = [
    {
      pageContent:
        '口水娃小麻花408g红糖味椒盐味糕点心休闲零食小吃多口味独立包装 红糖味',
      metadata: {
        source:
          '/Users/heora/workspace/langchain-examples/src/data/test/12615_口水娃旗舰店.json',
        line: 34
      }
    },
    {
      pageContent:
        '口水娃 带皮紫衣大腰果仁500g散装新货原味越南坚果干果零食 紫衣腰果半斤：250g',
      metadata: {
        source:
          '/Users/heora/workspace/langchain-examples/src/data/test/12615_口水娃旗舰店.json',
        line: 35
      }
    }
  ]

  console.log(docs)

  const res = await chain.call({
    input_documents: docs,
    question: '筛选出小麻花的商品'
  })

  console.log(res)
}

App()
