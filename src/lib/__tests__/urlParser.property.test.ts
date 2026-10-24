import fc from 'fast-check'
import { parseUrl } from '../urlParser'

describe('parseUrl — property-based tests', () => {
  it('P5 No-throw: parseUrl never throws for any string input', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        parseUrl(s)
        return true
      }),
      { numRuns: 100 },
    )
  })

  it('P6 Return type: result is always null or a string (never undefined)', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = parseUrl(s)
        return result === null || typeof result === 'string'
      }),
      { numRuns: 100 },
    )
  })

  it('P7 Round-trip stability: parseUrl("https://x.com/" + slug) === slug', () => {
    fc.assert(
      fc.property(fc.webUrl(), (url) => {
        const slug = parseUrl(url)
        if (!slug) return true
        return parseUrl(`https://x.com/${slug}`) === slug
      }),
      { numRuns: 100 },
    )
  })
})
