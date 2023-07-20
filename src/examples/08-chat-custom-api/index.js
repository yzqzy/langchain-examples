import axios from 'axios'
import { config } from 'dotenv'

config()

const App = async () => {
  const url = `http://ml-jsonrpc.banmahui.cn/chat/completion?apikey=${process.env.MSY_API_KEY}`

  const { data } = await axios.post(url, {
    question: '只统计 便利店业态，再全国范围内，可口可乐品牌在2022年的品牌销量趋势是怎样的？',
    history: [
      {
        role: 'system',
        content: `If {Input} contains drawing, use vega-lite syntax to return the drawing JSON schema, which is as rich as possible as possible.`
      }
    ]
  })
  console.log(data)
}

App()
