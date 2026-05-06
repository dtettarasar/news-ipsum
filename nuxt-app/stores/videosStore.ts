import { defineStore } from 'pinia'
import { ref } from 'vue'

// ===== INTERFACES TYPESCRIPT =====
interface Author {
  name: string
  avatar: string
}

interface Video {

  _id: string
  title: string
  slug: string
  thumbnail: string
  category: string
  views: number
  duration: number
  createdAt: string
  author: Author

}

interface LoadingState {
  topVideos: boolean
}

interface CacheState {
  topVideos: boolean
}

export const useVideosStore = defineStore('videos', () => {
  // ===== STATE =====
  const topVideos = ref<Video[]>([])
  const loading = ref<LoadingState>({
    topVideos: false,
  })
  const cached = ref<CacheState>({
    topVideos: false,
  })

  // ===== ACTIONS =====
  async function fetchTopVideos(limit: number = 5): Promise<void> {
    if (cached.value.topVideos) return

    loading.value.topVideos = true
    try {
      const response = await $fetch(`/api/videos/top-videos?limit=${limit}`)
      topVideos.value = response.data
      cached.value.topVideos = true
    } catch (error) {
      console.error('Error fetching top videos:', error)
    } finally {
      loading.value.topVideos = false
    }
  }

  function clearCache(): void {
    cached.value = {
      topVideos: false,
    }
  }

  // ===== GETTERS (optionnel mais utile) =====
  function getVideoById(id: string): Video | undefined {
    return [
      ...topVideos.value,
    ].find(video => video._id === id)
  }

  function getTotalVideos(): number {
    return topVideos.value.length
  }

  return {
    topVideos,
    loading,
    cached,
    fetchTopVideos,
    clearCache,
    getVideoById,
    getTotalVideos,
  }
})
