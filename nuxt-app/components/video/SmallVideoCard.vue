<template>

    <a
        :href="`/video/watch/${slug}`"
        class="bg-[#1f2937] block rounded-xl overflow-hidden relative cursor-pointer transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0px_#525252] h-full min-h-[300px]"
    >

        <div>
            
            <!-- Titre -->
            <h3 class="mt-2 text-lg md:text-2xl lg:text-3xl font-bold leading-tight text-white line-clamp-3">
                {{ title }}
            </h3>

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