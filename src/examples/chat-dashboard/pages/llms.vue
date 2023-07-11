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
          placeholder="请输入您公司的主要产品"
        />
      </div>
      <div class="names">建议名称：</div>
      <div>
        <el-button class="btn" type="info" @click="clear">重置</el-button>
        <el-button class="btn" type="success" @submit="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const textarea = ref('')

const clear = () => {
  textarea.value = ''
}

const submit = () => {}
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