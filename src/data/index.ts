import rawProducts from './products.json'
import type { Product, ProductDataset } from '../types'

const products = rawProducts as Product[]

const bySlug: Record<string, Product> = {}
for (const product of products) {
  bySlug[product.slug] = product
}

export const dataset: ProductDataset = { products, bySlug }
