import { expect, test, describe, beforeAll, afterAll, vi } from 'vitest'
import { createEvent, getResponseHeader } from 'h3'
import { authenticateUser, createAuthToken, verifyAuthToken, getUserByToken, createAuthCookie } from '../../../server/utils/auth.service'
import { decryptString } from '../../../server/utils/cypher'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../../server/models/User.model'

import { connectTestDB, disconnectTestDB } from '../../utils/db-handler'
import { generateTestUserData } from '../../utils/test-factory'

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

    // 2. Tests de génération et vérification de token

    test('Should generate a signed token with an encrypted ID', async () => {
        generatedToken = createAuthToken(adminDoc._id.toString())
        
        expect(generatedToken).toBeTypeOf('string')
        // Un JWT valide contient deux points (header.payload.signature)
        expect(generatedToken.split('.')).toHaveLength(3)
    })

    test('Should verify the token and return the correct decrypted ID', () => {
        const payload = verifyAuthToken(generatedToken) as any
        
        expect(payload).not.toBeNull()
        expect(payload.sub).toContain(':') // Format iv:encryptedStr

        // Extraction et décryptage pour boucler la boucle
        const [iv, encryptedStr] = payload.sub.split(':')
        const decryptedId = decryptString({ iv, encryptedStr })
        
        expect(decryptedId).toBe(adminDoc._id.toString())

    })

    test('Should verify the default expiration duration of the token (24h)', async () => {

        const token = createAuthToken(adminDoc._id.toString())
        const payload = verifyAuthToken(token) as { iat: number; exp: number }
        const durationSeconds = payload.exp - payload.iat

        // Vérification de l'expiration du token (24h par défaut)
        // console.log(`🕒 Token expiration duration: ${durationSeconds} seconds`)
        expect(durationSeconds).toBeGreaterThanOrEqual(24 * 60 * 60 - 2)
        //console.log(`🕒 Token expiration duration: ${durationSeconds} seconds`)
        expect(durationSeconds).toBeLessThanOrEqual(24 * 60 * 60 + 2)
        //console.log(`🕒 Token expiration duration: ${durationSeconds} seconds`)

    })

    test('Should verify the expiration duration of the token with a custom expiration time', async () => {

        const token = createAuthToken(adminDoc._id.toString(), '1h')
        const payload = verifyAuthToken(token) as { iat: number; exp: number }
        const durationSeconds = payload.exp - payload.iat

        expect(durationSeconds).toBeGreaterThanOrEqual(60 * 60 - 2)
        expect(durationSeconds).toBeLessThanOrEqual(60 * 60 + 2)

    })

    test('Should reject a tampered or invalid token', () => {

        const tamperedToken = generatedToken + 'xyz'
        const result = verifyAuthToken(tamperedToken)
        expect(result).toBeNull()
        
    })

    // 3. Tests de récupération de l'utilisateur via le token
    test('Should return the correct user when the token is valid', async () => {

        const token = createAuthToken(adminDoc._id.toString())
        const result = await getUserByToken(token)
        expect(result.authenticated).toBe(true)
        expect(result.user).toEqual({
            name: adminDoc.name,
            email: adminDoc.email,
            role: adminDoc.role
        })
    })

    test('should return false when the token is empty', async () => {
        const warnSpy = vi.spyOn(console, 'warn')
        const result = await getUserByToken('')
        expect(result.authenticated).toBe(false)
        expect(warnSpy).toHaveBeenCalledWith('[Auth] Token manquant')
    })

    test('should reject a token with a deleted user', async () => {
        const warnSpy = vi.spyOn(console, 'warn')
        const localAdminData = generateTestUserData('admin')
        const hashedPassword = await bcrypt.hash(localAdminData.password, 10)
        const localAdminDoc = await User.create({ ...localAdminData, password: hashedPassword })
        const token = createAuthToken(localAdminDoc._id.toString())
        await User.deleteOne({ _id: localAdminDoc._id.toString() })
        const result = await getUserByToken(token)
        expect(result.authenticated).toBe(false)
        await User.deleteOne({ _id: localAdminDoc._id.toString() })
        expect(warnSpy).toHaveBeenCalledWith('[Auth] Utilisateur non trouvé')
    })

    test('should return the correct user when the token is valid with a custom expiration time', async () => {
        const token = createAuthToken(adminDoc._id.toString(), '1h')
        const result = await getUserByToken(token)
        expect(result.authenticated).toBe(true)
        expect(result.user).toEqual({
            name: adminDoc.name,
            email: adminDoc.email,
            role: adminDoc.role
        })
    })

    test('should reject a token with an expired token', async () => {
        const token = createAuthToken(adminDoc._id.toString(), '1ms')
        // On attend 1 seconde pour être sûr que le token (expirant en 1 ms) soit bien expiré
        await new Promise(resolve => setTimeout(resolve, 1000))
        const result = await getUserByToken(token)
        expect(result.authenticated).toBe(false)
    })

    test('should reject an invalid or malformed token string', async () => {
        const warnSpy = vi.spyOn(console, 'warn')
        const result = await getUserByToken('invalid.token')
        expect(result.authenticated).toBe(false)
        expect(warnSpy).toHaveBeenCalledWith('[Auth] Token invalide')
    })

    test('should reject an altered token', async () => {
        const warnSpy = vi.spyOn(console, 'warn')
        const token = createAuthToken(adminDoc._id.toString())
        const alteredToken = token + 'xyz'
        const result = await getUserByToken(alteredToken)
        expect(result.authenticated).toBe(false)
        expect(warnSpy).toHaveBeenCalledWith('[Auth] Token invalide')
    })

    test('should reject a token when the user does not exist in the database', async () => {

        const warnSpy = vi.spyOn(console, 'warn')
        const token = createAuthToken(new mongoose.Types.ObjectId().toString())
        const result = await getUserByToken(token)
        expect(result.authenticated).toBe(false)
        expect(warnSpy).toHaveBeenCalledWith('[Auth] Utilisateur non trouvé')

    })

    // 4. Tests createAuthCookie (succès – flux complet avec DB)

    test('Should throw "Identifiants invalides" when credentials are wrong', async () => {
        
        /*
        const event = createEvent(new Request('http://localhost/'))
        await expect(
            createAuthCookie(event, adminData.email, 'WrongPassword123!', 'admin')
        ).rejects.toThrow('Identifiants invalides')
        */

        const setHeader = vi.fn()
        const event = {
            node: {
                res: {
                    getHeader: vi.fn().mockReturnValue(undefined),
                    setHeader
                }
            }
        } as any

        await expect(
            createAuthCookie(event, adminData.email, 'WrongPassword123!', 'admin')
        ).rejects.toThrow('Identifiants invalides')

    })

    test('Should set auth_token cookie and return success when credentials are valid', async () => {
        const setHeader = vi.fn()
        const event = {
            node: {
                res: {
                    getHeader: vi.fn().mockReturnValue(undefined),
                    setHeader
                }
            }
        } as any

        const result = await createAuthCookie(
            event,
            adminData.email,
            adminData.password,
            'admin'
        )

        expect(result).toEqual({ success: true, message: 'Connexion réussie' })

        expect(setHeader).toHaveBeenCalledWith(
            'set-cookie',
            expect.stringContaining('auth_token=')
        )

        // Récupère le cookie généré dans le header
        const cookieCall = setHeader.mock.calls.find((c: any) => c[0] === 'set-cookie')
        console.log("cookieCall:")
        console.log(cookieCall)

        const cookieValue = cookieCall?.[1] ?? ''

        expect(cookieValue).toContain('HttpOnly')
        expect(cookieValue).toContain('Path=/')
        expect(cookieValue).toContain('SameSite=Strict')

    })
    
})
