// scripts/create-admin.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../server/models/User.model'
import 'dotenv/config' // Pour lire tes variables d'environnement

async function createAdmin() {
  const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/${process.env.MONGO_DB_NAME || 'testdb'}?authSource=admin`

  console.log('⏳ Connexion à MongoDB...')
  await mongoose.connect(uri)

  try {
    const email = 'admin@news-ipsum.com' // Tu pourras utiliser process.argv pour le rendre dynamique
    
    const existing = await User.findOne({ email })
    if (existing) {
      console.log('❌ Erreur : Cet administrateur existe déjà.')
      process.exit(1)
    }

    const hashedPassword = await bcrypt.hash('MOT_DE_PASSE_TRES_SECURISE', 12)
    
    await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'admin'
    })

    console.log('✅ Succès : Administrateur créé !')
  } catch (err) {
    console.error('❌ Erreur :', err)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

createAdmin()