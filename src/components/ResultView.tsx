import useLookupStore from '../stores/lookupStore'
import { dataset } from '../data'
import VerdictCard from './VerdictCard'
import PreferencePanel from './PreferencePanel'
import ProductDetails from './ProductDetails'
import AlternativesGrid from './AlternativesGrid'
import ActionBar from './ActionBar'

export default function ResultView() {
  const isLoading = useLookupStore((s) => s.isLoading)
  const notFound = useLookupStore((s) => s.notFound)
  const currentProduct = useLookupStore((s) => s.currentProduct)
  const verdict = useLookupStore((s) => s.verdict)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div
          role="status"
          aria-label="Investigating product…"
          className="w-10 h-10 border-4 border-pinkPrimary border-t-transparent rounded-full animate-spin"
        />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center space-y-3">
        <p className="text-lg font-semibold text-gray-800">No product found</p>
        <p className="text-sm text-gray-500">Try these tips:</p>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• Check the spelling of the product name</li>
          <li>• Paste a full product URL</li>
          <li>• Use the exact product model name (e.g. "Sony WH-1000XM5")</li>
        </ul>
      </div>
    )
  }

  if (!currentProduct || !verdict) return null

  return (
    <div className="space-y-4 mt-4">
      <VerdictCard verdict={verdict.verdict} confidence={verdict.confidence} />
      <PreferencePanel />
      <ProductDetails product={currentProduct} />
      <AlternativesGrid alternativeIds={currentProduct.alternatives} dataset={dataset} />
      <ActionBar />
    </div>
  )
}
