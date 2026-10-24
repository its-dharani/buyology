import fc from 'fast-check'
import { getAlternativesForDisplay } from '../alternativesSelector'
import { dataset } from '../../data'

describe('getAlternativesForDisplay — property-based tests', () => {
  it('P10 Cap at 3: result length is always <= 3', () => {
    fc.assert(
      fc.property(fc.array(fc.string(), { minLength: 0, maxLength: 10 }), (ids) => {
        const result = getAlternativesForDisplay(ids, dataset)
        return result.length <= 3
      }),
      { numRuns: 100 },
    )
  })

  it('P11 No-throw: never throws for any array of string IDs', () => {
    fc.assert(
      fc.property(fc.array(fc.string(), { maxLength: 5 }), (ids) => {
        getAlternativesForDisplay(ids, dataset)
        return true
      }),
      { numRuns: 100 },
    )
  })
})
