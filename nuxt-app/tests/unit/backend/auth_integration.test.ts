import { expect, test, describe, beforeAll } from 'vitest'
import { authenticateUser, createAuthToken, verifyAuthToken } from '../../../server/utils/auth.service'
import { decryptString } from '../../../server/utils/cypher'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../../server/models/User.model'

import { connectTestDB, disconnectTestDB } from '../utils/db-handler'
import { generateTestUserData } from '../utils/test-factory'

describe('Authentication Integration', () => {

    let testAdminData: any
    let testAdminDoc: any
    let generatedToken: string

    beforeAll(async () => {

        // 1. Config secrets
        process.env.JWT_SECRET = 'super_secret_jwt_for_testing_2026'
        process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

        // 2. Connexion via le handler
        await connectTestDB()

        // 3. creation d'un user admin de test
        testAdminData = generateTestUserData('admin')
        
        // Nettoyage au cas où un utilisateur avec le même email existerait déjà
        await User.deleteMany({ email: testAdminData.email })

        // Hashage et création
        const hashedPassword = await bcrypt.hash(testAdminData.password, 10)
        testAdminDoc = await User.create({
            ...testAdminData,
            password: hashedPassword
        })

        console.log(`👤 Test user created: ${testAdminData.email}`)

    })

})