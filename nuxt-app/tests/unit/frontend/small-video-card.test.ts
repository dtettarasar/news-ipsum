import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

describe('unit test: video/SmallVideoCard.vue', () => {
  let wrapper: ReturnType<typeof mount>

  const fullProps = {
    title: 'Building a Brand from Zero',
    slug: 'building-brand-from-zero',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800',
    category: 'Marketing',
    authorName: 'Hannah Kim',
  }

  async function factory(props = {}) {
    const { default: SmallVideoCard } = await import('@/components/video/SmallVideoCard.vue')
    return mount(SmallVideoCard, {
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
    expect(wrapper.text()).toContain('Building a Brand from Zero')
  })

  it('renders a custom title passed via props', async () => {
    wrapper = await factory({ title: 'Another Video Title' })
    await nextTick()
    expect(wrapper.text()).toContain('Another Video Title')
  })

  it('renders the default title when no prop is passed', async () => {
    const { default: SmallVideoCard } = await import('@/components/video/SmallVideoCard.vue')
    wrapper = mount(SmallVideoCard)
    await nextTick()
    expect(wrapper.text()).toContain('maquette à valider')
  })

  it('applies line-clamp-2 class on the title', async () => {
    wrapper = await factory()
    await nextTick()
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.classes()).toContain('line-clamp-2')
  })

  // ===== CATÉGORIE (badge) =====

  it('displays the category badge', async () => {
    wrapper = await factory()
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Marketing')
  })

  it('displays a custom category', async () => {
    wrapper = await factory({ category: 'Sport' })
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.text()).toBe('Sport')
  })

  // ===== THUMBNAIL =====

  it('applies the thumbnail as background-image style', async () => {
    wrapper = await factory()
    await nextTick()
    const thumbnailContainer = wrapper.find('[style*="background-image"]')
    expect(thumbnailContainer.exists()).toBe(true)
    expect(thumbnailContainer.attributes('style')).toContain(fullProps.thumbnail)
  })

  it('applies a fallback background-color when no thumbnail is provided', async () => {
    wrapper = await factory({ thumbnail: '' })
    await nextTick()
    const thumbnailContainer = wrapper.find('[style*="background-color"]')
    expect(thumbnailContainer.exists()).toBe(true)
  })

  // ===== ICÔNE PLAY =====

  it('renders a play icon on the thumbnail', async () => {
    wrapper = await factory()
    await nextTick()
    const playContainer = wrapper.find('.rounded-full')
    expect(playContainer.exists()).toBe(true)
  })

  // ===== AUTEUR =====

  it('displays the author name', async () => {
    wrapper = await factory()
    await nextTick()
    expect(wrapper.text()).toContain('Hannah Kim')
  })

  it('displays a custom author name', async () => {
    wrapper = await factory({ authorName: 'Zoé Bernard' })
    await nextTick()
    expect(wrapper.text()).toContain('Zoé Bernard')
  })

  // ===== LIEN =====

  it('generates the correct href from the slug', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/video/watch/building-brand-from-zero')
  })

  it('generates a correct href for a custom slug', async () => {
    wrapper = await factory({ slug: 'custom-video-slug' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/video/watch/custom-video-slug')
  })

  // ===== LAYOUT =====

  it('uses a flex layout for the 2-column structure', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.classes()).toContain('flex')
  })
})
