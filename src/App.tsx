import { useEffect, useRef, useState } from 'react'
import { hydrateFromApi } from './data'
import Navigation from './components/Navigation'
import SearchBar from './components/SearchBar'
import ResultView from './components/ResultView'
import CaseFilesView from './components/CaseFilesView'
import WatchlistView from './components/WatchlistView'
import HistoryView from './components/HistoryView'
import useUIStore from './stores/uiStore'
import useUserDataStore from './stores/userDataStore'
import { readStorage, STORAGE_KEYS, isValidPurchaseCaseFile, isValidPreferenceState } from './lib/storage'
import { DEFAULT_PREFERENCES } from './types'
import type { PurchaseCaseFile, WatchlistEntry, HistoryEntry, PreferenceState } from './types'

function ToastArea({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-red-200 rounded-xl shadow-lg px-5 py-4 flex items-center gap-4 max-w-sm">
        <p className="text-sm text-red-700 font-medium">{message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const activeView = useUIStore((s) => s.activeView)
  const storageError = useUserDataStore((s) => s.storageError)
  const [toastDismissed, setToastDismissed] = useState(false)
  const apiHydrated = useRef(false)

  useEffect(() => {
    // Hydrate localStorage user data
    const rawPrefs = readStorage<PreferenceState>(STORAGE_KEYS.preferences)
    const rawCaseFiles = readStorage<unknown[]>(STORAGE_KEYS.caseFiles)
    const rawWatchlist = readStorage<WatchlistEntry[]>(STORAGE_KEYS.watchlist)
    const rawHistory = readStorage<HistoryEntry[]>(STORAGE_KEYS.history)

    const allCaseFiles = Array.isArray(rawCaseFiles) ? rawCaseFiles : []
    const validCaseFiles: PurchaseCaseFile[] = allCaseFiles.filter(isValidPurchaseCaseFile)
    const skippedCount = allCaseFiles.length - validCaseFiles.length

    useUserDataStore.getState().hydrate({
      preferences: isValidPreferenceState(rawPrefs) ? rawPrefs : DEFAULT_PREFERENCES,
      caseFiles: validCaseFiles,
      skippedCaseFiles: skippedCount,
      watchlist: Array.isArray(rawWatchlist) ? rawWatchlist : [],
      history: Array.isArray(rawHistory) ? rawHistory : [],
    })

    // Fetch product catalogue from AWS API (non-blocking — app works without it)
    if (!apiHydrated.current) {
      apiHydrated.current = true
      hydrateFromApi()
    }
  }, [])

  // Reset toast dismissed state when a new error appears
  useEffect(() => {
    if (storageError) setToastDismissed(false)
  }, [storageError])

  const showSearch = activeView === 'search' || activeView === 'result'

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {showSearch ? (
          <>
            <SearchBar />
            {activeView === 'result' && <ResultView />}
          </>
        ) : activeView === 'caseFiles' ? (
          <CaseFilesView />
        ) : activeView === 'watchlist' ? (
          <WatchlistView />
        ) : (
          <HistoryView />
        )}
      </main>
      {storageError && !toastDismissed && (
        <ToastArea message={storageError} onDismiss={() => setToastDismissed(true)} />
      )}
    </div>
  )
}
