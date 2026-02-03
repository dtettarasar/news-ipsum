import { User } from '~/server/models/User.model'
import { decryptString } from '~/server/utils/cypher'
import { verifyAuthToken } from '~/server/utils/auth.service'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        return { authenticated: false }
    }

    const decoded = verifyAuthToken(token) as { sub?: string } | null

    if (!decoded?.sub || typeof decoded.sub !== 'string') {
        return { authenticated: false }
    }

    // Format attendu : "iv:encryptedStr" (un seul ':' entre iv et payload hex)
    const parts = decoded.sub.split(':')
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return { authenticated: false }
    }

    try {
        const userId = decryptString({ iv: parts[0], encryptedStr: parts[1] })
        const user = await User.findById(userId).select('name email role')

        if (!user) {
            return { authenticated: false }
        }

        return {
            authenticated: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    } catch {
        return { authenticated: false }
    }
})