import fc from 'fast-check'
import { serialize } from '../storage'

const verdictArb = fc.constantFrom('BUY', 'WAIT', 'SKIP') as fc.Arbitrary<'BUY' | 'WAIT' | 'SKIP'>

const caseFileArb = fc.record({
  id: fc.string(),
  productName: fc.string(),
  productUrl: fc.string(),
  verdict: verdictArb,
  confidence: fc.integer({ min: 0, max: 100 }),
  preferences: fc.record({
    price: fc.boolean(),
    reviews: fc.boolean(),
    availability: fc.boolean(),
    brandTrust: fc.boolean(),
    sustainability: fc.boolean(),
  }),
  timestamp: fc.string(),
})

describe('storage — property-based tests', () => {
  it('P13 Round-trip: serialize then JSON.parse deep-equals original', () => {
    fc.assert(
      fc.property(caseFileArb, (caseFile) => {
        const serialized = serialize(caseFile)
        if (serialized === null) return false
        const parsed = JSON.parse(serialized) as typeof caseFile
        return JSON.stringify(parsed) === JSON.stringify(caseFile)
      }),
      { numRuns: 100 },
    )
  })

  it('P14 No-throw: serialize never throws', () => {
    fc.assert(
      fc.property(caseFileArb, (caseFile) => {
        serialize(caseFile)
        return true
      }),
      { numRuns: 100 },
    )
  })

  it('P15 Parse no-throw: JSON.parse of serialize output never throws', () => {
    fc.assert(
      fc.property(caseFileArb, (caseFile) => {
        const serialized = serialize(caseFile)
        if (serialized === null) return true
        JSON.parse(serialized)
        return true
      }),
      { numRuns: 100 },
    )
  })
})
