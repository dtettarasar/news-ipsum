// stores/categoryStore.ts
import { defineStore } from 'pinia'

interface CategoryItem {
  _id: string; // On utilise maintenant l'ID de MongoDB
  name: string;
  image: string;
}

interface CategoryState {

  data: CategoryItem[]
  loading: boolean
  error: string | null

}

export const useCategoryStore = defineStore('category', {

  state: (): CategoryState => ({

    data: [],
    loading: false,
    error: null as string | null,

  }),

  actions: {

    async fetchData() {

      if (this.data.length > 0) { 

        return this.data
        
      }

      this.loading = true
      this.error = null

      try {

        this.data = await $fetch<string[]>('/api/categories')
        return this.data

      } catch(err: any) {

        this.error = err?.statusMessage ?? err?.message ?? 'Erreur lors du chargement des catégories'
        return []

      } finally {
        this.loading = false
      }

    }

  }

})

/*
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
      } finally {
        this.loading = false
      }
    }
  }
})*/

