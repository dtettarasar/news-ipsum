// stores/categoryStore.ts
import { defineStore } from 'pinia'

export interface Category {
  _id: string; // On utilise maintenant l'ID de MongoDB
  name: string;
  image: string;
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCategories() {
      if (this.categories.length > 0) return

      this.loading = true
      this.error = null

      try {
        // Appelle ta nouvelle route API Nitro
        const data = await $fetch<Category[]>('/api/categories')
        this.categories = data
      } catch (err: any) {
        this.error = err.statusMessage || "Erreur lors de la récupération des catégories"
        console.error('Fetch error:', err)
      } finally {
        this.loading = false
      }
    }
  }
})