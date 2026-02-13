import { createAuthCookie } from '~/server/utils/auth.service'

export default defineEventHandler(async (event) => {

    const body = await readBody(event).catch(() => null)

    if (!body || typeof body !== 'object') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Requête invalide'
        })
    }

    const { email, password, role } = body

    try {

        return await createAuthCookie(event, email, password, role)
    } catch (error) {
        // Ne pas rethrow createError(401) ; retourner une réponse 200 avec success: false
        return { success: false, message: 'Identifiants incorrects ou accès non autorisé.' }

    }
})