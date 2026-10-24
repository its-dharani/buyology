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
})
