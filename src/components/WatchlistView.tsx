import useUserDataStore from '../stores/userDataStore'
import type { Verdict } from '../types'

const VERDICT_BADGE: Record<Verdict, string> = {
  BUY: 'bg-buyGreen text-green-800',
  WAIT: 'bg-waitAmber text-amber-800',
  SKIP: 'bg-skipRose text-red-800',
}

export default function WatchlistView() {
  const watchlist = useUserDataStore((s) => s.watchlist)
  const storageError = useUserDataStore((s) => s.storageError)
  const removeFromWatchlist = useUserDataStore((s) => s.removeFromWatchlist)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Watchlist</h2>

      {storageError && (
        <div className="bg-skipRose text-red-800 rounded-lg px-4 py-2 text-sm font-medium">
          Storage error: {storageError}
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Your watchlist is empty. Add products to track them.
        </div>
      ) : (
        <ul className="space-y-3">
          {watchlist.map((entry) => (
            <li
              key={entry.productId}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{entry.productName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${VERDICT_BADGE[entry.lastVerdict]}`}
                  >
                    {entry.lastVerdict}
                  </span>
                  <span
                    className="bg-lavender text-purple-800 rounded-full px-2 py-1 text-xs pointer-events-none"
                    aria-label="Price tracking coming soon"
                  >
                    Coming Soon
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromWatchlist(entry.productId)}
                aria-label={`Remove ${entry.productName} from watchlist`}
                className="text-sm text-red-500 hover:text-red-700 shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
