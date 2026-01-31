import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn()
const mockFindById = vi.fn()

vi.mock('../../../server/models/TestMessage.model', () => ({
  default: {
    create: mockCreate,
    findById: mockFindById,
  },
}))

describe('TestMessage model (create + findById) – unit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a document and return it with _id and message', async () => {
    const TestMessage = (await import('../../../server/models/TestMessage.model')).default

    const fakeDoc = {
      _id: '507f1f77bcf86cd799439011',
      message: 'Hello from Nuxt + Mongoose!',
      createdAt: new Date(),
    }
    mockCreate.mockResolvedValueOnce(fakeDoc)

    const created = await TestMessage.create({ message: fakeDoc.message })

    expect(mockCreate).toHaveBeenCalledWith({ message: fakeDoc.message })
    expect(created).toHaveProperty('_id', fakeDoc._id)
    expect(created).toHaveProperty('message', fakeDoc.message)
  })

  it('should find a document by id after creation', async () => {
    const TestMessage = (await import('../../../server/models/TestMessage.model')).default

    const fakeDoc = {
      _id: '507f1f77bcf86cd799439011',
      message: 'Hello from Nuxt + Mongoose!',
      createdAt: new Date(),
    }
    mockCreate.mockResolvedValueOnce(fakeDoc)
    mockFindById.mockResolvedValueOnce(fakeDoc)

    const created = await TestMessage.create({ message: fakeDoc.message })
    const found = await TestMessage.findById(created._id)

    expect(mockFindById).toHaveBeenCalledWith(created._id)
    expect(found).toEqual(fakeDoc)
    expect(found?.message).toBe(fakeDoc.message)
  })
})
