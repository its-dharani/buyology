import { create } from 'zustand'
import type { LookupStore } from '../types/stores'
import { parseUrl } from '../lib/urlParser'
import { fuzzyMatch } from '../lib/fuzzyMatcher'
import { computeVerdict } from '../lib/verdictEngine'
import { dataset } from '../data'
import useUserDataStore from './userDataStore'

const useLookupStore = create<LookupStore>((set) => ({
  currentProduct: null,
  verdict: null,
  isLoading: false,
  notFound: false,

  lookup: (input: string) => {
    set({ isLoading: true, notFound: false, currentProduct: null, verdict: null })

    // Try URL slug first — if parseUrl returns a slug (well-formed URL), only look up
    // by that slug. If the slug is not in the dataset, do NOT fall through to fuzzy
    // search (Req 1.8: URL input must not fuzzy-match on the raw URL string).
    const slug = parseUrl(input)
    let product: ReturnType<typeof fuzzyMatch> = null

    if (slug !== null) {
      // Input was a URL — honour slug lookup only
      product = dataset.bySlug[slug] ?? null
    } else {
      // Not a URL — try direct slug lookup on trimmed input, then fuzzy name match
      const trimmed = input.trim().toLowerCase()
      product = dataset.bySlug[trimmed] ?? null

      if (!product) {
        product = fuzzyMatch(input, dataset.products)
      }
    }

    if (!product) {
      useUserDataStore.getState().addHistoryEntry({
        searchTerm: input.trim(),
        resultName: 'not found',
        timestamp: new Date().toISOString(),
      })
      set({ isLoading: false, notFound: true })
      return
    }

    const preferences = useUserDataStore.getState().preferences
    const verdict = computeVerdict(product, product.budgetThreshold, preferences)

    // Record in history
    useUserDataStore.getState().addHistoryEntry({
      searchTerm: input.trim(),
      resultName: product.name,
      timestamp: new Date().toISOString(),
    })

    set({ isLoading: false, currentProduct: product, verdict })
  },

  clearResult: () => {
    set({ currentProduct: null, verdict: null, isLoading: false, notFound: false })
  },
}))

export default useLookupStore
