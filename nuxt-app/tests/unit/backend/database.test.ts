import { describe, it, expect, vi, beforeEach } from 'vitest'
import mongoose from 'mongoose'
import { initDB } from '../../../server/database/database'

vi.mock('mongoose', () => ({
  default: {
    set: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connection: {
        readyState: 0 // Par défaut déconnecté
    }
  }
}))

describe('Database connection (initDB)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
    // On remet l'état à 0 avant chaque test
    mongoose.connection.readyState = 0
  })

  it('should call mongoose.connect if disconnected', async () => {
    vi.mocked(mongoose.connect).mockResolvedValueOnce({} as any)

    await initDB('mongodb://localhost/test')
    expect(mongoose.connect).toHaveBeenCalled()
  })

  it('should not call connect if already connected (state 1)', async () => {
    // On simule l'état connecté
    mongoose.connection.readyState = 1

    await initDB('mongodb://localhost/test')
    expect(mongoose.connect).not.toHaveBeenCalled()
  })

  it('should throw error on failure', async () => {
    vi.mocked(mongoose.connect).mockRejectedValueOnce(new Error('Failed'))
    await expect(initDB('uri')).rejects.toThrow('Failed')
  })
})