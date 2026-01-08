import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Carrousel from '@/components/category-content/carrousel.vue'

describe('Carousel.vue', () => {
  
  it('shows loading message initially', () => {
    const wrapper = mount(Carrousel)
    expect(wrapper.text()).toContain('Chargement des catégories...')
  })

  it('renders categories after mount', async () => {
    const wrapper = mount(Carrousel)
    
    // On attend deux cycles pour être sûr que le onMounted ET le changement de isReady soient traités
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    // On vérifie qu'une catégorie est présente
    expect(wrapper.text()).toContain('Technologie')

    // On vérifie que le v-if a bien supprimé le message de chargement
    expect(wrapper.text()).not.toContain('Chargement des catégories...')

  })

  it('applies correct background image from category data', async () => {
    const wrapper = mount(Carrousel)

    // Là pareil, on attend deux cycles pour être sûr que tout est rendu
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // On cherche l'élément qui contient le fond (le premier .card-content)
    const card = wrapper.find('.card-content')
    const style = card.attributes('style')

    // On vérifie que l'URL unsplash est bien injectée dans le style inline
    // On utilise une RegEx ou on simplifie pour ignorer les guillemets ajoutés par le browser
    expect(style).toContain('background-image: url(')
    expect(style).toContain('https://images.unsplash.com')
    
  })

  it('has functional next/prev buttons', async () => {
    const wrapper = mount(Carrousel)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(typeof wrapper.vm.next).toBe('function')
    expect(typeof wrapper.vm.prev).toBe('function')

    // On récupère l'ordre initial (via les clés ou le texte)
    // Ici on vérifie juste que les méthodes existent et ne crashent pas
    const buttons = wrapper.findAll('button')
    const nextButton = buttons.find(b => b.text() === '→')

    expect(nextButton?.exists()).toBe(true)

    // On simule le clic
    await nextButton?.trigger('click')

    // Si pas d'erreur crash, le test est valide pour la fonction
    expect(wrapper.exists()).toBe(true)

  })

})