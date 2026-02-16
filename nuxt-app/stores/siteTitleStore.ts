import { defineStore } from 'pinia'

interface SiteTitleState {

    data: string,
    loading: boolean
    error: string | null

}

export const useSiteTitleStore = defineStore('siteTitle', {

    state: (): SiteTitleState => ({
  
      data: '',
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
  
          this.data = await $fetch<string>('/api/site-title')
          return this.data
  
        } catch(err: any) {
  
          this.error = err?.statusMessage ?? err?.message ?? 'Erreur lors du chargement du titre du site'
          return ''
  
        } finally {
          this.loading = false
        }
  
      }
  
    }
  
  })
  