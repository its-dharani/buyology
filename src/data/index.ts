import rawProducts from './products.json'
import type { Product, ProductDataset } from '../types'

// API endpoint — set via env var so Amplify can override per environment
const API_URL = import.meta.env.VITE_PRODUCTS_API_URL as string | undefined

function buildDataset(products: Product[]): ProductDataset {
  const bySlug: Record<string, Product> = {}
  for (const p of products) {
    bySlug[p.slug] = p
  }
  return { products, bySlug }
}

// Synchronous fallback dataset built from the bundled JSON (always available)
const staticDataset: ProductDataset = buildDataset(rawProducts as Product[])

// The live dataset starts as the static one and is replaced when the API responds.
// All stores read `dataset` through getDataset() so they always get the latest.
let liveDataset: ProductDataset = staticDataset

export function getDataset(): ProductDataset {
  return liveDataset
}

// Keep this export for backward-compat — components that imported `dataset`
// directly will get the static version synchronously. They'll automatically
// pick up the live dataset on the next lookup after hydration completes.
export const dataset: ProductDataset = staticDataset

/**
 * Fetches products from the AWS API and merges them with the static dataset.
 * Static products are always available immediately; API products augment them.
 * Never throws — on failure the app silently falls back to static data.
 */
export async function hydrateFromApi(): Promise<void> {
  if (!API_URL) return // no API configured — dev mode uses static data only

  try {
    const res = await fetch(API_URL)
    if (!res.ok) return
    const apiProducts: Product[] = await res.json()

    // Merge: API products take precedence over static ones (same slug = overwrite)
    const merged = new Map<string, Product>()
    for (const p of staticDataset.products) merged.set(p.id, p)
    for (const p of apiProducts) merged.set(p.id, p)

    liveDataset = buildDataset([...merged.values()])
  } catch {
    // Network error, CORS issue, or malformed response — fall back to static
  }
}
