import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useArticlesStore } from '@/stores/articlesStore'

// ===== MOCK DATA =====

const mockTopStories = [
  {
    _id: '1',
    title: 'Top Story One',
    slug: 'top-story-one',
    image: 'https://example.com/top1.jpg',
    category: 'Technologie',
    views: 5000,
    readTime: 7,
    author: { name: 'Alice', avatar: 'https://example.com/alice.jpg' },
  },
  {
    _id: '2',
    title: 'Top Story Two',
    slug: 'top-story-two',
    image: 'https://example.com/top2.jpg',
    category: 'Science',
    views: 3200,
    readTime: 5,
    author: { name: 'Bob', avatar: 'https://example.com/bob.jpg' },
  },
]

const mockRecentArticles = [
  {
    _id: '3',
    title: 'Recent Tech Article',
    slug: 'recent-tech',
    image: 'https://example.com/recent.jpg',
    category: 'Technologie',
    views: 800,
    readTime: 4,
    author: { name: 'Charlie', avatar: 'https://example.com/charlie.jpg' },
  },
]

const mockPopularArticles = [
  {
    _id: '4',
    title: 'Popular Article',
    slug: 'popular-article',
    image: 'https://example.com/popular.jpg',
    category: 'Cuisine',
    views: 12000,
    readTime: 6,
    author: { name: 'Diana', avatar: 'https://example.com/diana.jpg' },
  },
]

// ===== TESTS =====

