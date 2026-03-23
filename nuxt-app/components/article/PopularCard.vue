<template>
  <article
    class="rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#000]"
    :style="{ backgroundColor: cardBackground }"
  >

    <a :href="`/article/read/${slug}`" class="p-4 md:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">

      <div
        class="self-start shrink-0 aspect-square w-full lg:w-44 rounded-xl bg-white/60 flex items-center justify-center overflow-hidden"
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
            class="inline-flex items-center px-3 py-1 rounded-full bg-white text-sm md:text-base lg:text-lg uppercase tracking-wide border border-black border-2"
          >
            {{ props.category }}
          </span>

        </div>

        <h3 class="mt-3 text-lg lg:text-2xl xl:text-3xl font-bold leading-tight line-clamp-3">
          {{ props.title }}
        </h3>

        <div class="mt-4 flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-700">
          <!-- Auteur -->
          <div class="flex items-center gap-1.5">
            <span class="font-semibold whitespace-nowrap">{{ props.authorName }}</span>
          </div>

          <span class="text-gray-400">|</span>

          <!-- Temps de lecture -->
          <div class="flex items-center gap-1">
            <Icon name="mdi:clock-outline" class="w-4 h-4" />
            <span>{{ props.readTime }} min read</span>
          </div>

        </div>

      </div>
    </a>
  </article>

</template>

<script setup lang="ts">

interface Props {
  title: string
  slug: string
  image: string
  category: string
  authorName: string
  readTime: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Titre de l\'article — maquette à valider',
  slug: 'future-web-development',
  image: '',
  category: 'Tech',
  authorName: 'Kristin Watson',
  readTime: 9,
})

const fallbackColors = ['#c5fbe1', '#f0fecd', '#f1d0fb', '#fdebdd', '#fddddd', '#dde5fd']

// useState : la couleur est générée une seule fois côté serveur,
// puis sérialisée et réutilisée côté client (pas de hydration mismatch).
const cardBackground = useState<string>(`card-bg-${props.slug}`, () => {
  return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
})

</script>