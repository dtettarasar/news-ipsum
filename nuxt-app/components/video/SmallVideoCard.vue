<template>

  <a
    :href="`/video/watch/${slug}`"
    class="flex gap-3 cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#525252] rounded-xl overflow-hidden"
  >

    <!-- Colonne gauche : thumbnail + icône play (~40%) -->
    <div class="relative basis-[40%] flex-shrink-0 rounded-xl overflow-hidden min-h-[120px]"
      :style="{
        backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: thumbnail ? undefined : '#374151',
      }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-9 h-9 rounded-full bg-white/20 border border-white flex items-center justify-center backdrop-blur-sm">
          <Icon name="mdi:play" class="w-4 h-4 text-white ml-0.5" />
        </div>
      </div>
    </div>

    <!-- Colonne droite : catégorie + titre + auteur (~60%) -->
    <div class="basis-[60%] flex flex-col justify-center gap-1.5 py-1">

      <!-- Badge catégorie -->
      <span class="self-start inline-flex items-center px-2.5 py-1 rounded-full bg-[#374151] text-sm uppercase tracking-wide text-gray-300">
        {{ category }}
      </span>

      <!-- Titre -->
      <h3 class="text-base font-bold leading-snug text-white line-clamp-2">
        {{ title }}
      </h3>

      <!-- Auteur -->
      <p class="text-sm text-gray-400">by {{ authorName }}</p>

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
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Titre de la vidéo — maquette à valider',
  slug: 'featured-video',
  thumbnail: '',
  category: 'Technologie',
  authorName: 'Auteur',
})

</script>