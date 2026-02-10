// tests/unit/backend/auth_unit.test.ts
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

/**
 * Tests unitaires pour createAuthCookie : on ne couvre que le cas d'échec
 * (Identifiants invalides, pas d'appel à setCookie). Le cas de succès est
 * couvert par les tests d'intégration (auth_integration.test.ts).
 * Les fonctions fortement couplées (nombreux imports / appels internes)
 * sont plus adaptées aux tests d'intégration ; les unitaires conviennent
 * aux fonctions simples et isolées (ex. cypher.test.ts).
 */

const setCookieSpy = vi.fn()

vi.mock('h3', () => ({
  setCookie: setCookieSpy,
  createError: (opts: { statusCode?: number; statusMessage?: string }) => {
    const e = new Error(opts?.statusMessage || 'Error')
    ;(e as any).statusCode = opts?.statusCode || 500
    throw e
  }
}))

vi.mock('../../../server/models/User.model', () => ({
  User: {
    findOne: vi.fn(),
    findById: vi.fn()
  }
}))

let authModule: typeof import('../../../server/utils/auth.service')
let User: { findOne: ReturnType<typeof vi.fn>; findById: ReturnType<typeof vi.fn> }

beforeAll(async () => {
  authModule = await import('../../../server/utils/auth.service')
  const userModel = await import('../../../server/models/User.model')
  User = userModel.User as any
})

describe('Create Auth Cookie Unit Test (failure path only)', () => {
  beforeEach(() => {
    setCookieSpy.mockClear()
    User.findOne.mockResolvedValue(null)
  })

  it('should throw "Identifiants invalides" and not call setCookie when auth fails', async () => {
    const event = {}

    await expect(
      authModule.createAuthCookie(event as any, 'unknown@test.com', 'password', 'admin')
    ).rejects.toThrow('Identifiants invalides')

    expect(setCookieSpy).not.toHaveBeenCalled()
  })
})