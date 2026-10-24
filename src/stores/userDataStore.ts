import { create } from 'zustand'
import type { UserDataStore, UserDataStoreState } from '../types/stores'
import { DEFAULT_PREFERENCES } from '../types'
import { writeStorage, STORAGE_KEYS } from '../lib/storage'

const useUserDataStore = create<UserDataStore>((set, get) => ({
  preferences: DEFAULT_PREFERENCES,
  caseFiles: [],
  watchlist: [],
  history: [],
  skippedCaseFiles: 0,
  storageError: null,

  setPreferences: (prefs) => {
    set({ preferences: prefs })
    writeStorage(STORAGE_KEYS.preferences, prefs)
  },

  saveCaseFile: (file) => {
    try {
      const next = [...get().caseFiles, file]
      set({ caseFiles: next, storageError: null })
      writeStorage(STORAGE_KEYS.caseFiles, next)
    } catch {
      set({ storageError: 'Failed to save case file.' })
    }
  },

  deleteCaseFile: (id) => {
    const next = get().caseFiles.filter((f) => f.id !== id)
    set({ caseFiles: next })
    writeStorage(STORAGE_KEYS.caseFiles, next)
  },

  addToWatchlist: (entry) => {
    const next = [entry, ...get().watchlist].slice(0, 100)
    set({ watchlist: next })
    writeStorage(STORAGE_KEYS.watchlist, next)
  },

  removeFromWatchlist: (productId) => {
    const next = get().watchlist.filter((w) => w.productId !== productId)
    set({ watchlist: next })
    writeStorage(STORAGE_KEYS.watchlist, next)
  },

  addHistoryEntry: (entry) => {
    const filtered = get().history.filter((h) => h.searchTerm !== entry.searchTerm)
    const next = [entry, ...filtered].slice(0, 20)
    set({ history: next })
    writeStorage(STORAGE_KEYS.history, next)
  },

  clearHistory: () => {
    set({ history: [] })
    writeStorage(STORAGE_KEYS.history, [])
  },

  hydrate: (data: Partial<UserDataStoreState>) => {
    set(data)
  },
}))

export default useUserDataStore
