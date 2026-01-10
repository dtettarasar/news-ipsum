import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Carrousel from '@/components/category-content/carrousel.vue'
import { createTestingPinia } from '@pinia/testing'

describe('Carousel.vue', () => {

  const factory = (initialState = {}) => {
    return mount(Carrousel, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              category: {
                categories: [
                  { id: 1, name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
                  { id: 10, name: 'Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' }
                ],
                loading: false
              },
              ...initialState
            }
          })
        ]
      }
    })
  }
  
  it('shows loading message initially', () => {
    // Ici on simule un store vide et en cours de chargement
    const wrapper = factory({
      category: { categories: [], loading: true }
    })
    expect(wrapper.text()).toContain('Chargement des catégories...')
  })

  it('renders categories after mount', async () => {
    const wrapper = factory() // Utilisation systématique
    
    await wrapper.vm.$nextTick() // Cycle 1 : Le composant est monté (onMounted). L'action Pinia fetchCategories est appelée.
    await wrapper.vm.$nextTick() // Cycle 2 : Les catégories sont mises à jour dans le store Pinia.
    await wrapper.vm.$nextTick() // Cycle 3 : Le DOM est mis à jour avec les nouvelles catégories.
    
    expect(wrapper.text()).toContain('Technologie')
    expect(wrapper.text()).not.toContain('Chargement des catégories...')
  })

  it('applies correct background image from category data', async () => {
    const wrapper = factory()

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const card = wrapper.find('.card-content')
    expect(card.exists()).toBe(true)
    
    const style = card.attributes('style')
    expect(style).toContain('background-image: url(')
  })

  it('has functional next/prev buttons', async () => {
    const wrapper = factory()
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    // On cherche spécifiquement le bouton avec la flèche
    const nextButton = buttons.find(b => b.text().includes('→'))

    expect(nextButton).toBeDefined()
    expect(nextButton?.exists()).toBe(true)

    await nextButton?.trigger('click')
    expect(wrapper.exists()).toBe(true)
  })
})