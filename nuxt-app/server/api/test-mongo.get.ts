import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const client = new MongoClient('mongodb://mongodb:27017') // mongodb = nom du service dans docker-compose
  await client.connect()
  const db = client.db('testdb') // une DB de test
  const collection = db.collection('testCollection')

  // Insert un doc test
  const result = await collection.insertOne({ message: 'Hello from Nuxt server!' })

  // Récupère le doc
  const doc = await collection.findOne({ _id: result.insertedId })

  await client.close()
  return doc
})