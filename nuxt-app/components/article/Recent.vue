<template>

    <div>
        <text-section-title text="Recent Articles" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
        Chargement des articles...
    </div>

    <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Colonne gauche : Featured Card -->
      <a
        v-if="featuredArticle"
        :href="`/article/read/${featuredArticle.slug}`"
        class="block rounded-xl overflow-hidden relative min-h-[300px] cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#000]"
        :style="{
          backgroundImage: featuredArticle.image ? `url(${featuredArticle.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: featuredArticle.image ? undefined : '#d1d5db',
        }"
      >
        <!-- Overlay dégradé sombre pour lisibilité du texte -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <!-- Contenu en bas de la card -->
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-xs uppercase tracking-wide border border-black border-2"
          >
            {{ featuredArticle.category }}
          </span>

          <h3 class="mt-2 text-xl md:text-2xl font-bold leading-tight text-white line-clamp-3">
            {{ featuredArticle.title }}
          </h3>
        </div>
      </a>

      <!-- Colonne droite : Grille 2×2 petites cards -->
      <div class="grid grid-cols-2 gap-4">
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