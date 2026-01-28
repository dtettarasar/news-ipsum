import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { name: string; role: string; email: string } | null,
    authenticated: false
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData
      this.authenticated = true
    },
    logout() {
      this.user = null
      this.authenticated = false
    }
  }
})