import { parseUrl } from '../urlParser'

describe('parseUrl — unit tests', () => {
  it('extracts slug from a well-formed URL', () => {
    expect(parseUrl('https://example.com/products/sony-wh-1000xm5')).toBe('sony-wh-1000xm5')
  })

  it('handles trailing slash by returning null (no segment after slash)', () => {
    // trailing slash → last segment is empty string → null
    expect(parseUrl('https://example.com/products/sony-wh-1000xm5/')).toBe('sony-wh-1000xm5')
  })

  it('normalises UPPERCASE to lowercase', () => {
    expect(parseUrl('https://example.com/Products/SONY-WH-1000XM5')).toBe('sony-wh-1000xm5')
  })

  it('returns null for a non-URL string', () => {
    expect(parseUrl('not a url at all')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(parseUrl('')).toBeNull()
  })

  it('returns null for whitespace-only input', () => {
    expect(parseUrl('   ')).toBeNull()
  })

  it('does not throw for non-ASCII input', () => {
    expect(() => parseUrl('https://example.com/products/café-au-lait')).not.toThrow()
  })

  it('works with ftp:// scheme', () => {
    const result = parseUrl('ftp://files.example.com/product-file')
    expect(result).toBe('product-file')
  })

  it('round-trip stability: parseUrl("https://x.com/" + slug) === slug for known slugs', () => {
    const slugs = ['sony-wh-1000xm5', 'apple-airpods-pro-2', 'samsung-galaxy-s24']
    for (const slug of slugs) {
      expect(parseUrl(`https://x.com/${slug}`)).toBe(slug)
    }
  })

  it('returns null for URL with only origin (no path segments)', () => {
    expect(parseUrl('https://example.com/')).toBeNull()
  })

  it('strips leading and trailing hyphens from the slug', () => {
    // special chars become hyphens, then trimmed
    expect(parseUrl('https://example.com/products/___product___')).toBe('product')
  })
})
