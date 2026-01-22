export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)

    // On demande explicitement le rôle 'admin' au service
    const result = await authenticateUser(email, password, 'admin')

    if (!result.success) {
        throw createError({
            statusCode: result.error.includes('autorisé') ? 403 : 401,
            statusMessage: result.error
        })
    }

    return { 
        message: 'Accès Admin accordé', 
        user: { name: result.user.name, email: result.user.email } 
    }
})