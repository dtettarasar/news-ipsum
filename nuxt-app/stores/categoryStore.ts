// stores/categoryStore.ts
import { defineStore } from 'pinia'

export interface Category {
  id: number
  name: string
  image: string
}

export const useCategoryStore = defineStore('category', {
  // L'état (le State)
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null
  }),

  // Les actions (fonctions pour modifier l'état)
  actions: {
    async fetchCategories() {
      // Si les données sont déjà là, on ne fait rien (optimisation)
      if (this.categories.length > 0) return

        this.loading = true
        this.error = null

      try {
        // Simulation d'un appel API (on branchera le vrai fetch plus tard)
        const mockData: Category[] = [
          { id: 1, name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
          { id: 2, name: 'Politique', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500' },
          { id: 3, name: 'Culture', image: 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac?w=500' },
          { id: 4, name: 'Économie', image: 'https://images.unsplash.com/photo-1611974714851-eb6053e6235b?w=500' },
          { id: 5, name: 'Sport', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500' },
          { id: 6, name: 'Santé', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
          { id: 7, name: 'Spiritualité', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500' },
          { id: 8, name: 'Marketing', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500' },
          { id: 10, name: 'Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' }
        ]
        
        this.categories = mockData
      } catch (err) {
        this.error = "Impossible de charger les catégories"
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})