import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, defineComponent, h, Suspense } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useVideosStore } from '@/stores/videosStore'

// ===== STUBS =====

const SectionTitleStub = {
  name: 'TextSectionTitle',
  props: ['text', 'backgroundColor', 'textColor'],
  template: '<div class="section-title-stub">{{ text }}</div>',
}

const FeaturedVideoCardStub = {
  name: 'VideoFeaturedVideoCard',
  props: ['title', 'slug', 'thumbnail', 'category', 'authorName', 'duration', 'views'],
  template: '<div class="featured-video-card-stub">{{ title }}</div>',
}

const SmallVideoCardStub = {
  name: 'VideoSmallVideoCard',
  props: ['title', 'slug', 'thumbnail', 'category', 'authorName'],
  template: '<div class="small-video-card-stub">{{ title }}</div>',
}

// ===== MOCK DATA =====

const mockVideos = [
  {
    _id: '12',
    title: 'E-Sports: Inside a $1 Billion Industry',
    slug: 'esports-billion-industry',
    thumbnail: 'https://example.com/esports.jpg',
    category: 'Sport',
    views: 13580,
    duration: 22,
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
    author: { name: 'Hannah Kim', avatar: 'https://example.com/hannah.jpg' },
  },
  {
    _id: '14',
    title: 'The Economics of Inflation Explained',
    slug: 'economics-inflation-explained',
    thumbnail: 'https://example.com/inflation.jpg',
    category: 'Économie',
    views: 9980,
    duration: 19,
    author: { name: 'Oscar Fernandez', avatar: 'https://example.com/oscar.jpg' },
  },
  {
    _id: '4',
    title: 'Street Food Tour: Tokyo to Mexico City',
    slug: 'street-food-tour-tokyo-mexico',
    thumbnail: 'https://example.com/streetfood.jpg',
    category: 'Cuisine',
    views: 9310,
    duration: 24,
    author: { name: 'Xavier Kim', avatar: 'https://example.com/xavier.jpg' },
  },
  {
    _id: '8',
    title: 'Climate Change: What Governments Aren\'t Saying',
    slug: 'climate-change-governments',
    thumbnail: 'https://example.com/climate.jpg',
    category: 'Politique',
    views: 8460,
    duration: 16,
    author: { name: 'George Mitchell', avatar: 'https://example.com/george.jpg' },
  },
]

// ===== TESTS =====

describe('unit test: video/TopVideos.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useVideosStore>
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useVideosStore()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  async function factory(videos: typeof mockVideos = []) {
    store.topVideos = videos
    store.fetchTopVideos = vi.fn(async () => {
      store.topVideos = videos
    })

    const { default: TopVideos } = await import('@/components/video/TopVideos.vue')

    const SuspenseWrapper = defineComponent({
      render() {
        return h(Suspense, null, {
          default: () => h(TopVideos),
          fallback: () => h('div', 'Suspense fallback...'),
        })
      },
    })

    const w = mount(SuspenseWrapper, {
      global: {
        plugins: [pinia],
        stubs: {
          'text-section-title': SectionTitleStub,
          'TextSectionTitle': SectionTitleStub,
          'video-featured-video-card': FeaturedVideoCardStub,
          'VideoFeaturedVideoCard': FeaturedVideoCardStub,
          'video-small-video-card': SmallVideoCardStub,
          'VideoSmallVideoCard': SmallVideoCardStub,
        },
      },
    })

    await flushPromises()
    await nextTick()

    return w
  }

  async function waitForContent(w: ReturnType<typeof mount>, text: string, maxTicks = 10) {
    for (let i = 0; i < maxTicks; i++) {
      if (w.text().includes(text)) break
      await nextTick()
    }
  }

  // ===== TITRE DE SECTION =====

  it('renders the "Top Videos" section title', async () => {
    wrapper = await factory(mockVideos)
    await waitForContent(wrapper, 'Top Videos')
    expect(wrapper.text()).toContain('Top Videos')
  })

  // ===== ÉTAT DE CHARGEMENT =====

  it('shows loading state when store is empty', async () => {
    wrapper = await factory([])
    await nextTick()
    expect(wrapper.text()).toContain('Chargement des vidéos')
  })

  // ===== FEATURED VIDEO CARD =====

  it('renders the featured video card for the first video', async () => {
    wrapper = await factory(mockVideos)
    await waitForContent(wrapper, 'E-Sports: Inside a $1 Billion Industry')

    const featuredCard = wrapper.find('.featured-video-card-stub')
    expect(featuredCard.exists()).toBe(true)
    expect(featuredCard.text()).toContain('E-Sports: Inside a $1 Billion Industry')
  })

  // ===== SMALL VIDEO CARDS =====

  it('renders 4 small video cards for videos 2 to 5', async () => {
    wrapper = await factory(mockVideos)
    await waitForContent(wrapper, 'Building a Brand from Zero')

    const smallCards = wrapper.findAll('.small-video-card-stub')
    expect(smallCards.length).toBe(4)
  })

  it('renders the correct titles in the small cards', async () => {
    wrapper = await factory(mockVideos)
    await waitForContent(wrapper, 'Building a Brand from Zero')

    expect(wrapper.text()).toContain('Building a Brand from Zero')
    expect(wrapper.text()).toContain('The Economics of Inflation Explained')
    expect(wrapper.text()).toContain('Street Food Tour: Tokyo to Mexico City')
    expect(wrapper.text()).toContain("Climate Change: What Governments Aren't Saying")
  })

  it('does not include the featured video in the small cards', async () => {
    wrapper = await factory(mockVideos)
    await waitForContent(wrapper, 'E-Sports: Inside a $1 Billion Industry')

    const smallCards = wrapper.findAll('.small-video-card-stub')
    const cardTexts = smallCards.map(c => c.text())
    expect(cardTexts.every(t => !t.includes('E-Sports: Inside a $1 Billion Industry'))).toBe(true)
  })

  // ===== STORE INTERACTION =====

  it('calls fetchTopVideos on mount', async () => {
    wrapper = await factory(mockVideos)
    await nextTick()
    expect(store.fetchTopVideos).toHaveBeenCalled()
  })

  // ===== CAS LIMITES =====

  it('renders only 1 featured card and 0 small cards when store has 1 video', async () => {
    wrapper = await factory(mockVideos.slice(0, 1))
    await waitForContent(wrapper, 'E-Sports: Inside a $1 Billion Industry')

    expect(wrapper.find('.featured-video-card-stub').exists()).toBe(true)
    expect(wrapper.findAll('.small-video-card-stub').length).toBe(0)
  })

  it('renders 1 featured card and 2 small cards when store has 3 videos', async () => {
    wrapper = await factory(mockVideos.slice(0, 3))
    await waitForContent(wrapper, 'E-Sports: Inside a $1 Billion Industry')

    expect(wrapper.find('.featured-video-card-stub').exists()).toBe(true)
    expect(wrapper.findAll('.small-video-card-stub').length).toBe(2)
  })
})
