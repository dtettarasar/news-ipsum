// scripts/generate-secrets.ts
import { randomBytes } from 'crypto'

const generate = (size: number) => randomBytes(size).toString('hex')

const secrets = {
  JWT_SECRET: generate(64),          // Pour signer tes JWT
  SESSION_PASSWORD: generate(32),    // Pour le scellage des cookies Nitro
  ENCRYPTION_KEY: generate(32)       // Pour ton chiffrage AES (ID utilisateur)
}

console.log('\n--- 🔑 News Ipsum : Générateur de Secrets ---')
console.log('Copie ces lignes dans ton fichier .env :\n')

console.log(`JWT_SECRET="${secrets.JWT_SECRET}"`)
console.log(`SESSION_PASSWORD="${secrets.SESSION_PASSWORD}"`)
console.log(`ENCRYPTION_KEY="${secrets.ENCRYPTION_KEY}"`)

console.log('\n⚠️  Garde ces clés précieusement. Si tu les changes, toutes les sessions actives seront déconnectées.')