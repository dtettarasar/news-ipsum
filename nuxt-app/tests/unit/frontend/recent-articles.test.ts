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

const FeaturedCardStub = {
  name: 'ArticleFeaturedCard',
  props: ['title', 'slug', 'image', 'category'],
  template: '<div class="featured-card-stub">{{ title }}</div>',
}

const RecentCardStub = {
  name: 'ArticleRecentCard',
  props: ['title', 'slug', 'image', 'category'],
  template: '<div class="recent-card-stub">{{ title }}</div>',
}

// Articles mock (5 articles de catégories variées)
const mockArticles = [
  {
    _id: '31',
    title: 'The Rise of Digital Democracy',
    slug: 'digital-democracy',
    image: 'https://example.com/politics.jpg',
    category: 'Politique',
    views: 1640,
    likes: 148,
    readTime: 7,
    author: { name: 'Elena Russo', avatar: 'https://example.com/elena.jpg' },
    createdAt: '2025-02-18',
  },
  {
    _id: '46',
    title: 'The Science of Athletic Performance',
    slug: 'science-athletic-performance',
    image: 'https://example.com/sport.jpg',
    category: 'Sport',
    views: 1890,
    likes: 174,
    readTime: 7,
    author: { name: 'Valentina Cruz', avatar: 'https://example.com/valentina.jpg' },
    createdAt: '2025-02-17',
  },
  {
    _id: '51',
    title: 'Sleep Science and Productivity',
    slug: 'sleep-science-productivity',
    image: 'https://example.com/health.jpg',
    category: 'Santé',
    views: 2180,
    likes: 204,
    readTime: 7,
    author: { name: 'Elena Russo', avatar: 'https://example.com/elena.jpg' },
    createdAt: '2025-02-16',
  },
  {
    _id: '13',
    title: 'Color Psychology in UX Design',
    slug: 'color-psychology-ux',
    image: 'https://example.com/design.jpg',
    category: 'Design',
    views: 820,
    likes: 95,
    readTime: 5,
    author: { name: 'Mia Thompson', avatar: 'https://example.com/mia.jpg' },
    createdAt: '2025-02-15',
  },
  {
    _id: '3',
    title: 'Vue 3 Composition API Guide',
    slug: 'vue3-composition-guide',
    image: 'https://example.com/vue.jpg',
    category: 'Technologie',
    views: 1100,
    likes: 95,
    readTime: 7,
    author: { name: 'Carol Davis', avatar: 'https://example.com/carol.jpg' },
    createdAt: '2025-02-14',
  },
]

describe('unit test: article/Recent.vue', () => {
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
   * Recent.vue utilise `await useAsyncData()` (async setup).
   * On enveloppe le composant dans <Suspense> comme pour TopStories: 
   * Vue exige un boundary <Suspense> pour rendre un composant avec async setup.
   * Factory qui accepte une liste d'articles à injecter dans le store avant de rendre le composant.
   */
  async function factory(articles: typeof mockArticles = []) {
    store.recent = articles
    store.fetchRecent = vi.fn(async () => {
      store.recent = articles
    })

    const { default: Recent } = await import('@/components/article/Recent.vue')

    const SuspenseWrapper = defineComponent({
      render() {
        return h(Suspense, null, {
          default: () => h(Recent),
          fallback: () => h('div', 'Suspense fallback...'),
        })
      },
    })

    // On stubbe les composants enfants pour se concentrer sur Recent.vue

    /*
    les deux naming conventions sont utilisés (kebab-case et PascalCase)
    pour éviter les problèmes de compatibilité avec les différentes façons d'importer/stubber les composants dans les tests.
    Ce qui évite des tests qui passent dans un environnement et échouent dans un autre.
    */

    const w = mount(SuspenseWrapper, {
      global: {
        plugins: [pinia],
        stubs: {
          'text-section-title': SectionTitleStub,
          'TextSectionTitle': SectionTitleStub,
          'article-featured-card': FeaturedCardStub,
          'ArticleFeaturedCard': FeaturedCardStub,
          'article-recent-card': RecentCardStub,
          'ArticleRecentCard': RecentCardStub,
        },
      },
    })

    await flushPromises()
    await nextTick()

    return w
  }

  // Utilitaire : attendre que le contenu apparaisse (max N ticks)
  async function waitForContent(w: ReturnType<typeof mount>, text: string, maxTicks = 10) {
    for (let i = 0; i < maxTicks; i++) {
      if (w.text().includes(text)) break
      await nextTick()
    }
  }

  // ===== TITRE DE SECTION =====

  it('renders the "Recent Articles" section title', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'Recent Articles')
    expect(wrapper.text()).toContain('Recent Articles')
  })

  // ===== ÉTAT DE CHARGEMENT =====

  it('shows loading state when store is empty', async () => {
    wrapper = await factory([])
    await nextTick()
    expect(wrapper.text()).toContain('Chargement des articles')
  })

  // ===== AFFICHAGE DES ARTICLES =====

  it('renders the featured card for the first article', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'The Rise of Digital Democracy')

    const featuredCard = wrapper.find('.featured-card-stub')
    expect(featuredCard.exists()).toBe(true)
    expect(featuredCard.text()).toContain('The Rise of Digital Democracy')
  })

  it('renders 4 small recent cards for articles 2 to 5', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'The Science of Athletic Performance')

    const recentCards = wrapper.findAll('.recent-card-stub')
    expect(recentCards.length).toBe(4)
  })

  it('renders the correct titles in the small cards', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'Sleep Science and Productivity')

    expect(wrapper.text()).toContain('The Science of Athletic Performance')
    expect(wrapper.text()).toContain('Sleep Science and Productivity')
    expect(wrapper.text()).toContain('Color Psychology in UX Design')
    expect(wrapper.text()).toContain('Vue 3 Composition API Guide')
  })

  it('does not include the featured article in the small cards', async () => {
    wrapper = await factory(mockArticles)
    await waitForContent(wrapper, 'The Rise of Digital Democracy')

    const recentCards = wrapper.findAll('.recent-card-stub')
    const cardTexts = recentCards.map(c => c.text())
    expect(cardTexts.every(t => !t.includes('The Rise of Digital Democracy'))).toBe(true)
  })

  // ===== STORE INTERACTION =====

  it('calls fetchRecent on mount', async () => {
    wrapper = await factory(mockArticles)
    await nextTick()
    expect(store.fetchRecent).toHaveBeenCalled()
  })

  // ===== CAS LIMITES =====

  it('renders only 1 featured card and 0 small cards when store has 1 article', async () => {
    wrapper = await factory(mockArticles.slice(0, 1))
    await waitForContent(wrapper, 'The Rise of Digital Democracy')

    expect(wrapper.find('.featured-card-stub').exists()).toBe(true)
    expect(wrapper.findAll('.recent-card-stub').length).toBe(0)
  })

  it('renders 1 featured card and 2 small cards when store has 3 articles', async () => {
    wrapper = await factory(mockArticles.slice(0, 3))
    await waitForContent(wrapper, 'The Rise of Digital Democracy')

    expect(wrapper.find('.featured-card-stub').exists()).toBe(true)
    expect(wrapper.findAll('.recent-card-stub').length).toBe(2)
  })
})
