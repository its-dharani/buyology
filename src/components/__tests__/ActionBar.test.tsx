import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionBar from '../ActionBar'
import type { Product, VerdictResult, WatchlistEntry, PreferenceState } from '../../types'

vi.mock('uuid', () => ({ v4: () => 'test-uuid' }))

// Use vi.hoisted so these mocks are available when vi.mock factories are hoisted
const {
  mockSaveCaseFile,
  mockAddToWatchlist,
  mockRemoveFromWatchlist,
  mockGetState,
} = vi.hoisted(() => ({
  mockSaveCaseFile: vi.fn(),
  mockAddToWatchlist: vi.fn(),
  mockRemoveFromWatchlist: vi.fn(),
  mockGetState: vi.fn(),
}))

const mockProduct: Product = {
  id: 'p1',
  name: 'Test Product',
  slug: 'test-product',
  currentPrice: 99,
  budgetThreshold: 120,
  reviewScore: 4.2,
  stockLevel: 'high',
  priceTrend: 'flat',
  discontinued: false,
  suspectedCounterfeit: false,
  priceHistory: [],
  alternatives: [],
}
const mockVerdict: VerdictResult = { verdict: 'BUY', confidence: 85 }

let mockCurrentProduct: Product | null = mockProduct
let mockVerdictState: VerdictResult | null = mockVerdict

vi.mock('../../stores/lookupStore', () => ({
  default: (
    selector: (s: {
      currentProduct: Product | null
      verdict: VerdictResult | null
    }) => unknown,
  ) => selector({ currentProduct: mockCurrentProduct, verdict: mockVerdictState }),
}))

let mockWatchlist: WatchlistEntry[] = []
const mockPreferences: PreferenceState = {
  price: true,
  reviews: true,
  availability: true,
  brandTrust: true,
  sustainability: true,
}

vi.mock('../../stores/userDataStore', () => ({
  default: Object.assign(
    (
      selector: (s: {
        watchlist: WatchlistEntry[]
        preferences: PreferenceState
        saveCaseFile: typeof mockSaveCaseFile
        addToWatchlist: typeof mockAddToWatchlist
        removeFromWatchlist: typeof mockRemoveFromWatchlist
      }) => unknown,
    ) =>
      selector({
        watchlist: mockWatchlist,
        preferences: mockPreferences,
        saveCaseFile: mockSaveCaseFile,
        addToWatchlist: mockAddToWatchlist,
        removeFromWatchlist: mockRemoveFromWatchlist,
      }),
    { getState: mockGetState },
  ),
}))

describe('ActionBar', () => {
  beforeEach(() => {
    mockCurrentProduct = mockProduct
    mockVerdictState = mockVerdict
    mockWatchlist = []
    mockSaveCaseFile.mockClear()
    mockAddToWatchlist.mockClear()
    mockRemoveFromWatchlist.mockClear()
    mockGetState.mockClear()
  })

  it('renders null when currentProduct is null', () => {
    mockCurrentProduct = null
    const { container } = render(<ActionBar />)
    expect(container.firstChild).toBeNull()
  })

  it('renders Save Case File button when product and verdict are present', () => {
    render(<ActionBar />)
    expect(screen.getByRole('button', { name: /save case file/i })).toBeInTheDocument()
  })

  it('shows success message after save when no storageError', async () => {
    mockGetState.mockReturnValue({ storageError: null })
    const user = userEvent.setup()
    render(<ActionBar />)
    const saveBtn = screen.getByRole('button', { name: /save case file/i })
    await user.click(saveBtn)
    expect(screen.getByText(/saved to case files/i)).toBeInTheDocument()
  })

  it('shows error message after save when storageError is set', async () => {
    mockGetState.mockReturnValue({ storageError: 'Failed to save case file.' })
    const user = userEvent.setup()
    render(<ActionBar />)
    const saveBtn = screen.getByRole('button', { name: /save case file/i })
    await user.click(saveBtn)
    expect(screen.getByText(/failed to save case file/i)).toBeInTheDocument()
  })

  it('save error message has red styling', async () => {
    mockGetState.mockReturnValue({ storageError: 'Failed to save case file.' })
    const user = userEvent.setup()
    render(<ActionBar />)
    const saveBtn = screen.getByRole('button', { name: /save case file/i })
    await user.click(saveBtn)
    const errorMsg = screen.getByText(/failed to save case file/i)
    expect(errorMsg).toHaveClass('text-red-600')
  })
})
