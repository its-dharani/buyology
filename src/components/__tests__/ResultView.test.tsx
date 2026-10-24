import { render, screen } from '@testing-library/react'
import ResultView from '../ResultView'

vi.mock('../VerdictCard', () => ({ default: () => <div data-testid="verdict-card" /> }))
vi.mock('../PreferencePanel', () => ({ default: () => <div data-testid="preference-panel" /> }))
vi.mock('../ProductDetails', () => ({ default: () => <div data-testid="product-details" /> }))
vi.mock('../AlternativesGrid', () => ({ default: () => <div data-testid="alternatives-grid" /> }))
vi.mock('../ActionBar', () => ({ default: () => <div data-testid="action-bar" /> }))

vi.mock('../../data', () => ({ dataset: { products: [], bySlug: {} } }))

let mockIsLoading = false
let mockNotFound = false
let mockCurrentProduct: Record<string, unknown> | null = null
let mockVerdictState: Record<string, unknown> | null = null

vi.mock('../../stores/lookupStore', () => ({
  default: (
    selector: (s: {
      isLoading: boolean
      notFound: boolean
      currentProduct: unknown
      verdict: unknown
    }) => unknown,
  ) =>
    selector({
      isLoading: mockIsLoading,
      notFound: mockNotFound,
      currentProduct: mockCurrentProduct,
      verdict: mockVerdictState,
    }),
}))

describe('ResultView', () => {
  beforeEach(() => {
    mockIsLoading = false
    mockNotFound = false
    mockCurrentProduct = null
    mockVerdictState = null
  })

  it('renders loading spinner when isLoading is true', () => {
    mockIsLoading = true
    render(<ResultView />)
    expect(screen.getByRole('status', { name: /investigating product/i })).toBeInTheDocument()
  })

  it('renders not-found message when notFound is true', () => {
    mockNotFound = true
    render(<ResultView />)
    expect(screen.getByText(/no product found/i)).toBeInTheDocument()
  })

  it('does not render VerdictCard when notFound is true', () => {
    mockNotFound = true
    render(<ResultView />)
    expect(screen.queryByTestId('verdict-card')).not.toBeInTheDocument()
  })

  it('does not render ProductDetails when notFound is true', () => {
    mockNotFound = true
    render(<ResultView />)
    expect(screen.queryByTestId('product-details')).not.toBeInTheDocument()
  })

  it('renders null when currentProduct and verdict are both null', () => {
    const { container } = render(<ResultView />)
    expect(container.firstChild).toBeNull()
  })

  it('renders VerdictCard when product and verdict are present', () => {
    mockCurrentProduct = { id: 'p1', alternatives: [] }
    mockVerdictState = { verdict: 'BUY', confidence: 80 }
    render(<ResultView />)
    expect(screen.getByTestId('verdict-card')).toBeInTheDocument()
  })
})
