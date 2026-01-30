// scripts/create-admin.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../server/models/User.model'
import 'dotenv/config'
import readline from 'readline'

// Configuration de l'interface de lecture
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Utilitaire pour transformer les questions en Promesses
const question = (query: string): Promise<string> => 
  new Promise((resolve) => rl.question(query, resolve))

async function createAdmin() {
  // L'URI utilise 'mongodb' pour le réseau interne Docker
  const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/${process.env.MONGO_DB_NAME || 'testdb'}?authSource=admin`

  try {
    console.log('\n--- 🛠  Création manuelle d\'un Administrateur ---')

    // 1. Collecte des informations via le terminal
    const name = await question('👤 Nom de l\'admin : ')
    const email = await question('📧 Email : ')
    
    if (!email.includes('@')) {
      console.log('❌ Erreur : Format d\'email invalide.')
      process.exit(1)
    }

    const pass = await question('🔑 Mot de passe : ')
    const confirmPass = await question('🔑 Confirmez le mot de passe : ')

    if (pass !== confirmPass) {
      console.log('❌ Erreur : Les mots de passe ne correspondent pas.')
      process.exit(1)
    }

    if (pass.length < 8) {
      console.log('❌ Erreur : Le mot de passe doit faire au moins 8 caractères.')
      process.exit(1)
    }

    // 2. Connexion à la base de données
    console.log('\n⏳ Connexion à MongoDB...')
    await mongoose.connect(uri)

    // 3. Vérification de l'existence
    const existing = await User.findOne({ email })
    if (existing) {
      console.log('❌ Erreur : Un utilisateur avec cet email existe déjà.')
      process.exit(1)
    }

    // 4. Hachage et enregistrement
    const hashedPassword = await bcrypt.hash(pass, 12)
    
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    console.log(`\n✅ Succès : L'administrateur "${name}" a été créé avec succès !`)

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('❌ Erreur critique lors de la création :', msg)
  } finally {
    // 5. Fermeture propre des connexions
    await mongoose.connection.close()
    rl.close()
    process.exit(0)
  }
}

createAdmin()