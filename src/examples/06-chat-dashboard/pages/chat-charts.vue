<template>
  <div class="wrap">
    <div>
      <h2>Chat - Charts Generate</h2>
      <NuxtLink to="/">back</NuxtLink>
    </div>
    <div class="main">
      <div class="local-files">
        <h4> 数据来源：</h4>
        <p v-for="file of files" v-html="file"></p>
      </div>
      <div class="chat-gpt-wrap">
        <div class="chat-gpt-input">
          <el-input v-model="inputText" :disabled="loading" placeholder="请输入问题" @keyup.enter="query" />
        </div>
        <div class="chat-gpt-container">
          <div v-if="message">
            <div class="chat-gpt-content">
              {{ message.content }}
            </div>
            <div class="chat-gpt-answers">
              <p> 您还可以这样问：</p>
              <p v-for="answer of message.similiarAnswers" class="answser">{{ answer }}</p>
            </div>
          </div>
          <div v-if="message" class="chat-gpt-charts">
            <div v-if="message.lineCharts" class="charts">
              <Line :data="message.lineCharts.data" :options="message.lineCharts.options" />
            </div>
            <div v-if="message.barCharts" class="charts">
              <Bar :data="message.barCharts.data" :options="message.barCharts.options" />
            </div>
            <div v-if="message.pieCharts" class="charts">
              <Pie :data="message.pieCharts.data" :options="message.pieCharts.options" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar, Line, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const loading = ref(false)
const inputText = ref('天津的全年人口数据')

const clear = () => {
  inputText.value = ''
}

type Charts = {
  options: any,
  data: any
}
type Message = {
  content: string,
  similiarAnswers: string[],
  lineCharts?: Charts,
  barCharts?: Charts,
  pieCharts?: Charts
}
const message = ref<Message>()

const generateData = (label: string, data: { x: string[], y: string[] }) => {
  return {
    data: {
      labels: data.x,
      datasets: [
        {
          label,
          backgroundColor: '#ecf5ff',
          data: data.y
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }
}
const generateRandomColor = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}

const generatePieData = (data: { x: string[], y: string[] }) => {
  return {
    data: {
      labels: data.x,
      datasets: [
        {
          backgroundColor: generateRandomColor(data.y.length),
          data: data.y
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }
}

const query = async () => {
  if (!inputText.value) return

  loading.value = true

  const text = inputText.value

  try {
    const { data } = await useFetch('/api/chat', {
      method: 'post',
      body: { type: 'charts', text }
    })

    console.log(data.value)

    const { text: answer, similiarAnswers, dimension, data: chartsData } = JSON.parse(data.value)

    message.value = {
      content: answer,
      similiarAnswers,
      lineCharts: generateData(dimension, chartsData),
      barCharts: generateData(dimension, chartsData),
      pieCharts: generatePieData(chartsData)
    }

    loading.value = false
  } catch (error) {
    clear()

    console.log(error)
  }
}

const files = ref()
const getLocalFiles = async () => {
  try {
    const { data } = await useFetch('/api/files')
    files.value = data.value as string[]
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getLocalFiles()
})

</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #333;

  p {
    margin: 0;
  }

  .main {
    display: flex;
    flex-direction: row;
    margin-top: 30px;
  }

  .local-files {
    width: 300px;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 20px;
    padding: 20px 10px;
    box-sizing: border-box;

    h4 {
      margin: 0;
      margin-bottom: 10px;
    }

    p {
      width: 250px;
      font-size: 14px;
      white-space: nowrap;
      line-height: 24px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .chat-gpt-wrap {
    width: 1000px;
    height: 500px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;

    .chat-gpt-container {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      margin-top: 10px;
      border-radius: 4px;

      .chat-gpt-input {
        padding: 10px;
        background-color: #f5f5f5;
      }

      .chat-gpt-content {
        margin-top: 10px;
      }

      .chat-gpt-answers {
        margin-top: 10px;
        font-size: 13px;
        color: gray;

        p {
          line-height: 20px;
        }
      }

      .chat-gpt-charts {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin-top: 10px;
      }
    }

  }
}
</style>