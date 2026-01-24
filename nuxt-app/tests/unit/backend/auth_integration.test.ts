import { expect, test, describe, beforeAll, afterAll } from 'vitest'
import { authenticateUser, createAuthToken, verifyAuthToken } from '../../../server/utils/auth.service'
import { decryptString } from '../../../server/utils/cypher'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../../server/models/User.model'

import { connectTestDB, disconnectTestDB } from '../utils/db-handler'
import { generateTestUserData } from '../utils/test-factory'

describe('Authentication Integration', () => {

    let adminData: any
    let adminDoc: any
    let generatedToken: string

    beforeAll(async () => {

        // 1. Config secrets
        process.env.JWT_SECRET = 'super_secret_jwt_for_testing_2026'
        process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

        // 2. Connexion via le handler
        await connectTestDB()

        // 3. creation d'un user admin de test
        adminData = generateTestUserData('admin')
        
        // Nettoyage au cas où un utilisateur avec le même email existerait déjà
        await User.deleteMany({ email: adminData.email })

        // Hashage et création
        const hashedPassword = await bcrypt.hash(adminData.password, 10)

        adminDoc = await User.create({
            ...adminData,
            password: hashedPassword
        })

        console.log(`👤 Main Test Admin created: ${adminData.email}`)
    })

    afterAll(async () => {

        try {

            if (adminData) {
                await User.deleteMany({ email: adminData.email })
                console.log(`🧼 Main Test Admin deleted: ${adminData.email}`)
            }

        } catch (error) {

            console.error('⚠️ Cleanup error:', error)

        } finally {

            // Garantit la déconnexion même si le delete échoue
            await disconnectTestDB()

        }
    })

    test('Should verify credentials using factory data', async () => {
        const result = await authenticateUser(
            adminData.email, 
            adminData.password, 
            'admin'
        )
        expect(result.success).toBe(true)
    })

    // 1. Tests de sécurité sur l'authentification

    test('Should fail authentication with an incorrect password', async () => {
        const result = await authenticateUser(
            adminData.email, 
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
            adminData.email, 
            adminData.password, 
            'editor' // L'admin a le droit car il est "au-dessus"
        )
        expect(result.success).toBe(true)
    })

    test('Should REJECT an editor trying to access an admin role', async () => {

        const localEditorData = generateTestUserData('editor')
        const hashedPassword = await bcrypt.hash(localEditorData.password, 10)
        
        // On crée l'user
        await User.create({ ...localEditorData, password: hashedPassword })
        try {

            // Le test proprement dit
            const result = await authenticateUser(localEditorData.email, localEditorData.password, 'admin')
            expect(result.success).toBe(false)
            expect(result.error).toBe('Accès non autorisé pour ce rôle')

        } finally {

            // Le FINALLY s'exécute QUOI QU'IL ARRIVE (succès ou échec du expect)
            await User.deleteOne({ email: localEditorData.email })

        }
    })
    
})