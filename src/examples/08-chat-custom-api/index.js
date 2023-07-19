import axios from 'axios'
import { config } from 'dotenv'

config()

const App = async () => {
  const url = `http://ml-jsonrpc.banmahui.cn/chat/completion?apikey=${process.env.MSY_API_KEY}`

  const { data } = await axios.post(url, {
    question: '元气森林2023年的销售额'
  })

  console.log(data)
}

App()
