import { expect, test, describe, beforeAll } from 'vitest'
import { authenticateUser, createAuthToken, verifyAuthToken } from '../../../server/utils/auth.service'
import { decryptString } from '../../../server/utils/cypher'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../../server/models/User.model'

describe('Authentication Integration', () => {

    const adminPassword = 'TestPassword123!'
    let testAdmin: any
    let generatedToken: string

    beforeAll(async () => {

        // 1. Configuration des secrets pour le test
        process.env.JWT_SECRET = 'super_secret_jwt_for_testing_2026'
        process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'


        // 2. Connexion à la base de données de test
        const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME
        const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD
        const mongoDbName = process.env.MONGO_DB_NAME || 'testdb'
        const uri = `mongodb://${mongoUser}:${mongoPass}@mongodb:27017/${mongoDbName}?authSource=admin`

        console.log('Connecting to MongoDB for tests...')

        try {
            
            await mongoose.connect(uri)
            console.log('Connected to MongoDB for tests.')

        } catch (error) {
            console.error('Error connecting to MongoDB or creating test user:', error)
        }

    })

})