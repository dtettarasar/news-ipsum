import { expect, test, describe, beforeAll, afterAll } from 'vitest'
import { authenticateUser, createAuthToken, verifyAuthToken } from '../../../server/utils/auth.service'
import { decryptString } from '../../../server/utils/cypher'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../../server/models/User.model'

import { connectTestDB, disconnectTestDB } from '../utils/db-handler'
import { generateTestUserData } from '../utils/test-factory'

describe('Authentication Integration', () => {

    let editorData: any
    let testAdminDoc: any
    let generatedToken: string

    beforeAll(async () => {

        // 1. Config secrets
        process.env.JWT_SECRET = 'super_secret_jwt_for_testing_2026'
        process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

        // 2. Connexion via le handler
        await connectTestDB()

        // 3. creation d'un user admin de test
        editorData = generateTestUserData('admin')
        
        // Nettoyage au cas où un utilisateur avec le même email existerait déjà
        await User.deleteMany({ email: editorData.email })

        // Hashage et création
        const hashedPassword = await bcrypt.hash(editorData.password, 10)
        testAdminDoc = await User.create({
            ...editorData,
            password: hashedPassword
        })

        console.log(`👤 Test user created: ${editorData.email}`)

    })

    afterAll(async () => {

        // On nettoie et on ferme
        try {

            await User.deleteMany({ email: editorData.email })
            console.log(`🧼 Test user deleted: ${editorData.email}`)

        } catch (error) {

            console.error('Error deleting test user:', error)

        }

        await disconnectTestDB()

    })

    test('Should verify credentials using factory data', async () => {
        const result = await authenticateUser(
            editorData.email, 
            editorData.password, 
            'admin'
        )
        expect(result.success).toBe(true)
    })

    // 1. Tests de sécurité sur l'authentification

    test('Should fail authentication with an incorrect password', async () => {
        const result = await authenticateUser(
            editorData.email, 
            'WrongPassword123!', 
            'admin'
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe('Identifiants invalides')
    })

    test('Should fail authentication with an unknown email', async () => {
        const result = await authenticateUser(
            'nobody-exists@test.com', 
            'SomePassword123!', 
            'admin'
        )
        expect(result.success).toBe(false)
        expect(result.error).toBe('Identifiants invalides')
    })

    test('Should ALLOW an admin to access an editor role (hierarchy check)', async () => {
        const result = await authenticateUser(
            editorData.email, 
            editorData.password, 
            'editor' // L'admin a le droit car il est "au-dessus"
        )
        expect(result.success).toBe(true)
    })

    test('Should REJECT an editor trying to access an admin role', async () => {
        
        const editorData = generateTestUserData('editor')
        const hashedPassword = await bcrypt.hash(editorData.password, 10)
        
        // On crée l'user
        await User.create({ ...editorData, password: hashedPassword })

        try {

            // Le test proprement dit
            const result = await authenticateUser(editorData.email, editorData.password, 'admin')
            expect(result.success).toBe(false)
            expect(result.error).toBe('Accès non autorisé pour ce rôle')

        } finally {

            // Le FINALLY s'exécute QUOI QU'IL ARRIVE (succès ou échec du expect)
            await User.deleteOne({ email: editorData.email })

        }
    })
    
})