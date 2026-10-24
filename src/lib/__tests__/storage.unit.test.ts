import {
  serialize,
  writeStorage,
  readStorage,
  isLocalStorageAvailable,
  isValidPurchaseCaseFile,
  isValidPreferenceState,
} from '../storage'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) delete store[key]
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
}

describe('storage — unit tests', () => {
  describe('serialize', () => {
    it('returns a JSON string for a plain object', () => {
      const result = serialize({ a: 1, b: 'hello' })
      expect(typeof result).toBe('string')
      expect(JSON.parse(result!)).toEqual({ a: 1, b: 'hello' })
    })

    it('returns a JSON string for an array', () => {
      const result = serialize([1, 2, 3])
      expect(result).toBe('[1,2,3]')
    })

    it('returns null for a circular reference', () => {
      const original = JSON.stringify
      vi.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
        throw new TypeError('circular')
      })
      const result = serialize({ self: 'ref' })
      expect(result).toBeNull()
      JSON.stringify = original
    })
  })

  describe('readStorage', () => {
    beforeEach(() => {
      vi.stubGlobal('localStorage', makeMockLocalStorage())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('returns null for an absent key', () => {
      expect(readStorage('nonexistent-key')).toBeNull()
    })

    it('returns null for malformed JSON', () => {
      localStorage.setItem('bad-key', '{not valid json')
      expect(readStorage('bad-key')).toBeNull()
    })

    it('returns parsed value for valid stored JSON', () => {
      localStorage.setItem('test-key', JSON.stringify({ x: 42 }))
      expect(readStorage('test-key')).toEqual({ x: 42 })
    })
  })

  describe('writeStorage', () => {
    beforeEach(() => {
      vi.stubGlobal('localStorage', makeMockLocalStorage())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('writes a value that can be read back', () => {
      writeStorage('my-key', { foo: 'bar' })
      expect(readStorage('my-key')).toEqual({ foo: 'bar' })
    })

    it('returns false-equivalent (does not throw) when setItem throws', () => {
      const mock = makeMockLocalStorage()
      mock.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })
      vi.stubGlobal('localStorage', mock)
      expect(() => writeStorage('key', { data: 1 })).not.toThrow()
    })
  })

  describe('isLocalStorageAvailable', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('returns true when localStorage is writable', () => {
      vi.stubGlobal('localStorage', makeMockLocalStorage())
      expect(isLocalStorageAvailable()).toBe(true)
    })

    it('returns false when setItem throws', () => {
      const mock = makeMockLocalStorage()
      mock.setItem.mockImplementation(() => {
        throw new DOMException('SecurityError')
      })
      vi.stubGlobal('localStorage', mock)
      expect(isLocalStorageAvailable()).toBe(false)
    })
  })

  describe('isValidPurchaseCaseFile', () => {
    const valid = {
      id: 'abc-123',
      productName: 'Sony WH-1000XM5',
      productUrl: 'sony-wh-1000xm5',
      verdict: 'BUY' as const,
      confidence: 80,
      preferences: {
        price: true,
        reviews: true,
        availability: true,
        brandTrust: true,
        sustainability: true,
      },
      timestamp: new Date().toISOString(),
    }

    it('accepts a complete valid record', () => {
      expect(isValidPurchaseCaseFile(valid)).toBe(true)
    })

    it('rejects null', () => {
      expect(isValidPurchaseCaseFile(null)).toBe(false)
    })

    it('rejects missing id field', () => {
      const { id: _id, ...rest } = valid
      expect(isValidPurchaseCaseFile(rest)).toBe(false)
    })

    it('rejects missing productName field', () => {
      const { productName: _pn, ...rest } = valid
      expect(isValidPurchaseCaseFile(rest)).toBe(false)
    })

    it('rejects invalid verdict value', () => {
      expect(isValidPurchaseCaseFile({ ...valid, verdict: 'MAYBE' })).toBe(false)
    })

    it('rejects when confidence is not a number', () => {
      expect(isValidPurchaseCaseFile({ ...valid, confidence: '80' })).toBe(false)
    })
  })

  describe('isValidPreferenceState', () => {
    it('accepts a valid full PreferenceState', () => {
      expect(
        isValidPreferenceState({
          price: true,
          reviews: false,
          availability: true,
          brandTrust: false,
          sustainability: true,
        }),
      ).toBe(true)
    })

    it('rejects a partial object (missing keys)', () => {
      expect(isValidPreferenceState({ price: true, reviews: false })).toBe(false)
    })

    it('rejects null', () => {
      expect(isValidPreferenceState(null)).toBe(false)
    })

    it('rejects non-boolean values', () => {
      expect(
        isValidPreferenceState({
          price: 1,
          reviews: false,
          availability: true,
          brandTrust: false,
          sustainability: true,
        }),
      ).toBe(false)
    })
  })
})
