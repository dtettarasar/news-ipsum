// server/utils/auth.service.ts
import { User } from '~/server/models/User.model'
import bcrypt from 'bcryptjs'

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