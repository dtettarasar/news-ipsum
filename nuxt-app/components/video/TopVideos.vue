<template>
  
  <div>
    <text-section-title text="Top Videos" backgroundColor="oklch(43.9% 0 0)" textColor="#fff" ></text-section-title>
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

  console.log('Top Videos:', topVideos.value)

</script>
