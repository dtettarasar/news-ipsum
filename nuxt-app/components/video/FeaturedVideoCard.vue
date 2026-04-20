<template>

  <a
    :href="`/video/watch/${slug}`"
    class="block rounded-xl overflow-hidden relative cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#fff] h-full min-h-[300px]"
    :style="{
      backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: thumbnail ? undefined : '#1f2937',
    }"
  >
    <!-- Overlay dégradé sombre pour lisibilité du texte -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

    <!-- Icône play centrée -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center backdrop-blur-sm">
        <Icon name="mdi:play" class="w-8 h-8 text-white ml-1" />
      </div>
    </div>

    <!-- Contenu en bas de la card -->
    <div class="absolute bottom-0 left-0 right-0 p-5">

      <!-- Badge catégorie -->
      <span class="inline-flex items-center px-3 py-1 rounded-full bg-white text-sm md:text-base lg:text-lg uppercase tracking-wide border-2 border-black">
        {{ category }}
      </span>

      <!-- Titre -->
      <h3 class="mt-2 text-lg md:text-2xl lg:text-3xl font-bold leading-tight text-white line-clamp-3">
        {{ title }}
      </h3>

      <!-- Barre d'infos -->
      <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">

        <span class="font-semibold whitespace-nowrap">{{ authorName }}</span>

        <span class="text-white/40">|</span>

        <div class="flex items-center gap-1">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          <span>{{ duration }} min</span>
        </div>

        <span class="text-white/40">|</span>

        <div class="flex items-center gap-1">
          <Icon name="mdi:eye-outline" class="w-4 h-4" />
          <span>{{ formattedViews }}</span>
        </div>

      </div>
    </div>
  </a>

</template>

<script setup lang="ts">

interface Props {
  title: string
  slug: string
  thumbnail: string
  category: string
  authorName: string
  duration: number
  views: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Titre de la vidéo — maquette à valider',
  slug: 'featured-video',
  thumbnail: '',
  category: 'Technologie',
  authorName: 'Auteur',
  duration: 0,
  views: 0,
})

const formattedViews = computed(() => {
  if (props.views >= 1000) return `${(props.views / 1000).toFixed(0)}k`
  return String(props.views)
})

</script>
