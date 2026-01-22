// tests/unit/backend/cypher.test.ts
import { expect, test, describe, beforeAll } from 'vitest'
import { encryptString, decryptString } from '../../../server/utils/cypher'

describe('Cipher Utility (Otis AI Logic)', () => {
  const testStr = "The Chase Is Better Than The Catch"
  let testEncryption: any

  test('should return an encryption object', () => {
    testEncryption = encryptString(testStr)
    expect(testEncryption).toBeTypeOf('object')
  })

  test('should have valid hex formats for iv and encrypted string', () => {
    expect(testEncryption).toHaveProperty('iv')
    expect(testEncryption).toHaveProperty('encryptedStr')
    // L'IV en aes-256-cbc fait toujours 16 octets = 32 caractères hex
    expect(testEncryption.iv).toHaveLength(32)
  })

  test('should decrypt back to the original string', () => {
    const decryptedStr = decryptString(testEncryption)
    expect(decryptedStr).toEqual(testStr)
  })
})