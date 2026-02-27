import { defineStore } from 'pinia'
import { ref } from 'vue'

// ===== INTERFACES TYPESCRIPT =====
interface Author {
  name: string
  avatar: string
}

interface Article {
  _id: string
  title: string
  slug: string
  image: string
  category: string
  views: number
  readTime: number
  author: Author
}

interface LoadingState {
  topStories: boolean
  recent: boolean
  popular: boolean
}

interface CacheState {
  topStories: boolean
  recent: boolean
  popular: boolean
}

// ===== STORE =====
export const useArticlesStore = defineStore('articles', () => {
  // ===== STATE =====
  const topStories = ref<Article[]>([])
  const recent = ref<Article[]>([])
  const popular = ref<Article[]>([])
  const loading = ref<LoadingState>({
    topStories: false,
    recent: false,
    popular: false,
  })
  const cached = ref<CacheState>({
    topStories: false,
    recent: false,
    popular: false,
  })

  // ===== ACTIONS =====
  async function fetchTopStories(limit: number = 5): Promise<void> {
    if (cached.value.topStories) return

    loading.value.topStories = true
    try {
      const response = await $fetch(`/api/articles/top-stories?limit=${limit}`)
      topStories.value = response.data
      cached.value.topStories = true
    } catch (error) {
      console.error('Failed to fetch top stories:', error)
    } finally {
      loading.value.topStories = false
    }
  }

  async function fetchRecentByCategory(
    category: string,
    limit: number = 6
  ): Promise<void> {
    loading.value.recent = true
    try {
      const response = await $fetch(
        `/api/articles/recent?category=${category}&limit=${limit}`
      )
      recent.value = response.data
    } catch (error) {
      console.error('Failed to fetch recent articles:', error)
    } finally {
      loading.value.recent = false
    }
  }

  async function fetchPopular(limit: number = 12): Promise<void> {
    if (cached.value.popular) return

    loading.value.popular = true
    try {
      const response = await $fetch(`/api/articles/popular?limit=${limit}`)
      popular.value = response.data
      cached.value.popular = true
    } catch (error) {
      console.error('Failed to fetch popular articles:', error)
    } finally {
      loading.value.popular = false
    }
  }

  function clearCache(): void {
    cached.value = {
      topStories: false,
      recent: false,
      popular: false,
    }
  }

  // ===== GETTERS (optionnel mais utile) =====
  function getArticleById(id: string): Article | undefined {
    return [
      ...topStories.value,
      ...recent.value,
      ...popular.value,
    ].find(article => article._id === id)
  }

  function getTotalArticles(): number {
    return topStories.value.length + recent.value.length + popular.value.length
  }

  // ===== RETURN STATE + ACTIONS =====
  return {
    // State
    topStories,
    recent,
    popular,
    loading,
    cached,

    // Actions
    fetchTopStories,
    fetchRecentByCategory,
    fetchPopular,
    clearCache,

    // Getters
    getArticleById,
    getTotalArticles,
  }
})