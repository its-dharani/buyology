import useUserDataStore from '../stores/userDataStore'
import type { PreferenceState } from '../types'

interface PillDef {
  key: keyof PreferenceState
  label: string
}

const PILLS: PillDef[] = [
  { key: 'price', label: 'Price' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'availability', label: 'Availability' },
  { key: 'brandTrust', label: 'Brand Trust' },
  { key: 'sustainability', label: 'Sustainability' },
]

export default function PreferencePanel() {
  const preferences = useUserDataStore((s) => s.preferences)
  const setPreferences = useUserDataStore((s) => s.setPreferences)

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        What matters to you?
      </p>
      <div className="flex flex-wrap gap-2">
        {PILLS.map(({ key, label }) => {
          const active = preferences[key]
          return (
            <button
              key={key}
              role="switch"
              aria-checked={active}
              aria-label={`${label} preference`}
              onClick={() => setPreferences({ ...preferences, [key]: !active })}
              className={
                active
                  ? 'bg-pinkPrimary text-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-all'
                  : 'bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-gray-200'
              }
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
