<template>

  <div class="bg-black px-2 py-6">
    <text-section-title text="Top Videos" backgroundColor="#525252" textColor="#fff" />

    <div v-if="!isReady" class="mt-6 h-[300px] flex items-center justify-center font-bold uppercase tracking-widest text-white">
      Chargement des vidéos...
    </div>

    <div v-else class="mt-6 flex flex-col md:flex-row gap-4">

      <!-- Colonne gauche : Featured Video Card (~60%) -->
      <div class="w-full md:basis-[60%]">
        <video-featured-video-card
          v-if="featuredVideo"
          :title="featuredVideo.title"
          :slug="featuredVideo.slug"
          :thumbnail="featuredVideo.thumbnail"
          :category="featuredVideo.category"
          :author-name="featuredVideo.author.name"
          :duration="featuredVideo.duration"
          :views="featuredVideo.views"
        />
      </div>

      <!-- Colonne droite : 4 Small Video Cards empilées (~40%) -->
      <div v-if="smallCards" class="w-full md:basis-[40%] flex flex-col gap-4">
        
        <video-small-video-card
        
        v-for="video in smallCards"
        :key="video._id"
        :title="video.title"
        :slug="video.slug"
        :thumbnail="video.thumbnail"
        :category="video.category"
        :author-name="video.author.name"
        
        />

      </div>

    </div>
  </div>

</template>

<script setup lang="ts">

  import { useVideosStore } from '@/stores/videosStore'
  import { storeToRefs } from 'pinia'

  const videosStore = useVideosStore()
  const isReady = ref(false)

  const { topVideos } = storeToRefs(videosStore)

  await useAsyncData('topVideos', async () => {
    await videosStore.fetchTopVideos(5)
    return topVideos.value
  })

  isReady.value = topVideos.value && topVideos.value.length > 0

  const featuredVideo = computed(() => topVideos.value?.[0] ?? null)
  const smallCards = computed(() => topVideos.value.slice(1, 5))

</script>
