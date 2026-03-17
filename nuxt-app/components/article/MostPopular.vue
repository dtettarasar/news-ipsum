<template>

    <div>
        <text-section-title text="Most Popular" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
        Chargement des articles...
    </div>

    <div v-else class="mt-6 grid p-2 sm:grid-cols-1 md:p-0 md:grid-cols-2 gap-6">
        <article-popular-card
            v-for="article in popular"
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

isReady.value = popular.value && popular.value.length > 0

</script>