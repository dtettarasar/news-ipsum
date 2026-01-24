// server/utils/auth.service.ts
import { User } from '../../server/models/User.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { encryptString, decryptString } from './cypher'

const ROLE_HIERARCHY: Record<string, number> = {
  admin: 3,
  editor: 2,
  user: 1
}

export const authenticateUser = async (email: string, pass: string, requiredRole?: string) => {
    const user = await User.findOne({ email })
    
    // 1. Vérification identité
    if (!user) return { success: false, error: 'Identifiants invalides' }

    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) return { success: false, error: 'Identifiants invalides' }

    // Logique hiérarchique : 
    // On vérifie si le poids du rôle de l'utilisateur est >= au poids requis
    if (requiredRole) {
        const userLevel = ROLE_HIERARCHY[user.role] || 0
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0

        if (userLevel < requiredLevel) {
            return { success: false, error: 'Accès non autorisé pour ce rôle' }
        }
    }

    return { success: true, user }
}

export const createAuthToken = (userId: string, role: string) => {

  let jwtSecret: string | undefined;

  try {

    const config = useRuntimeConfig()
    jwtSecret = config.jwtSecret

  } catch {

    // Si useRuntimeConfig échoue (en test), on prend process.env
    jwtSecret = process.env.JWT_SECRET

  }

  if (!jwtSecret) {

    console.error("🚨 CRITICAL: JWT_SECRET is missing")

    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur interne est survenue."
    })

  }

  // 1. Chiffrage de l'ID
  const encrypted = encryptString(userId)
  const secureId = `${encrypted.iv}:${encrypted.encryptedStr}`

  // --- LOGS TEMPORAIRES DE DÉVELOPPEMENT ---
  console.log('--- 🔐 DEBUG AUTH TOKEN ---')
  console.log('ID Original (DB):', userId)
  console.log('ID Crypté (JWT):', secureId)
  
  // Test de décryptage pour vérification
  const decryptedCheck = decryptString(encrypted)
  console.log('Vérification décryptage:', decryptedCheck === userId ? '✅ SUCCESS' : '❌ FAILED')
  console.log('---------------------------')
  // -----------------------------------------
  
  // On utilise les noms définis dans nuxt.config.ts
  return jwt.sign(
    { sub: secureId, role }, 
    jwtSecret, 
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