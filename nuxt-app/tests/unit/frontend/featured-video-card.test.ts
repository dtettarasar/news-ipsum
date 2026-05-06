import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

describe('unit test: video/FeaturedVideoCard.vue', () => {
  let wrapper: ReturnType<typeof mount>

  const fullProps = {
    title: 'E-Sports: Inside a $1 Billion Industry',
    slug: 'esports-billion-industry',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    category: 'Sport',
    authorName: 'Zoé Bernard',
    duration: 22,
    views: 13580,
  }

  async function factory(props = {}) {
    const { default: FeaturedVideoCard } = await import('@/components/video/FeaturedVideoCard.vue')
    return mount(FeaturedVideoCard, {
      props: { ...fullProps, ...props },
    })
  }

  afterEach(() => {
    wrapper?.unmount()
  })

  // ===== TITRE =====

  it('renders the title from props', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('E-Sports: Inside a $1 Billion Industry')
  })

  it('renders a custom title passed via props', async () => {
    wrapper = await factory({ title: 'Custom Video Title' })
    await nextTick()
    expect(wrapper.text()).toContain('Custom Video Title')
  })

  it('renders the default title when no prop is passed', async () => {
    const { default: FeaturedVideoCard } = await import('@/components/video/FeaturedVideoCard.vue')
    wrapper = mount(FeaturedVideoCard)
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
    expect(badge.text()).toBe('Sport')
  })

  it('displays a custom category', async () => {
    wrapper = await factory({ category: 'Technologie' })
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.text()).toBe('Technologie')
  })

  // ===== THUMBNAIL (background) =====

  it('applies the thumbnail as background-image style', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('background-image')
    expect(link.attributes('style')).toContain(fullProps.thumbnail)
  })

  it('applies a fallback background-color when no thumbnail is provided', async () => {
    wrapper = await factory({ thumbnail: '' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('background-color')
  })

  // ===== OVERLAY =====

  it('renders a dark gradient overlay for text readability', async () => {
    wrapper = await factory()
    await nextTick()
    const overlay = wrapper.find('.bg-gradient-to-t')
    expect(overlay.exists()).toBe(true)
  })

  // ===== ICÔNE PLAY =====

  it('renders a play icon centered on the card', async () => {
    wrapper = await factory()
    await nextTick()
    const playContainer = wrapper.find('.rounded-full')
    expect(playContainer.exists()).toBe(true)
  })

  // ===== BARRE D'INFOS =====

  it('displays the author name', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('Zoé Bernard')
  })

  it('displays the duration in minutes', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('22 min')
  })

  it('displays a custom duration', async () => {
    wrapper = await factory({ duration: 5 })
    await nextTick()
    expect(wrapper.text()).toContain('5 min')
  })

  it('formats views >= 1000 as "Xk"', async () => {
    wrapper = await factory({ views: 13580 })
    await nextTick()
    expect(wrapper.text()).toContain('14k')
  })

  it('displays views below 1000 as plain number', async () => {
    wrapper = await factory({ views: 850 })
    await nextTick()
    expect(wrapper.text()).toContain('850')
  })

  // ===== LIEN =====

  it('generates the correct href from the slug', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/video/watch/esports-billion-industry')
  })

  it('generates a correct href for a custom slug', async () => {
    wrapper = await factory({ slug: 'my-video-slug' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/video/watch/my-video-slug')
  })
})
