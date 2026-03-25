import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'

// Stub pour le composant Icon (global, fourni par @nuxt/icon)
const IconStub = {
  name: 'Icon',
  props: ['name'],
  template: '<span class="icon-stub" :data-icon="name"></span>',
}

describe('unit test: article/PopularCard.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const fullProps = {

        title: 'The f1 World Championship: A Thrilling Season Ahead',
        slug: 'f1-world-championship-thrilling-season',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        category: 'Sport',
        authorName: 'Ayrton Senna',
        readTime: 5,

    }

    async function factory(props = {}) {
        const { default: PopularCard } = await import('@/components/article/PopularCard.vue')
        return mount(PopularCard, {
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
        expect(wrapper.text()).toContain('The f1 World Championship: A Thrilling Season Ahead')
    })

    it('renders a custom title passed via props', async () => {

        wrapper = await factory({ title: 'Custom Title Here' })
        await nextTick()
        expect(wrapper.text()).toContain('Custom Title Here')

    })

    it('renders default title when no prop is passed', async () => {

        const { default: PopularCard } = await import('@/components/article/PopularCard.vue')
        wrapper = mount(PopularCard, {
          global: { stubs: { Icon: IconStub } },
        })
        await nextTick()
        expect(wrapper.text()).toContain('Titre de l\'article — maquette à valider')

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
        wrapper = await factory({ category: 'Design' })
        await nextTick()
        const badge = wrapper.find('span.inline-flex')
        expect(badge.text()).toBe('Design')
    })

    // ===== AUTEUR =====

    it('displays the author name', async () => {
        wrapper = await factory()
        await nextTick()
        expect(wrapper.text()).toContain('Ayrton Senna')
    })

    it('displays a default name when authorName is not provided as prop', async () => {

        const { default: PopularCard } = await import('@/components/article/PopularCard.vue')
        wrapper = mount(PopularCard, {
          global: { stubs: { Icon: IconStub } },
        })

        await nextTick()

        const fallback = wrapper.find('div.text-gray-700')
        expect(fallback.exists()).toBe(true)
        expect(fallback.text()).toContain('Kristin Watson')

    })

     // ===== TEMPS DE LECTURE =====

    it('displays the read time', async () => {
        wrapper = await factory()
        await nextTick()
        expect(wrapper.text()).toContain('5 min read')
    })

    it('displays a different read time', async () => {
        wrapper = await factory({ readTime: 3 })
        await nextTick()
        expect(wrapper.text()).toContain('3 min read')
    })

    // ===== IMAGE =====

    it('sets background-image when image prop is provided', async () => {
        wrapper = await factory()
        await nextTick()
        const imageDiv = wrapper.find('.aspect-square')
        const style = imageDiv.attributes('style')
        expect(style).toContain('background-image')
        expect(style).toContain(fullProps.image)
    })

    it('shows placeholder text when image is empty', async () => {
        wrapper = await factory({ image: '' })
        await nextTick()
        const imageDiv = wrapper.find('.aspect-square')
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