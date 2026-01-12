// server/api/categories.get.ts
import { Category } from '../models/Category'

const MOCK_CATEGORIES = [
  { name: 'Technologie', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
  { name: 'Politique', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500' },
  { name: 'Culture', image: 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac?w=500' },
  { name: 'Économie', image: 'https://images.unsplash.com/photo-1611974714851-eb6053e6235b?w=500' },
  { name: 'Sport', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500' },
  { name: 'Santé', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500' },
  { name: 'Spiritualité', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500' },
  { name: 'Marketing', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=500' },
  { name: 'Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' }
]

export default defineEventHandler(async (event) => {
  try {
    let categories = await Category.find().lean()

    // Si la base est vide (que ce soit en local ou en prod)
    if (categories.length === 0) {
      console.log('🌱 Database categories empty. Seeding mocks...')
      // On insère les mocks en base de données
      await Category.insertMany(MOCK_CATEGORIES)
      // On les récupère à nouveau pour avoir les vrais objets avec _id
      categories = await Category.find().lean()
    }

    return categories

  } catch (error) {

    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des catégories'
    })
    
  }
})