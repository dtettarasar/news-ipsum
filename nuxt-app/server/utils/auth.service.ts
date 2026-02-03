// server/utils/auth.service.ts
import { User } from '../../server/models/User.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'

import { encryptString, decryptString } from './cypher'
import { isValidEmail, isValidPassword } from '../../server/utils/auth.validation'


const ROLE_HIERARCHY: Record<string, number> = {
  admin: 3,
  editor: 2,
  user: 1
}

const getJwtSecret = (): string => {

  let secret: string | undefined;

  try {
    const config = useRuntimeConfig()
    secret = config.jwtSecret
  } catch {
    secret = process.env.JWT_SECRET
  }

  if (!secret) {
    console.error("🚨 CRITICAL: JWT_SECRET is missing")
    throw createError({
      statusCode: 500,
      statusMessage: "Une erreur interne est survenue."
    })
  }

  return secret

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

  const jwtSecret = getJwtSecret()

  // 1. Chiffrage de l'ID
  const encrypted = encryptString(userId)
  const secureId = `${encrypted.iv}:${encrypted.encryptedStr}`

  // On utilise les noms définis dans nuxt.config.ts
  return jwt.sign(
    { sub: secureId, role }, 
    jwtSecret, 
    { expiresIn: '24h' }
  )

}

export const verifyAuthToken = (token: string) => {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret)
  } catch (err: unknown) {
    // Log minimal côté serveur : uniquement le type d'erreur (expiré, signature invalide, etc.)
    // Ne jamais logger le token ni err.message/stack qui pourraient contenir des infos sensibles
    const errorName = err instanceof Error ? err.name : 'Unknown'
    console.warn('[Auth] JWT verification failed:', errorName)
    return null
  }
}

export const deleteAuthToken = (event: H3Event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
}

export const createAuthCookie = async (event: H3Event, email: string, password: string, role: string) => {

  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiants invalides'
    })
  }

  const result = await authenticateUser(email, password, role)

  if (!result.success) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides'
    })
  }

  const token = createAuthToken(result.user._id.toString(), result.user.role)

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })

  return { success: true, message: 'Connexion réussie' }
}