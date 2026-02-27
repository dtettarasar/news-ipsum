import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, defineComponent, h, Suspense } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useArticlesStore } from '@/stores/articlesStore'

// Stubs pour les composants enfants
const SectionTitleStub = {
  name: 'TextSectionTitle',
  props: ['text', 'backgroundColor'],
  template: '<div class="section-title-stub">{{ text }}</div>',
}

const ArticleCardStub = {
  name: 'ArticleCard',
  props: ['title', 'slug', 'image', 'category', 'authorName', 'authorAvatar', 'readTime', 'views'],
  template: '<div class="article-card-stub">{{ title }}</div>',
}

// Articles mock
const mockArticles = [
  {
    _id: '10',
    title: 'AI and Machine Learning Trends',
    slug: 'ai-ml-trends',
    image: 'https://example.com/ai.jpg',
    category: 'Technologie',
    views: 2100,
    readTime: 9,
    author: { name: 'Jack Davis', avatar: 'https://example.com/jack.jpg' },
  },
  {
    _id: '9',
    title: 'Web3 and Blockchain Basics',
    slug: 'web3-blockchain',
    image: 'https://example.com/web3.jpg',
    category: 'Technologie',
    views: 1680,
    readTime: 6,
    author: { name: 'Iris Martinez', avatar: 'https://example.com/iris.jpg' },
  },
  {
    _id: '27',
    title: 'Street Food Around the World',
    slug: 'street-food-world',
    image: 'https://example.com/food.jpg',
    category: 'Cuisine',
    views: 1850,
    readTime: 6,
    author: { name: 'Aaron Bell', avatar: 'https://example.com/aaron.jpg' },
  },
  {
    _id: '22',
    title: 'Italian Pasta Mastery',
    slug: 'italian-pasta',
    image: 'https://example.com/pasta.jpg',
    category: 'Cuisine',
    views: 2050,
    readTime: 5,
    author: { name: 'Vincenzo Romano', avatar: 'https://example.com/vincenzo.jpg' },
  },
]

describe('unit test: article/TopStories.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useArticlesStore>
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useArticlesStore()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  /**
   * Le composant TopStories utilise `await useAsyncData()` (async setup).
   * Vue exige un boundary <Suspense> pour rendre un composant avec async setup.
   * On crée un wrapper qui englobe TopStories dans <Suspense>.
   */
  async function factory(articles: typeof mockArticles = []) {
    store.topStories = articles
    store.fetchTopStories = vi.fn(async () => {
      store.topStories = articles
    })

    const { default: TopStories } = await import('@/components/article/TopStories.vue')

    const SuspenseWrapper = defineComponent({
      render() {
        return h(Suspense, null, {
          default: () => h(TopStories),
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
          'article-card': ArticleCardStub,
          'ArticleCard': ArticleCardStub,
        },
      },
    })

    // Attendre que l'async setup se termine et que Suspense resolve
    await flushPromises()
    await nextTick()

    return w
  }

  // Utilitaire : attendre que le contenu apparaisse (max N ticks)
  async function waitForContent(w: ReturnType<typeof mount>, text: string, maxTicks = 10): Promise<boolean> {
    for (let i = 0; i < maxTicks; i++) {
      if (w.text().includes(text)) return true
      await nextTick()
    }
    return false
  }

  // ===== SECTION TITLE =====

  it('displays the "Top Stories" section title', async () => {
    wrapper = await factory(mockArticles)
    await nextTick()
    expect(wrapper.text()).toContain('Top Stories')
  })

  // ===== LOADING STATE =====

  it('shows loading message when store has no data', async () => {
    wrapper = await factory([])
    await nextTick()
    expect(wrapper.text()).toContain('Chargement des articles...')
  })

  it('does not show the grid when data is empty', async () => {
    wrapper = await factory([])
    await nextTick()
    const cards = wrapper.findAll('.article-card-stub')
    expect(cards.length).toBe(0)
  })

  // ===== DATA LOADED =====

  it('shows the grid of cards when data is available', async () => {
    wrapper = await factory(mockArticles)

    const found = await waitForContent(wrapper, 'AI and Machine Learning Trends')
    expect(found).toBe(true)
  })

  it('does not show loading message when data is available', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'AI and Machine Learning Trends')

    expect(wrapper.text()).not.toContain('Chargement des articles...')
  })

  it('renders the correct number of article cards', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'AI and Machine Learning Trends')

    const cards = wrapper.findAll('.article-card-stub')
    expect(cards.length).toBe(4)
  })

  it('renders cards with the correct titles', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'AI and Machine Learning Trends')

    expect(wrapper.text()).toContain('AI and Machine Learning Trends')
    expect(wrapper.text()).toContain('Web3 and Blockchain Basics')
    expect(wrapper.text()).toContain('Street Food Around the World')
    expect(wrapper.text()).toContain('Italian Pasta Mastery')
  })

  // ===== STORE INTERACTION =====

  it('calls fetchTopStories on mount', async () => {
    wrapper = await factory(mockArticles)
    await nextTick()

    expect(store.fetchTopStories).toHaveBeenCalled()
  })

  // ===== DIFFERENT DATA SETS =====

  it('renders only 2 cards when store has 2 articles', async () => {
    const twoArticles = mockArticles.slice(0, 2)
    wrapper = await factory(twoArticles)
    await waitForContent(wrapper, 'AI and Machine Learning Trends')

    const cards = wrapper.findAll('.article-card-stub')
    expect(cards.length).toBe(2)
  })
})
