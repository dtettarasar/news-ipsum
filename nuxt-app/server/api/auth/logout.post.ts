// server/api/auth/logout.post.ts
export default defineEventHandler((event) => {
    deleteCookie(event, 'auth_token', {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
    
    return { success: true, message: 'Déconnecté avec succès' }
})