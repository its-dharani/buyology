import type { Product, ProductDataset } from '../types'

/**
 * Resolves up to 3 alternative product IDs from the dataset.
 * For each ID, tries bySlug lookup first, then linear search by id.
 * If not found, pushes a stub object with just the id.
 * Never throws.
 */
export function getAlternativesForDisplay(
  alternativeIds: string[],
  dataset: ProductDataset,
): (Product | Partial<Product>)[] {
  const ids = alternativeIds.slice(0, 3)
  return ids.map((id) => {
    const bySlug = dataset.bySlug[id]
    if (bySlug) return bySlug
    const byId = dataset.products.find((p) => p.id === id)
    if (byId) return byId
    return { id }
  })
}
