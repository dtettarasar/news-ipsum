import TestMessage from '../database/models/test-message'

import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {

  // On insère un document de test
  const newMessage = await TestMessage.create({ message: 'Hello from Nuxt + Mongoose!' });

  // Et on le récupère juste après
  const foundMessage = await TestMessage.findById(newMessage._id)

  return foundMessage

})