describe('integration test: articlesStore', () => {
  let store: ReturnType<typeof useArticlesStore>
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useArticlesStore()

    // Mock $fetch sur globalThis (simulé par Nuxt en production)
    fetchMock = vi.fn()
    globalThis.$fetch = fetchMock as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete (globalThis as any).$fetch
  })

  // =============================================
  // fetchTopStories — API call + state population
  // =============================================

  describe('fetchTopStories', () => {
    it('calls the correct API endpoint and populates topStories', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopStories })

      await store.fetchTopStories(2)

      expect(fetchMock).toHaveBeenCalledWith('/api/articles/top-stories?limit=2')
      expect(store.topStories).toEqual(mockTopStories)
      expect(store.topStories).toHaveLength(2)
    })

    it('sets loading.topStories to true during fetch, false after', async () => {
      // Capturer l'état du loading pendant l'exécution du fetch
      let loadingDuringFetch = false

      fetchMock.mockImplementationOnce(() => {
        loadingDuringFetch = store.loading.topStories
        return Promise.resolve({ data: mockTopStories })
      })

      expect(store.loading.topStories).toBe(false)

      await store.fetchTopStories(2)

      expect(loadingDuringFetch).toBe(true)
      expect(store.loading.topStories).toBe(false)
    })

    it('sets cached.topStories to true after successful fetch', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopStories })

      expect(store.cached.topStories).toBe(false)

      await store.fetchTopStories(2)

      expect(store.cached.topStories).toBe(true)
    })

    it('does not call $fetch again when cache is active (cache prevents re-fetch)', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopStories })

      // Premier appel : fetch réel
      await store.fetchTopStories(2)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(store.topStories).toEqual(mockTopStories)

      // Deuxième appel : cache actif → pas de second fetch
      await store.fetchTopStories(2)
      expect(fetchMock).toHaveBeenCalledTimes(1) // Toujours 1
    })

    it('does not crash and keeps state unchanged on API error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.fetchTopStories(2)

      expect(store.topStories).toEqual([])
      expect(store.loading.topStories).toBe(false)
      expect(store.cached.topStories).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  // =============================================
  // fetchRecentByCategory — API call + state
  // =============================================

  describe('fetchRecentByCategory', () => {
    it('calls the correct API endpoint with category and limit, populates recent', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockRecentArticles })

      await store.fetchRecentByCategory('Technologie', 6)

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/articles/recent?category=Technologie&limit=6'
      )
      expect(store.recent).toEqual(mockRecentArticles)
      expect(store.recent).toHaveLength(1)
    })

    it('sets loading.recent to true during fetch, false after', async () => {
      let loadingDuringFetch = false

      fetchMock.mockImplementationOnce(() => {
        loadingDuringFetch = store.loading.recent
        return Promise.resolve({ data: mockRecentArticles })
      })

      expect(store.loading.recent).toBe(false)

      await store.fetchRecentByCategory('Technologie', 6)

      expect(loadingDuringFetch).toBe(true)
      expect(store.loading.recent).toBe(false)
    })

    it('does not crash and keeps state unchanged on API error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Server 500'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.fetchRecentByCategory('Technologie', 6)

      expect(store.recent).toEqual([])
      expect(store.loading.recent).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  // =============================================
  // fetchPopular — API call + state + cache
  // =============================================

  describe('fetchPopular', () => {
    it('calls the correct API endpoint and populates popular', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockPopularArticles })

      await store.fetchPopular(12)

      expect(fetchMock).toHaveBeenCalledWith('/api/articles/popular?limit=12')
      expect(store.popular).toEqual(mockPopularArticles)
    })

    it('sets loading.popular to true during fetch, false after', async () => {
      let loadingDuringFetch = false

      fetchMock.mockImplementationOnce(() => {
        loadingDuringFetch = store.loading.popular
        return Promise.resolve({ data: mockPopularArticles })
      })

      expect(store.loading.popular).toBe(false)

      await store.fetchPopular(12)

      expect(loadingDuringFetch).toBe(true)
      expect(store.loading.popular).toBe(false)
    })

    it('does not call $fetch again when cache is active', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockPopularArticles })

      await store.fetchPopular(12)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      await store.fetchPopular(12)
      expect(fetchMock).toHaveBeenCalledTimes(1) // Cache actif
    })

    it('does not crash and keeps state unchanged on API error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Timeout'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.fetchPopular(12)

      expect(store.popular).toEqual([])
      expect(store.loading.popular).toBe(false)
      expect(store.cached.popular).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  // =============================================
  // clearCache — reset du cache
  // =============================================

  describe('clearCache', () => {
    it('resets all cache flags to false', async () => {
      fetchMock.mockResolvedValue({ data: mockTopStories })
      await store.fetchTopStories(2)
      expect(store.cached.topStories).toBe(true)

      store.clearCache()

      expect(store.cached.topStories).toBe(false)
      expect(store.cached.recent).toBe(false)
      expect(store.cached.popular).toBe(false)
    })

    it('allows re-fetching after cache is cleared', async () => {
      fetchMock.mockResolvedValue({ data: mockTopStories })

      await store.fetchTopStories(2)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      // Cache actif → pas de re-fetch
      await store.fetchTopStories(2)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      // Clear cache → re-fetch possible
      store.clearCache()
      await store.fetchTopStories(2)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  // =============================================
  // Getters utilitaires
  // =============================================

  describe('getters', () => {
    it('getArticleById finds article across all collections', async () => {
      fetchMock
        .mockResolvedValueOnce({ data: mockTopStories })
        .mockResolvedValueOnce({ data: mockPopularArticles })

      await store.fetchTopStories(2)
      await store.fetchPopular(12)

      const found = store.getArticleById('4')
      expect(found).toBeDefined()
      expect(found?.title).toBe('Popular Article')
    })

    it('getArticleById returns undefined for non-existent id', () => {
      const found = store.getArticleById('non-existent')
      expect(found).toBeUndefined()
    })

    it('getTotalArticles returns combined count of all collections', async () => {
      fetchMock
        .mockResolvedValueOnce({ data: mockTopStories })
        .mockResolvedValueOnce({ data: mockRecentArticles })
        .mockResolvedValueOnce({ data: mockPopularArticles })

      await store.fetchTopStories(2)
      await store.fetchRecentByCategory('Technologie', 6)
      await store.fetchPopular(12)

      expect(store.getTotalArticles()).toBe(4) // 2 + 1 + 1
    })
  })
})
