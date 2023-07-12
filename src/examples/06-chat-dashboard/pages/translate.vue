<template>
  <div class="wrap">
    <div>
      <h2>Chat Models - Translation Assistant</h2>
      <NuxtLink to="/">back</NuxtLink>
    </div>
    <div class="main">
      <div class="header">
        <el-select v-model="source" placeholder="源语言">
          <el-option v-for="language in languages" :key="language.value" :value="language.value"
            :label="language.label" />
        </el-select>
        <el-select v-model="target" placeholder="目标语言">
          <el-option v-for="language in languages" :key="language.value" :value="language.value"
            :label="language.label" />
        </el-select>
        <el-button @click="translate" :loading="loading">翻译</el-button>
      </div>
      <div class="body">
        <el-input v-model="text" type="textarea" placeholder="输入要翻译的文本" :rows="4" clearable></el-input>
        <div class="result" v-if="result">{{ result }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const loading = ref(false)

const text = ref('')
const result = ref('')

const source = ref('')
const target = ref('')

const languages = ref([
  { value: 'English', label: '英语' },
  { value: 'Chinese', label: '中文（简体）' },
  { value: 'Japanese', label: '日语' },
])

const translate = async () => {
  if (!text.value) return

  loading.value = true

  try {
    const { data } = await useFetch('/api/translate', {
      method: 'post',
      body: {
        source: source.value,
        target: target.value,
        text: text.value
      }
    })

    result.value = data.value

    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .main {
    max-width: 400px;
    margin: 0 auto;
    margin-top: 30px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .body {
    margin-top: 20px;
  }

  .result {
    margin-top: 20px;
    font-weight: bold;
  }

  .translation-history {
    margin-top: 20px;
  }

  .source {
    font-weight: bold;
  }

  .target {
    margin-left: 10px;
  }
}
</style>