<template>
  <div>{{ animals }}</div>
</template>

<script lang="ts" setup>
const animals =  ref()

const query = gql`
  query Animals {
    animals {
      ... on Spider {
        name
        footLength
      }
      ... on Bird {
        name
        footLength
        wingLength
        wing
      }
    }
  }
`

const { data } = await useAsyncQuery(query)
animals.value = data.value
</script>
