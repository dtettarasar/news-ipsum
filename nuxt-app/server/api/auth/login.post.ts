const MAX_EMAIL_LENGTH = 320
const MAX_PASSWORD_LENGTH = 1024

function isValidEmail(value: unknown): value is string {
    if (typeof value !== 'string') return false
    if (value.length === 0 || value.length > MAX_EMAIL_LENGTH) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPassword(value: unknown): value is string {
    if (typeof value !== 'string') return false
    return value.length >= 1 && value.length <= MAX_PASSWORD_LENGTH
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event).catch(() => null)
    if (!body || typeof body !== 'object') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Requête invalide'
        })
    }

    const { email, password, role } = body
    if (!isValidEmail(email) || !isValidPassword(password)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Identifiants invalides'
        })
    }

    // Accès back-office : rôle editor ou admin (hiérarchie)
    // authenticateUser est dans le service auth.service.ts
    const result = await authenticateUser(email, password, role)

    if (!result.success) {
        // Message générique pour éviter l'énumération de comptes (401 vs 403)
        throw createError({
            statusCode: 401,
            statusMessage: 'Identifiants invalides'
        })
    }
    
    // 3. Génération du Token JWT (via ta nouvelle fonction dans le service)
    // On passe l'ID de l'utilisateur (converti en string) et son rôle
    // createAuthToken est dans le service auth.service.ts
    const token = createAuthToken(result.user._id.toString(), result.user.role)

    // 4. Stockage dans un Cookie sécurisé
    // On utilise 'setCookie' (natif Nuxt/H3)
    setCookie(event, 'auth_token', token, {
        httpOnly: true, // Empeche le JS de lire le cookie (protection XSS)
        secure: process.env.NODE_ENV === 'production', // Uniquement en HTTPS en prod
        sameSite: 'strict', // Protection contre les attaques CSRF
        maxAge: 60 * 60 * 24 // Expire dans 24h
    })

    // 5. Réponse au frontend
    /*
    return { 
        message: 'Accès Admin accordé', 
        user: { 
            name: result.user.name,
            email: result.user.email
        } 
    }
    */
   
})