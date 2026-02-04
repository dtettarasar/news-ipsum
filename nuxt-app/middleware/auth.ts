// Hiérarchie des rôles (répliquée ici pour usage côté client, sans importer server/)
const ROLE_LEVEL: Record<string, number> = {
  admin: 3,
  editor: 2,
  user: 1
}

type MeResponse = { authenticated: boolean; user?: { role: string; redirectTo?: string } }

export default defineNuxtRouteMiddleware(async (to) => {
  const meta = to.meta.auth as { requiredRole?: string } | undefined
  const requiredRole = meta?.requiredRole
  const redirectTo = meta?.redirectTo  // optionnel, ex. '/admin'

  let data: MeResponse

  if (import.meta.server) {

    // SSR : la requête entrante contient le cookie ; on le transmet à l’appel interne
    const headers = useRequestHeaders(['cookie'])
    data = await $fetch<MeResponse>('/api/auth/me', {
      headers: headers.cookie ? { cookie: headers.cookie } : undefined
    }).catch(() => ({ authenticated: false }))

  } else {

    // Client : le navigateur envoie déjà les cookies (same-origin)
    // cache-control: no-store pour éviter les problèmes de cache (notamment en cas de changement de rôle)
    data = await $fetch<MeResponse>('/api/auth/me', {
      credentials: 'include',
      headers: { 'Cache-Control': 'no-store' }
    }).catch(() => ({ authenticated: false }))

  }

  // Quand on redirige vers login (non authentifié OU rôle insuffisant),
  // on force un rechargement pour éviter un hydration mismatch
  // (le DOM peut encore être celui de la page précédente / bfcache)
  const redirectToLogin = () =>
    navigateTo('/admin/login', { replace: true, external: true })

  if (!data.authenticated) {
    return redirectToLogin()
  }

  if (requiredRole) {
    const userLevel = ROLE_LEVEL[data.user?.role ?? ''] ?? 0
    const requiredLevel = ROLE_LEVEL[requiredRole] ?? 0
    if (userLevel < requiredLevel) {
      // Authentifié mais rôle insuffisant : page de repli ou login
      const target = redirectTo ?? '/admin/login'
      return navigateTo(target, { replace: true, external: true })
    }
  }
  
})