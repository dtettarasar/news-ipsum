import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import TestMessage from '../../../server/models/TestMessage.model'
import { connectTestDB, disconnectTestDB } from '../../utils/db-handler'
import { generateTestMessageData } from '../../utils/test-factory'

describe('TestMessage – intégration DB (création et lecture réelles)', () => {
  let createdDoc: { _id: any; message: string }

  beforeAll(async () => {
    await connectTestDB()
    const data = generateTestMessageData()
    createdDoc = await TestMessage.create(data) as any
  })

  afterAll(async () => {
    try {
      if (createdDoc?._id) {
        await TestMessage.findByIdAndDelete(createdDoc._id)
      }
    } catch (error) {
      console.error('⚠️ Cleanup error:', error)
    } finally {
      await disconnectTestDB()
    }
  })

  it('should create a TestMessage in the database and return it with _id and message', () => {
    expect(createdDoc).toHaveProperty('_id')
    expect(createdDoc).toHaveProperty('message')
    expect(createdDoc.message).toMatch(/Test message from integration test/)
  })

  it('should find the created TestMessage by id', async () => {
    const found = await TestMessage.findById(createdDoc._id)
    expect(found).not.toBeNull()
    expect(found?.message).toBe(createdDoc.message)
    expect(found?._id?.toString()).toBe(createdDoc._id.toString())
  })
})
