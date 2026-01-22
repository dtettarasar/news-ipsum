import { User } from '~/server/models/User.model'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    
    // 1. Lire le corps de la requête (le JSON envoyé par ton formulaire)
    const body = await readBody(event)
    const { email, password } = body

    // Tester le renvoi de ces données vers le composant frontend
    console.log('Login attempt:', { email, password })

    // 1. Chercher l'utilisateur
    // Note : on enlève "where", on passe l'objet directement
    const user = await User.findOne({ email })

    if (!user) {
        console.log('❌ Utilisateur non trouvé en base');
        throw createError({
            statusCode: 401,
            statusMessage: 'Identifiants invalides'
        })
    }

    console.log('✅ Utilisateur trouvé:', user.name)

    // 2. Vérifier le mot de passe
    // /!\ Vérifie bien si c'est user.password ou user.passwordHash dans le schéma
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect');
        throw createError({
            statusCode: 401,
            statusMessage: 'Identifiants invalides'
        })
    }

    console.log('🚀 Authentification réussie pour:', user.email)

    return { 
        message: 'Authentification réussie', 
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    }

})