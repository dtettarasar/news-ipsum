import { initDB } from '../database/database'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  const uri = `mongodb://${config.mongoUser}:${config.mongoPass}@mongodb:27017/${config.mongoDbName}?authSource=admin`

  await initDB(uri)
})
