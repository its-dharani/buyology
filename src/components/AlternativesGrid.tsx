import type { ProductDataset } from '../types'
import { getAlternativesForDisplay } from '../lib/alternativesSelector'

interface AlternativesGridProps {
  alternativeIds: string[]
  dataset: ProductDataset
}

export default function AlternativesGrid({ alternativeIds, dataset }: AlternativesGridProps) {
  if (alternativeIds.length === 0) return null

  const alts = getAlternativesForDisplay(alternativeIds, dataset)
  if (alts.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Alternatives</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alts.map((alt) => (
          <div
            key={alt.id ?? 'unknown'}
            className="border border-gray-100 rounded-lg p-4 space-y-2 text-sm"
          >
            <p className="font-semibold text-gray-900">{alt.name ?? 'N/A'}</p>
            <div className="text-gray-600 space-y-1">
              <p>
                Price:{' '}
                {alt.currentPrice !== undefined && alt.currentPrice !== null
                  ? '$' + alt.currentPrice.toFixed(2)
                  : 'N/A'}
              </p>
              <p>
                Review:{' '}
                {alt.reviewScore !== undefined && alt.reviewScore !== null
                  ? `${alt.reviewScore}/5`
                  : 'N/A'}
              </p>
              <p>
                Stock:{' '}
                {alt.stockLevel !== undefined && alt.stockLevel !== null
                  ? alt.stockLevel
                  : 'N/A'}
              </p>
              <p>
                Trend:{' '}
                {alt.priceTrend !== undefined && alt.priceTrend !== null
                  ? alt.priceTrend
                  : 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
