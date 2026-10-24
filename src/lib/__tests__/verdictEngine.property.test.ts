import fc from 'fast-check'
import { computeVerdict } from '../verdictEngine'
import type { Product, PreferenceState } from '../../types'

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const stockLevelArb = fc.constantFrom('high', 'low', 'out') as fc.Arbitrary<Product['stockLevel']>
const priceTrendArb = fc.constantFrom('up', 'down', 'flat', 'unknown') as fc.Arbitrary<Product['priceTrend']>

const productArb = fc.record<Product>({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  currentPrice: fc.float({ min: 0, max: 10000, noNaN: true }),
  budgetThreshold: fc.float({ min: 0, max: 10000, noNaN: true }),
  reviewScore: fc.float({ min: 0, max: 5, noNaN: true }),
  stockLevel: stockLevelArb,
  priceTrend: priceTrendArb,
  discontinued: fc.boolean(),
  suspectedCounterfeit: fc.boolean(),
  priceHistory: fc.array(
    fc.record({ date: fc.string(), price: fc.float({ min: 0, max: 10000, noNaN: true }) }),
  ),
  alternatives: fc.array(fc.string()),
})

const prefsArb = fc.record<PreferenceState>({
  price: fc.boolean(),
  reviews: fc.boolean(),
  availability: fc.boolean(),
  brandTrust: fc.boolean(),
  sustainability: fc.boolean(),
})

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

describe('computeVerdict — property-based tests', () => {
  it('P1 BUY Invariant: no critical flags + price <= threshold → verdict === "BUY"', () => {
    const safePriceArb = fc.float({ min: 0, max: 5000, noNaN: true })
    fc.assert(
      fc.property(safePriceArb, prefsArb, (price, prefs) => {
        const product: Product = {
          id: 'p1',
          name: 'Safe Product',
          slug: 'safe-product',
          currentPrice: price,
          budgetThreshold: price + 1, // always <= threshold
          reviewScore: 4.0, // > 2
          stockLevel: 'high',
          priceTrend: 'flat',
          discontinued: false,
          suspectedCounterfeit: false,
          priceHistory: [],
          alternatives: [],
        }
        const result = computeVerdict(product, product.budgetThreshold, prefs)
        return result.verdict === 'BUY'
      }),
      { numRuns: 100 },
    )
  })

  it('P2 Critical SKIP: any critical flag set → verdict !== "BUY"', () => {
    // at least one of: reviewScore <= 2, discontinued, suspectedCounterfeit
    const criticalArb = fc.oneof(
      productArb.map((p) => ({ ...p, reviewScore: 0 })),
      productArb.map((p) => ({ ...p, discontinued: true, reviewScore: 4 })),
      productArb.map((p) => ({ ...p, suspectedCounterfeit: true, reviewScore: 4, discontinued: false })),
    )
    fc.assert(
      fc.property(criticalArb, prefsArb, (product, prefs) => {
        const result = computeVerdict(product, product.budgetThreshold, prefs)
        return result.verdict !== 'BUY'
      }),
      { numRuns: 100 },
    )
  })

  it('P3 Confidence Bounds: confidence is an integer in [0, 100]', () => {
    fc.assert(
      fc.property(productArb, fc.float({ min: 0, max: 10000, noNaN: true }), prefsArb, (product, threshold, prefs) => {
        const result = computeVerdict(product, threshold, prefs)
        return (
          Number.isInteger(result.confidence) &&
          result.confidence >= 0 &&
          result.confidence <= 100
        )
      }),
      { numRuns: 100 },
    )
  })

  it('P4 Completeness: result is always defined, verdict is in valid set, never throws', () => {
    const validVerdicts = new Set(['BUY', 'WAIT', 'SKIP'])
    fc.assert(
      fc.property(productArb, fc.float({ min: 0, max: 10000, noNaN: true }), prefsArb, (product, threshold, prefs) => {
        const result = computeVerdict(product, threshold, prefs)
        return (
          result !== null &&
          result !== undefined &&
          validVerdicts.has(result.verdict) &&
          typeof result.confidence === 'number'
        )
      }),
      { numRuns: 100 },
    )
  })
})
