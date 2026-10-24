import useUIStore from '../stores/uiStore'
import type { UIStore } from '../types/stores'

type View = UIStore['activeView']

interface NavTab {
  view: View
  label: string
}

const TABS: NavTab[] = [
  { view: 'search', label: 'Search' },
  { view: 'caseFiles', label: 'Case Files' },
  { view: 'watchlist', label: 'Watchlist' },
  { view: 'history', label: 'History' },
]

export default function Navigation() {
  const activeView = useUIStore((s) => s.activeView)
  const setView = useUIStore((s) => s.setView)

  // Treat 'result' view as 'search' tab being active
  const activeTab: View = activeView === 'result' ? 'search' : activeView

  return (
    <nav
      style={{ position: 'sticky', top: 0, zIndex: 100 }}
      className="bg-white/95 backdrop-blur border-b border-gray-100"
      aria-label="Main navigation"
    >
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
        <button
          onClick={() => setView('search')}
          className="font-bold text-lg text-gray-900 tracking-tight"
          aria-label="Go to home"
        >
          <span className="text-pinkPrimary">B</span>uyology
        </button>

        <div className="flex items-center gap-1" role="tablist">
          {TABS.map(({ view, label }) => {
            const isActive = activeTab === view
            return (
              <button
                key={view}
                role="tab"
                aria-label={`${label} view`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setView(view)}
                className={[
                  'px-3 py-2 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pinkPrimary',
                  isActive
                    ? 'text-gray-900 border-b-2 border-pinkPrimary rounded-none pb-3'
                    : 'text-gray-500 hover:text-gray-800',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
