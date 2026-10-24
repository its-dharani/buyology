import type { Product } from '../types'

interface ProductDetailsProps {
  product: Product
}

function formatPrice(n: number): string {
  return '$' + n.toFixed(2)
}

const STOCK_BADGE: Record<Product['stockLevel'], { label: string; cls: string }> = {
  high: { label: 'In Stock', cls: 'bg-buyGreen text-green-800' },
  low: { label: 'Low Stock', cls: 'bg-waitAmber text-amber-800' },
  out: { label: 'Out of Stock', cls: 'bg-skipRose text-red-800' },
}

const TREND_BADGE: Record<Product['priceTrend'], { label: string; cls: string }> = {
  up: { label: '↑ Rising', cls: 'bg-skipRose text-red-800' },
  down: { label: '↓ Falling', cls: 'bg-buyGreen text-green-800' },
  flat: { label: '→ Stable', cls: 'bg-gray-100 text-gray-700' },
  unknown: { label: '? Unknown', cls: 'bg-gray-100 text-gray-500' },
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const stock = STOCK_BADGE[product.stockLevel]
  const trend = TREND_BADGE[product.priceTrend]

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Current price</span>
          <p className="font-semibold text-gray-900">{formatPrice(product.currentPrice)}</p>
        </div>
        <div>
          <span className="text-gray-500">Your budget</span>
          <p className="font-semibold text-gray-900">{formatPrice(product.budgetThreshold)}</p>
        </div>
        <div>
          <span className="text-gray-500">Review score</span>
          <p className="font-semibold text-gray-900">{product.reviewScore}/5</p>
        </div>
        <div>
          <span className="text-gray-500">Availability</span>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stock.cls}`}>
            {stock.label}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Price trend</span>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${trend.cls}`}>
            {trend.label}
          </span>
        </div>
      </div>

      {product.discontinued && (
        <div className="bg-skipRose text-red-800 rounded-lg px-4 py-2 text-sm font-medium">
          ⚠ This product has been discontinued.
        </div>
      )}

      {product.suspectedCounterfeit && (
        <div className="bg-waitAmber text-amber-800 rounded-lg px-4 py-2 text-sm font-medium">
          ⚠ Counterfeit versions have been reported for this product.
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Price history</p>
        {product.priceHistory.length === 0 ? (
          <p className="text-sm text-gray-400">No price history available.</p>
        ) : (
          <ul className="space-y-1">
            {product.priceHistory.map((point) => (
              <li key={point.date} className="flex justify-between text-sm text-gray-600">
                <span>{point.date}</span>
                <span className="font-medium">{formatPrice(point.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
