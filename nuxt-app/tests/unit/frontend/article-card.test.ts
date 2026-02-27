import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

// Stub pour le composant Icon (global, fourni par @nuxt/icon)
const IconStub = {
  name: 'Icon',
  props: ['name'],
  template: '<span class="icon-stub" :data-icon="name"></span>',
}

describe('unit test: article/Card.vue', () => {
  let wrapper: ReturnType<typeof mount>

  // Props complètes pour les tests
  const fullProps = {
    title: 'AI and Machine Learning Trends',
    slug: 'ai-ml-trends',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    category: 'Technologie',
    authorName: 'Jack Davis',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    readTime: 9,
    views: 2100,
  }

  async function factory(props = {}) {
    const { default: Card } = await import('@/components/article/Card.vue')
    return mount(Card, {
      props: { ...fullProps, ...props },
      global: {
        stubs: { Icon: IconStub },
      },
    })
  }

  afterEach(() => {
    wrapper?.unmount()
  })

  // ===== TITRE =====

  it('renders the title from props', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('AI and Machine Learning Trends')
  })

  it('renders a custom title passed via props', async () => {
    wrapper = await factory({ title: 'Custom Title Here' })
    await nextTick()
    expect(wrapper.text()).toContain('Custom Title Here')
  })

  it('renders default title when no prop is passed', async () => {
    const { default: Card } = await import('@/components/article/Card.vue')
    wrapper = mount(Card, {
      global: { stubs: { Icon: IconStub } },
    })
    await nextTick()
    expect(wrapper.text()).toContain('maquette à valider')
  })

  it('applies line-clamp-3 class on the title', async () => {
    wrapper = await factory()
    await nextTick()
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.classes()).toContain('line-clamp-3')
  })

  // ===== CATÉGORIE (badge) =====

  it('displays the category badge', async () => {
    wrapper = await factory()
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Technologie')
  })

  it('displays a custom category', async () => {
    wrapper = await factory({ category: 'Design' })
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.text()).toBe('Design')
  })

  // ===== AUTEUR =====

  it('displays the author name', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('Jack Davis')
  })

  it('displays the author avatar when provided', async () => {
    wrapper = await factory()
    await nextTick()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(fullProps.authorAvatar)
    expect(img.attributes('alt')).toBe('Jack Davis')
  })

  it('displays a fallback circle when authorAvatar is empty', async () => {
    wrapper = await factory({ authorAvatar: '' })
    await nextTick()
    // Pas d'img
    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
    // Cercle gris de fallback
    const fallback = wrapper.find('.bg-gray-300.rounded-full')
    expect(fallback.exists()).toBe(true)
  })

  // ===== TEMPS DE LECTURE =====

  it('displays the read time', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('9 min read')
  })

  it('displays a different read time', async () => {
    wrapper = await factory({ readTime: 3 })
    await nextTick()
    expect(wrapper.text()).toContain('3 min read')
  })

  // ===== NOMBRE DE VUES (formatage) =====

  it('formats views >= 1000 with "k" suffix', async () => {
    wrapper = await factory({ views: 2100 })
    await nextTick()
    expect(wrapper.text()).toContain('2k')
  })

  it('formats views >= 1000 (round)', async () => {
    wrapper = await factory({ views: 9000 })
    await nextTick()
    expect(wrapper.text()).toContain('9k')
  })

  it('displays views < 1000 as plain number', async () => {
    wrapper = await factory({ views: 450 })
    await nextTick()
    expect(wrapper.text()).toContain('450')
  })

  it('displays 0 views', async () => {
    wrapper = await factory({ views: 0 })
    await nextTick()
    expect(wrapper.text()).toContain('0')
  })

  // ===== LIEN "READ FULL ARTICLE" =====

  it('displays "Read Full Article" text', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('Read Full Article')
  })

  it('builds the article link with the slug', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/article/read/ai-ml-trends')
  })

  it('builds a link with a different slug', async () => {
    wrapper = await factory({ slug: 'docker-101' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/article/read/docker-101')
  })

  // ===== IMAGE =====

  it('sets background-image when image prop is provided', async () => {
    wrapper = await factory()
    await nextTick()
    const imageDiv = wrapper.find('.h-44')
    const style = imageDiv.attributes('style')
    expect(style).toContain('background-image')
    expect(style).toContain(fullProps.image)
  })

  it('shows placeholder text when image is empty', async () => {
    wrapper = await factory({ image: '' })
    await nextTick()
    const imageDiv = wrapper.find('.h-44')
    expect(imageDiv.text()).toBe('Image')
    // Pas de background-image
    const style = imageDiv.attributes('style') || ''
    expect(style).not.toContain('background-image')
  })

  // ===== BACKGROUND COLOR =====

  it('applies a background color on the article element', async () => {
    wrapper = await factory()
    await nextTick()
    const article = wrapper.find('article')
    const style = article.attributes('style')
    expect(style).toContain('background-color')
  })
})
