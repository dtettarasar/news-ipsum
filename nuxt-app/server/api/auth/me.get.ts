export default defineEventHandler((event) => {

    console.log('Vérification de l\'authentification via /api/auth/me') 

    const token = getCookie(event, 'auth_token')

    console.log('Token récupéré depuis le cookie :', token)

    if (!token) {

        console.log('Aucun token trouvé, utilisateur non authentifié.')
        return { authenticated: false }

    } else  {
        console.log('Token trouvé, vérification en cours...')
        const decoded = verifyAuthToken(token)

        if (!decoded) {

            console.log('Token invalide ou expiré.')
            return { authenticated: false }

        } else  {

            console.log('Token valide. Utilisateur authentifié avec les données :', decoded)    
            return { authenticated: true, user: decoded }

        } 
    }

})