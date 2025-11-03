import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const uri = config.MONGODB_URI

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db(config.MONGO_DB_NAME) // récupère le nom défini dans .env
  const collection = db.collection('testCollection')

  // Insert un doc test
  const result = await collection.insertOne({ message: 'Hello from Nuxt server!' })

  // Récupère le doc
  const doc = await collection.findOne({ _id: result.insertedId })

  await client.close()
  return doc

})