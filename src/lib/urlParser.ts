/**
 * Parses a URL string and extracts the last pathname segment as a slug.
 * Returns null for empty/whitespace input, invalid URLs, or empty slugs.
 * Never throws.
 */
export function parseUrl(input: string): string | null {
  if (!input || !input.trim()) return null
  try {
    const url = new URL(input.trim())
    const segments = url.pathname.split('/').filter((s) => s.length > 0)
    const last = segments[segments.length - 1]
    if (!last) return null
    const slug = last
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || null
  } catch {
    return null
  }
}
