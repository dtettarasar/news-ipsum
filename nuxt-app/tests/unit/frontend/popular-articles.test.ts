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

const PopularCardStub = {
  name: 'ArticlePopularCard',
  props: ['title', 'slug', 'image', 'category', 'authorName', 'readTime'],
  template: '<div class="popular-card-stub">{{ title }}</div>',
}

// Articles mock (6 articles de catégories variées)
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
  {
    _id: '22',
    title: 'The Future of Remote Work',
    slug: 'future-remote-work',
    image: 'https://example.com/remote.jpg',
    category: 'Business',
    views: 1350,
    likes: 120,
    readTime: 6,
    author: { name: 'John Smith', avatar: 'https://example.com/john.jpg' },
    createdAt: '2025-02-13',
  },
]

describe('unit test: article/MostPopular.vue', () => {
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
   * MostPopular.vue utilise `await useAsyncData()` (async setup).
   * On enveloppe le composant dans <Suspense> comme pour TopStories: 
   * Vue exige un boundary <Suspense> pour rendre un composant avec async setup.
   * Factory qui accepte une liste d'articles à injecter dans le store avant de rendre le composant.
*/

  async function factory(articles: typeof mockArticles = []) {

    // Mock de la méthode fetchMostPopular pour retourner les articles mockés
    store.popular = articles
    store.fetchPopular = vi.fn(async () => {
      store.popular = articles
    })

    const { default: PopularArticles } = await import('@/components/article/MostPopular.vue')

    const SuspenseWrapper = defineComponent({
      render() {
        return h(Suspense, null, {
          default: () => h(PopularArticles),
          fallback: () => h('div', 'Suspense fallback...'),
        })
      },
    })

    // On stubbe les composants enfants pour se concentrer sur MostPopular.vue

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
          'article-popular-card': PopularCardStub,
          'ArticlePopularCard': PopularCardStub,
        },
      },
    })

    await flushPromises() // Attendre que tous les micro-tâches soient terminés (notamment les promesses de fetchPopular)
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
  
    it('renders the "Most Popular" section title', async () => {
      wrapper = await factory(mockArticles)
      await waitForContent(wrapper, 'Most Popular')

      const titleElement = wrapper.find('.section-title-stub')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Most Popular')

    })

  // ===== ÉTAT DE CHARGEMENT =====

  it('shows loading state when store is empty', async () => {
    wrapper = await factory([])
    await nextTick()
    expect(wrapper.text()).toContain('Chargement des articles')
  })

  // ===== STORE INTERACTION =====
  
  it('calls fetchPopular on mount', async () => {
    wrapper = await factory(mockArticles)
    await nextTick()
    expect(store.fetchPopular).toHaveBeenCalled()
  })

  // ===== AFFICHAGE DES ARTICLES =====

  it('renders 6 small popular cards for articles', async () => {
      wrapper = await factory(mockArticles)
      const popularCards = wrapper.findAll('.popular-card-stub')
      expect(popularCards.length).toBe(6) // 6 articles dans le mock
  })

  it('renders the correct titles in the small cards', async () => {
      wrapper = await factory(mockArticles)
      await waitForContent(wrapper, 'Sleep Science and Productivity')
  
      expect(wrapper.text()).toContain('The Rise of Digital Democracy')
      expect(wrapper.text()).toContain('The Science of Athletic Performance')
      expect(wrapper.text()).toContain('Sleep Science and Productivity')
      expect(wrapper.text()).toContain('Color Psychology in UX Design')
      expect(wrapper.text()).toContain('Vue 3 Composition API Guide')
      expect(wrapper.text()).toContain('The Future of Remote Work')
  })

   // ===== CAS LIMITES =====

  it('renders correctly when there are less than 6 articles', async () => {

    const fewArticles = mockArticles.slice(0, 3) // Prendre seulement 3 articles
    wrapper = await factory(fewArticles)
    await waitForContent(wrapper, 'Sleep Science and Productivity')

    const popularCards = wrapper.findAll('.popular-card-stub')
    expect(popularCards.length).toBe(3) // Seulement 3 articles dans le store

    expect(wrapper.text()).toContain('The Rise of Digital Democracy')
    expect(wrapper.text()).toContain('The Science of Athletic Performance')
    expect(wrapper.text()).toContain('Sleep Science and Productivity')

  })

})