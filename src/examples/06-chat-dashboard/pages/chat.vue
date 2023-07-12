<template>
  <div class="wrap">
    <div>
      <h2>Chat - Data Analysis</h2>
      <NuxtLink to="/">back</NuxtLink>
    </div>
    <div class="main">
      <div class="local-files">
        <h4> 数据来源：</h4>
        <p v-for="file of files" v-html="file"></p>
      </div>
      <div class="chat-gpt-wrap">
        <div class="chat-gpt-messages" ref="messageRef">
          <div v-for="message in messages" :key="message.id" class="chat-gpt-message"
            :class="{ 'user-message': message.isUser }">
            <div v-if="message.isUser" class="user-avatar">
            </div>
            <div class="message-content">
              <p v-html="message.content"></p>
              <div v-if="message.similiarAnswers && message.similiarAnswers.length">
                <p class="sub sub-title">您还可以这样问:</p>
                <p class="sub" v-for="sub of message.similiarAnswers" v-html="sub"></p>
              </div>
            </div>
            <div v-if="!message.isUser" class="bot-avatar">
            </div>
          </div>
        </div>
        <div class="chat-gpt-input">
          <el-input v-model="inputText" :disabled="loading" placeholder="请输入消息" @keyup.enter="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const loading = ref(false)

const inputText = ref('')

type Message = {
  id: number,
  isUser: boolean,
  content: string,
  similiarAnswers?: string[]
}

const messages = ref<Message[]>([
  {
    id: 1,
    isUser: false,
    content: "你好，我是数据分析助手。"
  }
])

const messageRef = ref()
watch(messages, () => {
  nextTick(() => {
    messageRef.value.scrollTop = messageRef.value.scrollHeight
  })
})

const clear = () => {
  inputText.value = ''
}

const pushMessage = (isUser: boolean, content: string, similiarAnswers: string[] = []) => {
  const data = messages.value

  messages.value = [
    ...messages.value,
    {
      id: data.length++,
      isUser,
      content,
      similiarAnswers
    }
  ]
}

const sendMessage = async () => {
  if (!inputText.value) return

  loading.value = true

  const text = inputText.value

  pushMessage(true, text)

  clear()

  try {
    const { data } = await useFetch('/api/chat', {
      method: 'post',
      body: { text }
    })

    const { text: answer, similiarAnswers } = JSON.parse(data.value)

    pushMessage(false, answer, similiarAnswers)

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
    height: 500px;
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
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;

    .chat-gpt-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .chat-gpt-message {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
      }

      .user-message {
        justify-content: flex-end;
      }

      .user-avatar {}

      .bot-avatar {}

      .message-content {
        max-width: 70%;
        padding: 8px;
        background-color: #f2f2f2;
        border-radius: 4px;

        .sub {
          font-size: 13px;
          color: gray;
        }

        .sub-title {
          margin-top: 5px;
          color: gray;
        }
      }

      .chat-gpt-input {
        padding: 10px;
        background-color: #f5f5f5;
      }
    }
  }
}
</style>