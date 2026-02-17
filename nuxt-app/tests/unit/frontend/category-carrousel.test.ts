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

    // click + attendre effet concret (ex: change de transform)
    const before = wrapper.find('.inner').attributes('style') || ''

    await nextButton?.trigger('click')

    let changed = false
    
    for (let i=0; i<10; i++) {
      if ((wrapper.find('.inner').attributes('style') || '') !== before) { changed = true; break }
      await nextTick()
    }

    expect(changed).toBe(true)
    
  })

})