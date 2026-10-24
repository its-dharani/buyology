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

    // Try URL slug first, then bySlug, then fuzzy name match
    const slug = parseUrl(input)
    let product = slug ? (dataset.bySlug[slug] ?? null) : null

    // If URL parse failed or slug not found, try direct slug lookup on trimmed input
    if (!product) {
      const trimmed = input.trim().toLowerCase()
      product = dataset.bySlug[trimmed] ?? null
    }

    // Fall back to fuzzy name match
    if (!product) {
      product = fuzzyMatch(input, dataset.products)
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
