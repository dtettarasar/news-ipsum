// server/utils/cipher.ts
import crypto from 'crypto'

const ALGO = 'aes-256-cbc'

// Fonction interne pour récupérer la clé (Nuxt Config ou Process Env pour les tests)
const getEncryptionKey = () => {
  try {
    const config = useRuntimeConfig()
    if (config.encryptionKey) return config.encryptionKey
  } catch (e) {
    // Si useRuntimeConfig échoue (hors Nuxt), on cherche dans process.env
  }
  return process.env.ENCRYPTION_KEY
}

export const encryptString = (strToEncrypt: string) => {
  const keyStr = getEncryptionKey()
  if (!keyStr) throw new Error("ENCRYPTION_KEY missing")
  
  const key = Buffer.from(keyStr, 'hex')
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(ALGO, key, iv)
  let encryptedStr = cipher.update(strToEncrypt, 'utf-8', 'hex')
  encryptedStr += cipher.final('hex')

  return { iv: iv.toString('hex'), encryptedStr }
}

export const decryptString = (encryptionObj: { iv: string, encryptedStr: string }) => {
  const keyStr = getEncryptionKey()
  if (!keyStr) throw new Error("ENCRYPTION_KEY missing")

  const key = Buffer.from(keyStr, 'hex')
  const iv = Buffer.from(encryptionObj.iv, 'hex')

  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  let decrypted = decipher.update(encryptionObj.encryptedStr, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}