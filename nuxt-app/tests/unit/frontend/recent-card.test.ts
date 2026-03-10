import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

describe('unit test: article/RecentCard.vue', () => {
  let wrapper: ReturnType<typeof mount>

  const fullProps = {
    title: 'Healthy Smoothie Recipes',
    slug: 'healthy-smoothies',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    category: 'Cuisine',
  }

  async function factory(props = {}) {
    const { default: RecentCard } = await import('@/components/article/RecentCard.vue')
    return mount(RecentCard, {
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
    expect(wrapper.text()).toContain('Healthy Smoothie Recipes')
  })

  it('renders a custom title passed via props', async () => {
    wrapper = await factory({ title: 'Another Recent Article' })
    await nextTick()
    expect(wrapper.text()).toContain('Another Recent Article')
  })

  it('renders the default title when no prop is passed', async () => {
    const { default: RecentCard } = await import('@/components/article/RecentCard.vue')
    wrapper = mount(RecentCard)
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
    expect(badge.text()).toBe('Cuisine')
  })

  it('displays a custom category', async () => {
    wrapper = await factory({ category: 'Marketing' })
    await nextTick()
    const badge = wrapper.find('span.inline-flex')
    expect(badge.text()).toBe('Marketing')
  })

  // ===== IMAGE =====

  it('applies the image as background-image style on the image container', async () => {
    wrapper = await factory()
    await nextTick()
    const imageContainer = wrapper.find('[style*="background-image"]')
    expect(imageContainer.exists()).toBe(true)
    expect(imageContainer.attributes('style')).toContain(fullProps.image)
  })

  it('shows a placeholder text when no image is provided', async () => {
    wrapper = await factory({ image: '' })
    await nextTick()
    const placeholder = wrapper.find('span')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text().toLowerCase()).toContain('image')
  })

  // ===== LIEN =====

  it('generates the correct href from the slug', async () => {
    wrapper = await factory()
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/article/read/healthy-smoothies')
  })

  it('generates a correct href for a custom slug', async () => {
    wrapper = await factory({ slug: 'another-slug' })
    await nextTick()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/article/read/another-slug')
  })

  // ===== COULEUR DE FOND SSR-SAFE =====

  it('applies a background color on the card wrapper', async () => {
    wrapper = await factory()
    await nextTick()
    const article = wrapper.find('article')
    expect(article.exists()).toBe(true)
    expect(article.attributes('style')).toContain('background-color')
  })

})
