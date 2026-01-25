export default defineEventHandler((event) => {
    // On écrase le cookie avec une date d'expiration passée
    deleteCookie(event, 'auth_token')
    
    return { message: 'Déconnecté avec succès' }
})