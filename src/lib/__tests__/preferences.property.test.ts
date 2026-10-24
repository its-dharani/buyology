import fc from 'fast-check'
import { computeVerdict } from '../verdictEngine'
import type { Product, PreferenceState } from '../../types'

// A fixed product fixture that reliably produces BUY (no critical flags, price <= threshold)
const BUY_PRODUCT: Product = {
  id: 'fixed-001',
  name: 'Fixed Test Product',
  slug: 'fixed-test-product',
  currentPrice: 50,
  budgetThreshold: 100,
  reviewScore: 4.5,
  stockLevel: 'high',
  priceTrend: 'flat',
  discontinued: false,
  suspectedCounterfeit: false,
  priceHistory: [],
  alternatives: [],
}

const prefsArb = fc.record<PreferenceState>({
  price: fc.boolean(),
  reviews: fc.boolean(),
  availability: fc.boolean(),
  brandTrust: fc.boolean(),
  sustainability: fc.boolean(),
})

const ALL_OFF: PreferenceState = {
  price: false,
  reviews: false,
  availability: false,
  brandTrust: false,
  sustainability: false,
}

describe('preferences — property-based tests', () => {
  it('P8 Verdict Stability: verdict is the same regardless of preference values (preferences only affect confidence)', () => {
    fc.assert(
      fc.property(prefsArb, prefsArb, (prefsA, prefsB) => {
        const resultA = computeVerdict(BUY_PRODUCT, BUY_PRODUCT.budgetThreshold, prefsA)
        const resultB = computeVerdict(BUY_PRODUCT, BUY_PRODUCT.budgetThreshold, prefsB)
        return resultA.verdict === resultB.verdict
      }),
      { numRuns: 100 },
    )
  })

  it('P9 All-off → confidence is 0', () => {
    const result = computeVerdict(BUY_PRODUCT, BUY_PRODUCT.budgetThreshold, ALL_OFF)
    expect(result.confidence).toBe(0)
  })

  it('P3 ext: confidence in [0, 100] for any preference combination', () => {
    fc.assert(
      fc.property(prefsArb, (prefs) => {
        const result = computeVerdict(BUY_PRODUCT, BUY_PRODUCT.budgetThreshold, prefs)
        return result.confidence >= 0 && result.confidence <= 100
      }),
      { numRuns: 100 },
    )
  })
})
