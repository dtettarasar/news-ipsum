// stores/categoryStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// ===== INTERFACES TYPESCRIPT =====
interface CategoryItem {
  _id: string
  name: string
  image: string
  color?: string
}

// ===== STORE =====
export const useCategoryStore = defineStore('category', () => {
  // ===== STATE =====
  const data = ref<CategoryItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ===== ACTIONS =====
  async function fetchData(): Promise<CategoryItem[]> {
    // Éviter re-fetch si données déjà chargées
    if (data.value.length > 0) {
      return data.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<CategoryItem[]>('/api/categories')
      data.value = response
      return data.value
    } catch (err: any) {
      console.error('Failed to fetch categories:', err)
      error.value = err?.statusMessage ?? err?.message ?? 'Erreur lors du chargement des catégories'
      return []
    } finally {
      loading.value = false
    }
  }

  // ===== GETTERS =====
  function getCategoryBySlug(slug: string): CategoryItem | undefined {
    return data.value.find(cat => cat.name.toLowerCase() === slug.toLowerCase())
  }

  function getCategoryCount(): number {
    return data.value.length
  }

  // ===== RETURN =====
  return {
    // State
    data,
    loading,
    error,

    // Actions
    fetchData,

    // Getters
    getCategoryBySlug,
    getCategoryCount,
  }
})

