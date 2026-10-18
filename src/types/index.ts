export interface PricePoint {
  date: string
  price: number
}

export interface Product {
  id: string
  name: string
  slug: string
  currentPrice: number
  budgetThreshold: number
  reviewScore: number
  stockLevel: 'high' | 'low' | 'out'
  priceTrend: 'up' | 'down' | 'flat' | 'unknown'
  discontinued: boolean
  suspectedCounterfeit: boolean
  priceHistory: PricePoint[]
  alternatives: string[]
}

export type ProductDataset = {
  products: Product[]
  bySlug: Record<string, Product>
}

export type Verdict = 'BUY' | 'WAIT' | 'SKIP'

export interface VerdictResult {
  verdict: Verdict
  confidence: number
}

export interface PreferenceState {
  price: boolean
  reviews: boolean
  availability: boolean
  brandTrust: boolean
  sustainability: boolean
}

export const DEFAULT_PREFERENCES: PreferenceState = {
  price: true,
  reviews: true,
  availability: true,
  brandTrust: true,
  sustainability: true,
}

export interface PurchaseCaseFile {
  id: string
  productName: string
  productUrl: string
  verdict: Verdict
  confidence: number
  preferences: PreferenceState
  timestamp: string
}

export interface WatchlistEntry {
  productId: string
  productName: string
  lastVerdict: Verdict
  addedAt: string
}

export interface HistoryEntry {
  searchTerm: string
  resultName: string
  timestamp: string
}
