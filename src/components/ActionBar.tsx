import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLookupStore from '../stores/lookupStore'
import useUserDataStore from '../stores/userDataStore'

export default function ActionBar() {
  const currentProduct = useLookupStore((s) => s.currentProduct)
  const verdict = useLookupStore((s) => s.verdict)

  const watchlist = useUserDataStore((s) => s.watchlist)
  const storageError = useUserDataStore((s) => s.storageError)
  const preferences = useUserDataStore((s) => s.preferences)
  const saveCaseFile = useUserDataStore((s) => s.saveCaseFile)
  const addToWatchlist = useUserDataStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useUserDataStore((s) => s.removeFromWatchlist)

  const [saveMsg, setSaveMsg] = useState<{ text: string; isError: boolean } | null>(null)

  if (!currentProduct || !verdict) return null

  const inWatchlist = watchlist.some((w) => w.productId === currentProduct.id)

  function handleSave() {
    if (!currentProduct || !verdict) return
    const file = {
      id: uuidv4(),
      productName: currentProduct.name,
      productUrl: currentProduct.slug,
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      preferences,
      timestamp: new Date().toISOString(),
    }
    saveCaseFile(file)
    if (storageError) {
      setSaveMsg({ text: 'Failed to save case file.', isError: true })
    } else {
      setSaveMsg({ text: 'Saved to case files!', isError: false })
    }
    setTimeout(() => setSaveMsg(null), 3000)
  }

  function handleWatchlist() {
    if (!currentProduct || !verdict) return
    if (inWatchlist) {
      removeFromWatchlist(currentProduct.id)
    } else {
      addToWatchlist({
        productId: currentProduct.id,
        productName: currentProduct.name,
        lastVerdict: verdict.verdict,
        addedAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3 items-center">
      <button
        onClick={handleSave}
        className="bg-pinkPrimary text-gray-800 font-semibold px-5 py-2 rounded-lg hover:brightness-95 transition-all text-sm"
      >
        Save Case File
      </button>
      <button
        onClick={handleWatchlist}
        className="border border-lavender text-purple-800 font-semibold px-5 py-2 rounded-lg hover:bg-lavender/20 transition-all text-sm"
      >
        {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
      {saveMsg && (
        <p className={`text-sm font-medium ${saveMsg.isError ? 'text-red-600' : 'text-green-700'}`}>
          {saveMsg.text}
        </p>
      )}
    </div>
  )
}
