import { render, screen } from '@testing-library/react'
import AlternativesGrid from '../AlternativesGrid'
import { dataset } from '../../data'
import type { ProductDataset } from '../../types'

describe('AlternativesGrid', () => {
  it('returns null (renders nothing) for empty alternativeIds', () => {
    const { container } = render(<AlternativesGrid alternativeIds={[]} dataset={dataset} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows at most 3 alternatives when 5 IDs are provided', () => {
    // Use the first 5 product slugs from the dataset
    const fiveIds = dataset.products.slice(0, 5).map((p) => p.id)
    render(<AlternativesGrid alternativeIds={fiveIds} dataset={dataset} />)
    // Each alternative card shows a product name — count the name elements
    const nameEls = screen.getAllByText(/./i).filter((el) => el.tagName === 'P' && el.className.includes('font-semibold'))
    expect(nameEls.length).toBeLessThanOrEqual(3)
  })

  it('renders "N/A" for a product stub with missing name', () => {
    const stubDataset: ProductDataset = {
      products: [],
      bySlug: {},
    }
    render(<AlternativesGrid alternativeIds={['nonexistent-id']} dataset={stubDataset} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('does not throw for valid input with real IDs', () => {
    const ids = dataset.products.slice(0, 3).map((p) => p.id)
    expect(() => render(<AlternativesGrid alternativeIds={ids} dataset={dataset} />)).not.toThrow()
  })

  it('renders N/A for price when currentPrice is null', () => {
    const stubProduct = {
      id: 'stub-1',
      name: 'Stub Product',
      slug: 'stub-1',
      currentPrice: null,
      reviewScore: 4.0,
      stockLevel: 'high',
      priceTrend: 'flat',
    } as unknown as import('../../types').Product
    const stubDataset: ProductDataset = {
      products: [stubProduct],
      bySlug: { 'stub-1': stubProduct },
    }
    render(<AlternativesGrid alternativeIds={['stub-1']} dataset={stubDataset} />)
    // "N/A" is rendered inside a <p> alongside a label, so use a partial text matcher
    expect(screen.getByText(/price:/i).textContent).toMatch(/N\/A/)
  })

  it('renders N/A for reviewScore when reviewScore is null', () => {
    const stubProduct = {
      id: 'stub-2',
      name: 'Stub Product 2',
      slug: 'stub-2',
      currentPrice: 99,
      reviewScore: null,
      stockLevel: 'high',
      priceTrend: 'flat',
    } as unknown as import('../../types').Product
    const stubDataset: ProductDataset = {
      products: [stubProduct],
      bySlug: { 'stub-2': stubProduct },
    }
    render(<AlternativesGrid alternativeIds={['stub-2']} dataset={stubDataset} />)
    expect(screen.getByText(/review:/i).textContent).toMatch(/N\/A/)
  })

  it('renders N/A for stockLevel when stockLevel is null', () => {
    const stubProduct = {
      id: 'stub-3',
      name: 'Stub Product 3',
      slug: 'stub-3',
      currentPrice: 99,
      reviewScore: 4.0,
      stockLevel: null,
      priceTrend: 'flat',
    } as unknown as import('../../types').Product
    const stubDataset: ProductDataset = {
      products: [stubProduct],
      bySlug: { 'stub-3': stubProduct },
    }
    render(<AlternativesGrid alternativeIds={['stub-3']} dataset={stubDataset} />)
    expect(screen.getByText(/stock:/i).textContent).toMatch(/N\/A/)
  })

  it('renders N/A for priceTrend when priceTrend is null', () => {
    const stubProduct = {
      id: 'stub-4',
      name: 'Stub Product 4',
      slug: 'stub-4',
      currentPrice: 99,
      reviewScore: 4.0,
      stockLevel: 'high',
      priceTrend: null,
    } as unknown as import('../../types').Product
    const stubDataset: ProductDataset = {
      products: [stubProduct],
      bySlug: { 'stub-4': stubProduct },
    }
    render(<AlternativesGrid alternativeIds={['stub-4']} dataset={stubDataset} />)
    expect(screen.getByText(/trend:/i).textContent).toMatch(/N\/A/)
  })
})
