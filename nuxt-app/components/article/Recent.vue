<template>

    <div>
        <text-section-title text="Recent Articles" backgroundColor="#90f6b7" ></text-section-title>
    </div>

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center bg-gray-100 font-bold uppercase tracking-widest">
        Chargement des articles...
    </div>

    <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Colonne gauche : Featured Card (placeholder) -->
      <div class="rounded-xl bg-gray-200 flex items-center justify-center min-h-[300px]">
        <span class="font-bold uppercase tracking-widest text-gray-500">Featured Card (US-004b)</span>
      </div>

      <!-- Colonne droite : Grille 2×2 petites cards -->
      <div class="grid grid-cols-2 gap-4">
        <article
          v-for="article in smallCards"
          :key="article._id"
          class="rounded-xl p-3 cursor-pointer transition-shadow hover:shadow-lg"
          :style="{ backgroundColor: getCardBackground(article.slug) }"
        >
          <a :href="`/article/read/${article.slug}`" class="block">
            <div
              class="h-32 rounded-lg bg-white/60 flex items-center justify-center overflow-hidden"
              :style="{
                backgroundImage: article.image ? `url(${article.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
            >
              <span v-if="!article.image" class="font-bold uppercase tracking-widest text-xs">Image</span>
            </div>

            <div class="pt-3">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 text-xs uppercase tracking-wide border border-black border-2"
              >
                {{ article.category }}
              </span>

              <h3 class="mt-2 text-sm font-bold leading-tight line-clamp-2">
                {{ article.title }}
              </h3>
            </div>
          </a>
        </article>
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
    const smallCards = computed(() => recent.value.slice(1, 5))

    // Couleurs de fond aléatoires SSR-safe (même pattern que Card.vue)
    const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', '#dde5fd']

    function getCardBackground(slug: string): string {
      return useState<string>(`recent-card-bg-${slug}`, () => {
        return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
      }).value
    }

</script>