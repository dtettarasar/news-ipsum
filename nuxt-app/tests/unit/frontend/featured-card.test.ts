import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

describe('unit test: article/FeaturedCard.vue', () => {
  let wrapper: ReturnType<typeof mount>

  const fullProps = {
    title: 'The Rise of Digital Democracy',
    slug: 'digital-democracy',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
    category: 'Politique',
  }

  async function factory(props = {}) {
    const { default: FeaturedCard } = await import('@/components/article/FeaturedCard.vue')
    return mount(FeaturedCard, {
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
    expect(wrapper.text()).toContain('The Rise of Digital Democracy')
  })

  it('renders a custom title passed via props', async () => {
    wrapper = await factory({ title: 'Custom Featured Title' })
    await nextTick()
    expect(wrapper.text()).toContain('Custom Featured Title')
  })

  it('renders the default title when no prop is passed', async () => {
    const { default: FeaturedCard } = await import('@/components/article/FeaturedCard.vue')
    wrapper = mount(FeaturedCard)
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
    expect(badge.text()).toBe('Politique')
  })

  it('displays a custom category', async () => {
    wrapper = await factory({ category: 'Sport' })
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.text()).toBe('Sport')
  })

  // ===== IMAGE (background) =====

  it('applies the image as background-image style', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('background-image')
    expect(link.attributes('style')).toContain(fullProps.image)
  })

  it('applies a fallback background-color when no image is provided', async () => {
    wrapper = await factory({ image: '' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('style')).toContain('background-color')
  })

  // ===== LIEN =====

  it('generates the correct href from the slug', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/article/read/digital-democracy')
  })

  it('generates a correct href for a custom slug', async () => {
    wrapper = await factory({ slug: 'my-custom-slug' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/article/read/my-custom-slug')
  })

  // ===== OVERLAY =====

  it('renders a dark gradient overlay for text readability', async () => {
    wrapper = await factory()
    await nextTick()
    const overlay = wrapper.find('.bg-gradient-to-t')
    expect(overlay.exists()).toBe(true)
  })

})
