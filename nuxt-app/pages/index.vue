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

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
      Chargement des articles...
    </div>

    <div v-else class="mt-6 grid p-2 sm:grid-cols-1 md:p-0 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <article-card
        v-for="article in topStories"
        :key="article._id"
        :title="article.title"
        :slug="article.slug"
        :image="article.image"
        :category="article.category"
        :author-name="article.author.name"
        :author-avatar="article.author.avatar"
        :read-time="article.readTime"
        :views="article.views"
      />
    </div>

  </div>

</template>

<script setup lang="ts">
import { useArticlesStore } from '@/stores/articlesStore'
import { storeToRefs } from 'pinia'

const articlesStore = useArticlesStore()
const { topStories } = storeToRefs(articlesStore)

const isReady = ref(false)

await useAsyncData('topStories', async () => {
  await articlesStore.fetchTopStories(4)
  return topStories.value
})

isReady.value = topStories.value && topStories.value.length > 0

// testing: if topStories is empty, set isReady to false to show loading state
// isReady.value = false

</script>