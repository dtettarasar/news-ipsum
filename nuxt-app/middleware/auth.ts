// Hiérarchie des rôles (répliquée ici pour usage côté client, sans importer server/)
const ROLE_LEVEL: Record<string, number> = {
  admin: 3,
  editor: 2,
  user: 1
}

type MeResponse = { authenticated: boolean; user?: { role: string } }

/** Meta attendue pour les pages protégées par le middleware auth */
type AuthMeta = {
  /** Formulaire de connexion pour cette zone (ex. /admin/login, /account/login). Requis. */
  redirectTo: string
  /** Rôle minimum requis (ex. 'editor', 'admin'). Si absent, seule l'authentification est vérifiée. */
  requiredRole?: string
  /** Si authentifié mais rôle insuffisant, rediriger ici (ex. /admin). Sinon on utilise redirectTo. */
  insufficientRoleRedirect?: string
}

const DEFAULT_LOGIN_PATH = '/admin/login'

export default defineNuxtRouteMiddleware(async (to) => {
  const meta = to.meta.auth as AuthMeta | undefined

  if (!meta?.redirectTo && import.meta.dev) {
    console.warn('[Auth middleware] Page protégée sans auth.redirectTo dans definePageMeta; utilisation de la valeur par défaut.', to.path)
  }

  const redirectTo = meta?.redirectTo ?? DEFAULT_LOGIN_PATH
  const requiredRole = meta?.requiredRole
  const insufficientRoleRedirect = meta?.insufficientRoleRedirect

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

  const redirect = (target: string) =>
    navigateTo(target, { replace: true, external: true })

  if (!data.authenticated) {
    return redirect(redirectTo)
  }

  if (requiredRole) {
    const userLevel = ROLE_LEVEL[data.user?.role ?? ''] ?? 0
    const requiredLevel = ROLE_LEVEL[requiredRole] ?? 0
    if (userLevel < requiredLevel) {
      const target = insufficientRoleRedirect ?? redirectTo
      return redirect(target)
    }
  }
})