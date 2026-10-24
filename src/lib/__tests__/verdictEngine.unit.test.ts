import { computeVerdict } from '../verdictEngine'
import { DEFAULT_PREFERENCES } from '../../types'
import type { Product, PreferenceState } from '../../types'

/** Minimal valid product fixture — override only what each test needs */
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'test-001',
    name: 'Test Product',
    slug: 'test-product',
    currentPrice: 100,
    budgetThreshold: 120,
    reviewScore: 4.0,
    stockLevel: 'high',
    priceTrend: 'flat',
    discontinued: false,
    suspectedCounterfeit: false,
    priceHistory: [],
    alternatives: [],
    ...overrides,
  }
}

const ALL_OFF: PreferenceState = {
  price: false,
  reviews: false,
  availability: false,
  brandTrust: false,
  sustainability: false,
}

describe('computeVerdict — unit tests', () => {
  describe('SKIP verdicts — critical flags', () => {
    it('returns SKIP when reviewScore <= 2', () => {
      const result = computeVerdict(makeProduct({ reviewScore: 2 }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('SKIP')
    })

    it('returns SKIP when reviewScore is 0', () => {
      const result = computeVerdict(makeProduct({ reviewScore: 0 }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('SKIP')
    })

    it('returns SKIP when discontinued is true', () => {
      const result = computeVerdict(makeProduct({ discontinued: true }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('SKIP')
    })

    it('returns SKIP when suspectedCounterfeit is true', () => {
      const result = computeVerdict(makeProduct({ suspectedCounterfeit: true }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('SKIP')
    })
  })

  describe('BUY verdict', () => {
    it('returns BUY when price <= threshold and no critical flags', () => {
      const result = computeVerdict(makeProduct({ currentPrice: 100 }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('BUY')
    })

    it('returns BUY when price equals threshold', () => {
      const result = computeVerdict(makeProduct({ currentPrice: 120 }), 120, DEFAULT_PREFERENCES)
      expect(result.verdict).toBe('BUY')
    })
  })

  describe('WAIT verdicts', () => {
    it('returns WAIT when price > threshold and priceTrend is down', () => {
      const result = computeVerdict(
        makeProduct({ currentPrice: 150, priceTrend: 'down' }),
        120,
        DEFAULT_PREFERENCES,
      )
      expect(result.verdict).toBe('WAIT')
    })

    it('returns WAIT when stockLevel is low (price above threshold)', () => {
      const result = computeVerdict(
        makeProduct({ currentPrice: 150, stockLevel: 'low' }),
        120,
        DEFAULT_PREFERENCES,
      )
      expect(result.verdict).toBe('WAIT')
    })

    it('returns WAIT when priceTrend is up (price above threshold)', () => {
      const result = computeVerdict(
        makeProduct({ currentPrice: 150, priceTrend: 'up' }),
        120,
        DEFAULT_PREFERENCES,
      )
      expect(result.verdict).toBe('WAIT')
    })
  })

  describe('default SKIP', () => {
    it('returns SKIP when price above threshold and trend is flat', () => {
      const result = computeVerdict(
        makeProduct({ currentPrice: 150, priceTrend: 'flat' }),
        120,
        DEFAULT_PREFERENCES,
      )
      expect(result.verdict).toBe('SKIP')
    })
  })

  describe('confidence calculation', () => {
    it('returns confidence === 0 when all preferences are off', () => {
      const result = computeVerdict(makeProduct({ currentPrice: 100 }), 120, ALL_OFF)
      expect(result.confidence).toBe(0)
      // verdict is still computed even with all prefs off
      expect(result.verdict).toBe('BUY')
    })

    it('returns confidence === 80 for BUY with all 5 preferences on', () => {
      const result = computeVerdict(makeProduct({ currentPrice: 100 }), 120, DEFAULT_PREFERENCES)
      expect(result.confidence).toBe(80)
    })

    it('returns confidence === Math.round(80 * 3/5) === 48 for BUY with 3 preferences', () => {
      const threeOn: PreferenceState = {
        price: true,
        reviews: true,
        availability: true,
        brandTrust: false,
        sustainability: false,
      }
      const result = computeVerdict(makeProduct({ currentPrice: 100 }), 120, threeOn)
      expect(result.confidence).toBe(48)
    })

    it('confidence is in [0, 100] range', () => {
      const result = computeVerdict(makeProduct(), 120, DEFAULT_PREFERENCES)
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(100)
    })
  })
})
