import fc from 'fast-check'
import { fuzzyMatch } from '../fuzzyMatcher'
import { dataset } from '../../data'

describe('fuzzyMatch — property-based tests', () => {
  it('result is always null or a valid Product object with an id field', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = fuzzyMatch(s, dataset.products)
        return result === null || (typeof result === 'object' && 'id' in result)
      }),
      { numRuns: 100 },
    )
  })

  it('never throws for any string input', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        fuzzyMatch(s, dataset.products)
        return true
      }),
      { numRuns: 100 },
    )
  })
})
