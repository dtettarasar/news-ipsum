<template>

    <a
      :href="`/article/read/${slug}`"
      class="block rounded-xl overflow-hidden relative min-h-[300px] cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#000]"
      :style="{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: image ? undefined : '#d1d5db',
      }"
    >
      <!-- Overlay dégradé sombre pour lisibilité du texte -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      <!-- Contenu en bas de la card -->
      <div class="absolute bottom-0 left-0 right-0 p-5">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-xs uppercase tracking-wide border border-black border-2"
        >
          {{ category }}
        </span>

        <h3 class="mt-2 text-xl md:text-2xl font-bold leading-tight text-white line-clamp-3">
          {{ title }}
        </h3>
      </div>
    </a>

</template>

<script setup lang="ts">

    interface Props {
      title: string
      slug: string
      image: string
      category: string
    }

    const props = withDefaults(defineProps<Props>(), {
      title: 'Titre de l\'article — maquette à valider',
      slug: 'featured-article',
      image: '',
      category: 'Tech',
    })

</script>
