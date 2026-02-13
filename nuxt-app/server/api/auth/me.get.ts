import { User } from '~/server/models/User.model'
import { decryptString } from '~/server/utils/cypher'
import { getUserByToken } from '~/server/utils/auth.service'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')

    const user = await getUserByToken(token || '')

    if (!user.authenticated) {
        return { authenticated: false, error: user.error }
    }

    return { authenticated: true, user: user.user }

})