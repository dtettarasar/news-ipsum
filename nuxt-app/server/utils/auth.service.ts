// server/utils/auth.service.ts
import { User } from '~/server/models/User.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authenticateUser = async (email: string, pass: string, requiredRole?: string) => {
    const user = await User.findOne({ email })
    
    // 1. Vérification identité
    if (!user) return { success: false, error: 'Identifiants invalides' }

    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) return { success: false, error: 'Identifiants invalides' }

    // 2. Vérification autorisation (Rôle)
    if (requiredRole && user.role !== requiredRole) {
        return { success: false, error: 'Accès non autorisé pour ce rôle' }
    }

    return { success: true, user }
}

export const createAuthToken = (userId: string, role: string) => {
  const config = useRuntimeConfig() // Accès à la config centralisée

  if (!config.jwtSecret) {
    // 1. Log précis pour le développeur (visible dans Docker)
    console.error("🚨 CRITICAL: JWT_SECRET is missing in .env or nuxt.config.ts")
    
    // 2. Erreur floue pour l'utilisateur (visible dans le navigateur)
    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur interne est survenue."
    })
  }
  
  // On utilise les noms définis dans nuxt.config.ts
  return jwt.sign(
    { userId, role }, 
    config.jwtSecret, 
    { expiresIn: '24h' }
  )
}

export const verifyAuthToken = (token: string) => {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (err) {
    return null
  }
}