<template>
  <div class="wrap">
    <div>
      <h2>LLMS - Give Your A Name</h2>
      <NuxtLink to="/">back</NuxtLink>
    </div>
    <div class="main">
      <div>
        <el-input
          class="textarea"
          v-model="textarea"
          :rows="4"
          type="textarea"
          placeholder="请输入您公司的主营产品"
        />
      </div>
      <div class="names"><p>建议名称：</p>{{ suggested }}</div>
      <div>
        <el-button class="btn" type="info" @click="clear">重置</el-button>
        <el-button class="btn" type="success" :disabled="submitDisabled" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const textarea = ref('')
const suggested = ref('')

const loading = ref(false)

const submitDisabled = computed(() => textarea.value == '' || loading.value)

const clear = () => {
  textarea.value = ''
  suggested.value = ''
}

const submit = async () => {
  if (textarea.value === '') return

  loading.value = true

  try {
    const { data } = await useFetch('/api/givename', {
      method: 'post',
      body: { text: textarea.value }
    })

    suggested.value = data.value

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
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    .textarea {
      width: 300px;
    }

    .names {
      width: 300px;
      margin-top: 20px;
      font-size: 14px;
      color: gray;
    }

    .btn {
      margin-top: 20px;
    }
  }
}
</style>