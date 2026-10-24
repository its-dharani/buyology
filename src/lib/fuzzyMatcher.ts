import { distance } from 'fastest-levenshtein'
import type { Product } from '../types'

/**
 * Finds the best matching product for a search term using Levenshtein distance.
 * Returns the product if the best similarity score is >= 0.80, otherwise null.
 * Never throws.
 */
export function fuzzyMatch(searchTerm: string, products: Product[]): Product | null {
  if (!searchTerm || !searchTerm.trim()) return null
  try {
    const normalizedInput = searchTerm.trim().toLowerCase()
    let bestMatch: Product | null = null
    let bestScore = -1

    for (const product of products) {
      const normalizedName = product.name.toLowerCase()
      const dist = distance(normalizedInput, normalizedName)
      const maxLen = Math.max(normalizedInput.length, normalizedName.length)
      const score = maxLen === 0 ? 1 : 1 - dist / maxLen
      if (score > bestScore) {
        bestScore = score
        bestMatch = product
      }
    }

    return bestScore >= 0.8 ? bestMatch : null
  } catch {
    return null
  }
}
