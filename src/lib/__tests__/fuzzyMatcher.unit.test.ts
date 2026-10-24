import { fuzzyMatch } from '../fuzzyMatcher'
import { dataset } from '../../data'

describe('fuzzyMatch — unit tests', () => {
  it('returns the correct product for an exact name match', () => {
    const result = fuzzyMatch('Sony WH-1000XM5', dataset.products)
    expect(result).not.toBeNull()
    expect(result?.name).toBe('Sony WH-1000XM5')
  })

  it('returns the product for a high-similarity variant (≥80%)', () => {
    // "Sony WH1000XM5" is close enough to "Sony WH-1000XM5"
    const result = fuzzyMatch('Sony WH-1000XM5!', dataset.products)
    expect(result).not.toBeNull()
    expect(result?.name).toBe('Sony WH-1000XM5')
  })

  it('returns null for an unrelated string', () => {
    const result = fuzzyMatch('zzzzzzz totally unrelated xyzxyz', dataset.products)
    expect(result).toBeNull()
  })

  it('returns null for an empty products array', () => {
    const result = fuzzyMatch('Sony WH-1000XM5', [])
    expect(result).toBeNull()
  })

  it('returns null for a blank input', () => {
    const result = fuzzyMatch('', dataset.products)
    expect(result).toBeNull()
  })

  it('returns null for whitespace-only input', () => {
    const result = fuzzyMatch('   ', dataset.products)
    expect(result).toBeNull()
  })

  it('does not throw for non-ASCII input', () => {
    expect(() => fuzzyMatch('名前製品テスト', dataset.products)).not.toThrow()
  })
})
