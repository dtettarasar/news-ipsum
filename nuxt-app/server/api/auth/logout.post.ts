// server/api/auth/logout.post.ts
import { deleteAuthToken } from '~/server/utils/auth.service'

export default defineEventHandler((event) => {
    deleteAuthToken(event)
    return { success: true, message: 'Déconnecté avec succès' }
})