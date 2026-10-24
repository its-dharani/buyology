import { useState } from 'react'
import useLookupStore from '../stores/lookupStore'
import useUIStore from '../stores/uiStore'

export default function SearchBar() {
  const [value, setValue] = useState('')
  const [validationMsg, setValidationMsg] = useState('')
  const lookup = useLookupStore((s) => s.lookup)
  const setView = useUIStore((s) => s.setView)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setValidationMsg('Please enter a product name or URL.')
      return
    }
    // Allow URLs up to 2048 chars (Req 1.1). Only enforce the 200-char limit for
    // plain product names (inputs that do not start with a URL scheme).
    const isUrl = /^https?:\/\//i.test(trimmed)
    if (!isUrl && trimmed.length > 200) {
      setValidationMsg('Input must be 200 characters or fewer.')
      return
    }
    setValidationMsg('')
    lookup(trimmed)
    setView('result')
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="product-search" className="block text-sm font-semibold text-gray-700 mb-2">
          Search for a product
        </label>
        <div className="flex gap-3">
          <input
            id="product-search"
            type="text"
            aria-label="Search for a product by URL or name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste a URL or type a product name…"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pinkPrimary focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-pinkPrimary text-gray-800 font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
          >
            Investigate
          </button>
        </div>
        {validationMsg && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {validationMsg}
          </p>
        )}
      </form>
    </div>
  )
}
