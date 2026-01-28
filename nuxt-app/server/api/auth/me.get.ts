import { User } from '~/server/models/User.model'
import { decryptString } from '~/server/utils/cypher'

export default defineEventHandler(async (event) => {

    console.log('Vérification de l\'authentification via /api/auth/me') 

    const token = getCookie(event, 'auth_token')

    console.log('Token récupéré depuis le cookie :', token)

    if (!token) {

        console.log('Aucun token trouvé, utilisateur non authentifié.')
        return { authenticated: false }

    } else  {

        console.log('Token trouvé, vérification en cours...')
        const decoded = verifyAuthToken(token) as any

        if (!decoded) {

            console.log('Token invalide ou expiré.')
            return { authenticated: false }

        } else  {

            console.log('Token valide. Utilisateur authentifié avec les données :', decoded)

            // Décryptage de l'ID pour chercher l'user en DB
            const [iv, encryptedStr] = decoded.sub.split(':')
            const userId = decryptString({ iv, encryptedStr })

            const user = await User.findById(userId).select('name email role')

            if (!user) {
                console.log('Utilisateur non trouvé en base de données.')
                return { authenticated: false }
            }

            console.log('Utilisateur trouvé en base de données :', user)

            return {
                authenticated: true, 
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            } 
        }
    }
})