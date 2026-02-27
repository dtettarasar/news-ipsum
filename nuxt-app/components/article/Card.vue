<template>
  <article
    class="rounded-xl p-4 md:p-6"
    :style="{ backgroundColor: cardBackground }"
  >
    <div
      class="h-44 rounded-xl bg-white/60 flex items-center justify-center overflow-hidden"
      :style="{
        backgroundImage: props.image ? `url(${props.image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <span v-if="!props.image" class="font-bold uppercase tracking-widest text-sm">Image</span>
    </div>

    <div class="pt-4">
      <div class="flex items-center justify-between gap-3">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full bg-white/70 text-sm md:text-base lg:text-lg uppercase tracking-wide border border-black border-2"
        >
          {{ props.category }}
        </span>

        <!--<span class="text-xs font-semibold text-gray-700">26 fév. 2026</span>-->

      </div>

      <h3 class="mt-3 text-lg lg:text-2xl xl:text-3xl font-bold leading-tight line-clamp-3">
        {{ props.title }}
      </h3>

      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-700">
        <!-- Auteur -->
        <div class="flex items-center gap-1.5">
          <img
            v-if="props.authorAvatar"
            :src="props.authorAvatar"
            :alt="props.authorName"
            class="w-6 h-6 rounded-full border border-black flex-shrink-0 object-cover"
          />
          <div v-else class="w-6 h-6 rounded-full border border-black bg-gray-300 flex-shrink-0"></div>
          <span class="font-semibold whitespace-nowrap">{{ props.authorName }}</span>
        </div>

        <span class="text-gray-400">|</span>

        <!-- Temps de lecture -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          <span>{{ props.readTime }} min read</span>
        </div>

        <span class="text-gray-400">|</span>

        <!-- Nombre de vues -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:eye-outline" class="w-4 h-4" />
          <span>{{ formattedViews }}</span>
        </div>
      </div>

      <!-- Lien vers l'article -->
      <div class="mt-4 flex items-center gap-3">
        <span class="text-sm md:text-base font-semibold">Read Full Article</span>
        <a
          :href="`/article/read/${props.slug}`"
          class="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <Icon name="mdi:arrow-top-right" class="w-5 h-5" />
        </a>
      </div>
    </div>
  </article>

</template>

<script setup lang="ts">

interface Props {
  title: string
  slug: string
  image: string
  category: string
  authorName: string
  authorAvatar: string
  readTime: number
  views: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Titre de l\'article — maquette à valider',
  slug: 'future-web-development',
  image: '',
  category: 'Tech',
  authorName: 'Kristin Watson',
  authorAvatar: '',
  readTime: 9,
  views: 9000,
})

const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', '#dde5fd']

// useState : la couleur est générée une seule fois côté serveur,
// puis sérialisée et réutilisée côté client (pas de hydration mismatch).
const cardBackground = useState<string>(`card-bg-${props.slug}`, () => {
  return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
})

const formattedViews = computed(() => {
  if (props.views >= 1000) return `${(props.views / 1000).toFixed(0)}k`
  return String(props.views)
})
</script>
