<template>

    <div>
        <text-section-title text="Recent Articles" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
        Chargement des articles...
    </div>

    <div v-else class="mt-6 p-2 grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Colonne gauche : Featured Card -->
      <article-featured-card
        v-if="featuredArticle"
        :title="featuredArticle.title"
        :slug="featuredArticle.slug"
        :image="featuredArticle.image"
        :category="featuredArticle.category"
      />

      <!-- Colonne droite : Grille 2×2 petites cards (1 colonne en mobile) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article-recent-card
          v-for="article in smallCards"
          :key="article._id"
          :title="article.title"
          :slug="article.slug"
          :image="article.image"
          :category="article.category"
        />
      </div>

    </div>

</template>

<script setup lang="ts">
    
    import { useArticlesStore } from '@/stores/articlesStore'
    import { storeToRefs } from 'pinia'

    const articlesStore = useArticlesStore()
    const isReady = ref(false)

    const { recent } = storeToRefs(articlesStore)

    await useAsyncData('recent', async () => {
        await articlesStore.fetchRecent(5)
        return recent.value
    })

    isReady.value = recent.value && recent.value.length > 0

    // Premier article = featured (US-004b), les 4 suivants = petites cards
    const featuredArticle = computed(() => recent.value?.[0] ?? null)
    const smallCards = computed(() => recent.value.slice(1, 5))

</script>