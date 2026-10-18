import type { Product, VerdictResult, PreferenceState, PurchaseCaseFile, WatchlistEntry, HistoryEntry } from './index'

export interface LookupStore {
  currentProduct: Product | null
  verdict: VerdictResult | null
  isLoading: boolean
  notFound: boolean
  lookup: (input: string) => void
  clearResult: () => void
}

export interface UserDataStoreState {
  preferences: PreferenceState
  caseFiles: PurchaseCaseFile[]
  watchlist: WatchlistEntry[]
  history: HistoryEntry[]
  skippedCaseFiles: number
  storageError: string | null
}

export interface UserDataStore extends UserDataStoreState {
  setPreferences: (prefs: PreferenceState) => void
  saveCaseFile: (file: PurchaseCaseFile) => void
  deleteCaseFile: (id: string) => void
  addToWatchlist: (entry: WatchlistEntry) => void
  removeFromWatchlist: (productId: string) => void
  addHistoryEntry: (entry: HistoryEntry) => void
  clearHistory: () => void
  hydrate: (data: Partial<UserDataStoreState>) => void
}

export interface UIStore {
  activeView: 'search' | 'result' | 'caseFiles' | 'watchlist' | 'history'
  setView: (view: UIStore['activeView']) => void
}
