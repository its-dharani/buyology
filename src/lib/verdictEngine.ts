import type { Product, PreferenceState, VerdictResult, Verdict } from '../types'

const BASE_SCORES: Record<Verdict, number> = {
  BUY: 80,
  WAIT: 50,
  SKIP: 20,
}

function computeConfidence(verdict: Verdict, preferences: PreferenceState): number {
  const activeCount = Object.values(preferences).filter(Boolean).length
  if (activeCount === 0) return 0
  const base = BASE_SCORES[verdict]
  return Math.min(100, Math.max(0, Math.round(base * (activeCount / 5))))
}

/**
 * Computes a BUY / WAIT / SKIP verdict for a product given a budget threshold
 * and the user's active preferences. Pure function — never throws.
 */
export function computeVerdict(
  product: Product,
  budgetThreshold: number,
  preferences: PreferenceState,
): VerdictResult {
  let verdict: Verdict

  if (product.reviewScore <= 2 || product.discontinued || product.suspectedCounterfeit) {
    verdict = 'SKIP'
  } else if (product.currentPrice <= budgetThreshold) {
    verdict = 'BUY'
  } else if (product.priceTrend === 'down') {
    verdict = 'WAIT'
  } else if (product.stockLevel === 'low' || product.priceTrend === 'up') {
    verdict = 'WAIT'
  } else {
    verdict = 'SKIP'
  }

  return {
    verdict,
    confidence: computeConfidence(verdict, preferences),
  }
}
