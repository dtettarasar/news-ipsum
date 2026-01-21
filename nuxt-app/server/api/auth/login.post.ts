import { User } from '~/server/models/User.model'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    
    // 1. Lire le corps de la requête (le JSON envoyé par ton formulaire)
    const body = await readBody(event)
    const { email, password } = body

    // Tester le renvoi de ces données vers le composant frontend
    console.log('Login attempt:', { email, password })

    return { message: 'Login endpoint hit', email, password }


})