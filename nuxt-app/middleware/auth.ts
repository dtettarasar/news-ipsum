// Hiérarchie des rôles (répliquée ici pour usage côté client, sans importer server/)
const ROLE_LEVEL: Record<string, number> = {
  admin: 3,
  editor: 2,
  user: 1
}

type MeResponse = { authenticated: boolean; user?: { role: string } }

export default defineNuxtRouteMiddleware(async (to) => {
  const meta = to.meta.auth as { requiredRole?: string } | undefined
  const requiredRole = meta?.requiredRole

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

  if (!data.authenticated) {
    return navigateTo('/admin/login', { replace: true })
  }

  if (requiredRole) {
    const userLevel = ROLE_LEVEL[data.user?.role ?? ''] ?? 0
    const requiredLevel = ROLE_LEVEL[requiredRole] ?? 0
    if (userLevel < requiredLevel) {
      return navigateTo('/admin/login', { replace: true })
    }
  }
})