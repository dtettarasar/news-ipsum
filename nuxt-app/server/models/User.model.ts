import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'editor'], 
    default: 'user' 
  },
}, { 
  timestamps: true 
})

// On exporte avec l'astuce Nuxt pour éviter les erreurs au rechargement
export const User = mongoose.models.User || mongoose.model('User', UserSchema)