import useUserDataStore from '../stores/userDataStore'
import useLookupStore from '../stores/lookupStore'
import useUIStore from '../stores/uiStore'

export default function HistoryView() {
  const history = useUserDataStore((s) => s.history)
  const clearHistory = useUserDataStore((s) => s.clearHistory)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Search History</h2>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all search history?')) {
                clearHistory()
              }
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          No search history yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {history.map((entry) => (
            <li key={`${entry.searchTerm}-${entry.timestamp}`}>
              <button
                onClick={() => {
                  useLookupStore.getState().lookup(entry.searchTerm)
                  useUIStore.getState().setView('result')
                }}
                className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{entry.searchTerm}</p>
                  <p className="text-xs text-gray-400 truncate">{entry.resultName}</p>
                </div>
                <span className="text-pinkPrimary text-sm shrink-0">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
