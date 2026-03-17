<template>

    <div>
        <text-section-title text="Most Popular" backgroundColor="#90f6b7" ></text-section-title>
    </div>



</template>

<script setup lang="ts">

import { useArticlesStore } from '@/stores/articlesStore'
import { storeToRefs } from 'pinia'

const articlesStore = useArticlesStore()
const { popular } = storeToRefs(articlesStore)

const isReady = ref(false)

await useAsyncData('mostPopular', async () => {
  await articlesStore.fetchPopular(6)
  return popular.value
})

console.log('Most Popular Articles:', popular.value)

</script>