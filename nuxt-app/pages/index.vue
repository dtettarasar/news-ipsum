<template>

  <div class="container mx-auto">
    
    <text-site-title></text-site-title>

    <forms-search-bar></forms-search-bar>

    <div class="my-12">
      <category-content-carrousel></category-content-carrousel>
    </div>

    <div>
      <text-section-title text="Top Stories" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div class="mt-6 grid p-2 sm:grid-cols-1 md:p-0 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <article-card />
      <article-card />
      <article-card />
      <article-card />
    </div>

  </div>

</template>

<script setup lang="ts">
import { useArticlesStore } from '@/stores/articlesStore'
import { storeToRefs } from 'pinia'

const articlesStore = useArticlesStore()
const { topStories } = storeToRefs(articlesStore)

await useAsyncData('topStories', async () => {
  await articlesStore.fetchTopStories(4)
  return topStories.value
})

console.log('Top Stories:', topStories.value)
</script>