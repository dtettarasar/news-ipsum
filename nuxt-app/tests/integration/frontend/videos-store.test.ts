import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVideosStore } from '@/stores/videosStore'

// ===== MOCK DATA =====

const mockTopVideos = [
  {
    _id: '12',
    title: 'E-Sports: Inside a $1 Billion Industry',
    slug: 'esports-billion-industry',
    thumbnail: 'https://example.com/esports.jpg',
    category: 'Sport',
    views: 13580,
    duration: 22,
    createdAt: '2025-02-19',
    author: { name: 'Zoé Bernard', avatar: 'https://example.com/zoe.jpg' },
  },
  {
    _id: '7',
    title: 'Building a Brand from Zero',
    slug: 'building-brand-from-zero',
    thumbnail: 'https://example.com/brand.jpg',
    category: 'Marketing',
    views: 11240,
    duration: 20,
    createdAt: '2025-02-11',
    author: { name: 'Hannah Kim', avatar: 'https://example.com/hannah.jpg' },
  },
]

// ===== TESTS =====

describe('integration test: videosStore', () => {
  let store: ReturnType<typeof useVideosStore>
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useVideosStore()

    fetchMock = vi.fn()
    globalThis.$fetch = fetchMock as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete (globalThis as any).$fetch
  })

  // =============================================
  // fetchTopVideos — API call + state population
  // =============================================

  describe('fetchTopVideos', () => {
    it('calls the correct API endpoint and populates topVideos', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos(5)

      expect(fetchMock).toHaveBeenCalledWith('/api/videos/top-videos?limit=5')
      expect(store.topVideos).toEqual(mockTopVideos)
      expect(store.topVideos).toHaveLength(2)
    })

    it('uses the default limit of 5 when no argument is provided', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos()

      expect(fetchMock).toHaveBeenCalledWith('/api/videos/top-videos?limit=5')
    })

    it('sets loading.topVideos to true during fetch, false after', async () => {
      let loadingDuringFetch = false

      fetchMock.mockImplementationOnce(() => {
        loadingDuringFetch = store.loading.topVideos
        return Promise.resolve({ data: mockTopVideos })
      })

      expect(store.loading.topVideos).toBe(false)

      await store.fetchTopVideos(5)

      expect(loadingDuringFetch).toBe(true)
      expect(store.loading.topVideos).toBe(false)
    })

    it('sets cached.topVideos to true after successful fetch', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      expect(store.cached.topVideos).toBe(false)

      await store.fetchTopVideos(5)

      expect(store.cached.topVideos).toBe(true)
    })

    it('does not call $fetch again when cache is active (cache prevents re-fetch)', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos(5)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      await store.fetchTopVideos(5)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('does not crash and keeps state unchanged on API error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.fetchTopVideos(5)

      expect(store.topVideos).toEqual([])
      expect(store.loading.topVideos).toBe(false)
      expect(store.cached.topVideos).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  // =============================================
  // clearCache — reset du cache
  // =============================================

  describe('clearCache', () => {
    it('resets cached.topVideos to false', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos(5)
      expect(store.cached.topVideos).toBe(true)

      store.clearCache()

      expect(store.cached.topVideos).toBe(false)
    })

    it('allows re-fetching after cache is cleared', async () => {
      fetchMock.mockResolvedValue({ data: mockTopVideos })

      await store.fetchTopVideos(5)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      await store.fetchTopVideos(5)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      store.clearCache()
      await store.fetchTopVideos(5)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  // =============================================
  // Getters utilitaires
  // =============================================

  describe('getters', () => {
    it('getVideoById finds a video in topVideos', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos(5)

      const found = store.getVideoById('7')
      expect(found).toBeDefined()
      expect(found?.title).toBe('Building a Brand from Zero')
    })

    it('getVideoById returns undefined for non-existent id', () => {
      const found = store.getVideoById('non-existent')
      expect(found).toBeUndefined()
    })

    it('getTotalVideos returns the count of topVideos', async () => {
      fetchMock.mockResolvedValueOnce({ data: mockTopVideos })

      await store.fetchTopVideos(5)

      expect(store.getTotalVideos()).toBe(2)
    })

    it('getTotalVideos returns 0 when store is empty', () => {
      expect(store.getTotalVideos()).toBe(0)
    })
  })
})
