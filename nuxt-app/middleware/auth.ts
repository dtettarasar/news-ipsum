// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie('auth_token')

  // Si on est sur le serveur et qu'il n'y a pas de cookie -> Redirection immédiate
  if (import.meta.server && !authToken.value) {
    return navigateTo('/admin/login')
  }

  // Côté client, on laisse la page se charger, c'est le useFetch 
  // dans la page qui fera la police si le token est invalide.
  
})