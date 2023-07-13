<template>
  <div class="wrap">
    <h2>langchain examples</h2>

    <NuxtLink class="nav" to="/givename">llms - give your a name</NuxtLink>
    <NuxtLink class="nav" to="/translate">chat models - translation assistant</NuxtLink>
    <NuxtLink class="nav" to="/chat">chat - data analysis</NuxtLink>
    <NuxtLink class="nav" to="/chat-charts">chat - charts generate</NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .nav {
    margin-top: 15px;
  }
}
</style>