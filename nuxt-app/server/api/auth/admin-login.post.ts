export default defineEventHandler(async (event) => {
    // 1. Récupération des données du formulaire
    const { email, password } = await readBody(event)

    // 2. Utilisation de ton service pour vérifier l'admin
    // On demande explicitement le rôle 'admin' au service
    const result = await authenticateUser(email, password, 'editor')

    if (!result.success) {
        throw createError({
            statusCode: result.error.includes('autorisé') ? 403 : 401,
            statusMessage: result.error
        })
    }
    
    // 3. Génération du Token JWT (via ta nouvelle fonction dans le service)
    // On passe l'ID de l'utilisateur (converti en string) et son rôle
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
    return { 
        message: 'Accès Admin accordé', 
        user: { 
            name: result.user.name,
            email: result.user.email
        } 
    }
})