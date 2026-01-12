import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
})

// Petite astuce Nuxt : on vérifie si le modèle existe déjà pour éviter de le redéfinir au Hot Reload
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)