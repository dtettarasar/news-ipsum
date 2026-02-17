import { describe, it, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

import Carrousel from '@/components/category-content/carrousel.vue'

let pinia = createPinia()
beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

const categoriesMock = [
  { _id: '1', name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
  { _id: '10', name: 'Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' }
]

describe('Carousel.vue', () => {

  it('shows loading message initially', async () => {

    const store = useCategoryStore()
    store.data = []
    store.loading = true
    store.fetchData = vi.fn(async () => store.data)

    const wrapper = mount(Carrousel, { global: { plugins: [pinia] } })
    await nextTick()
    expect(wrapper.text()).toContain('Chargement des catégories...')

  })

  it('renders categories after mount', async () => {

    const store = useCategoryStore()
    store.data = categoriesMock
    store.loading = false
    store.fetchData = vi.fn(async () => store.data)

    const wrapper = mount(Carrousel, { global: { plugins: [pinia] } })
    await nextTick(); await nextTick(); await nextTick()
    expect(wrapper.text()).toContain('Technologie')
    expect(wrapper.text()).toContain('Cuisine')
    expect(wrapper.text()).not.toContain('Chargement des catégories...')

  })

  it('applies correct background image from category data', async () => {

    const store = useCategoryStore()
    store.data = categoriesMock
    store.loading = false
    store.fetchData = vi.fn(async () => store.data)

    const wrapper = mount(Carrousel, { global: { plugins: [pinia] } })
    await nextTick(); await nextTick(); await nextTick()

    const card = wrapper.find('.card-content')
    expect(card.exists()).toBe(true)
    const style = card.attributes('style') || ''
    expect(style).toContain('background-image: url(')
    expect(style).toContain('https://images.unsplash.com/photo-1518770660439-4636190af475?w=500')

  })

  it('has functional next/prev buttons', async () => {

    const store = useCategoryStore()
    store.data = categoriesMock
    store.loading = false
    store.fetchData = vi.fn(async () => store.data)
    
    const wrapper = mount(Carrousel, { global: { plugins: [pinia] } })

    // attendre l'apparition des cartes (max 10 cycles microtasks)
    let found = false
    for (let i = 0; i < 10; i++) {

      if (wrapper.find('.card-content').exists()) { 

        found = true
        break

      }

      await nextTick()
    }

    expect(found).toBe(true)

    // attendre l'apparition du bouton "→" (max 10 cycles microtasks)
    let nextButton = undefined
    let prevButton = undefined

    for (let i = 0; i < 10; i++) {

      const buttons = wrapper.findAll('button')
      nextButton = buttons.find(b => b.text().includes('→'))
      prevButton = buttons.find(b => b.text().includes('←'))

      if (nextButton && prevButton) break
      await nextTick()

    }

    expect(nextButton).toBeDefined()
    expect(nextButton?.exists()).toBe(true)
    expect(prevButton).toBeDefined()
    expect(prevButton?.exists()).toBe(true)

    // lire le style inline actuel de .inner (attribut style)
    const beforeStyle = wrapper.find('.inner').attributes('style') || ''

    // simuler le click sur le bouton "→"
    await nextButton?.trigger('click')

    // attendre que l'attribut style change (max 10 ticks)
    let styleChanged = false
    for (let i = 0; i < 10; i++) {
      const currentStyle = wrapper.find('.inner').attributes('style') || ''
      if (currentStyle !== beforeStyle) { styleChanged = true; break }
      await nextTick()
    }

    // Assertions concrètes : l'attribut `style` a changé et contient bien une translation
    expect(styleChanged).toBe(true)
    const newStyle = wrapper.find('.inner').attributes('style') || ''
    expect(newStyle).toContain('translateX') // prouve qu'une translation a été appliquée
    
  })

})