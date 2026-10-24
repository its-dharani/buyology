import { render, screen } from '@testing-library/react'
import WatchlistView from '../WatchlistView'
import type { WatchlistEntry } from '../../types'

let mockWatchlist: WatchlistEntry[] = []
let mockStorageError: string | null = null
const mockRemove = vi.fn()

vi.mock('../../stores/userDataStore', () => ({
  default: (
    selector: (s: {
      watchlist: WatchlistEntry[]
      storageError: string | null
      removeFromWatchlist: typeof mockRemove
    }) => unknown,
  ) =>
    selector({
      watchlist: mockWatchlist,
      storageError: mockStorageError,
      removeFromWatchlist: mockRemove,
    }),
}))

describe('WatchlistView', () => {
  beforeEach(() => {
    mockWatchlist = []
    mockStorageError = null
    mockRemove.mockClear()
  })

  it('renders storage-error banner when storageError is set', () => {
    mockStorageError = 'Storage quota exceeded'
    render(<WatchlistView />)
    expect(screen.getByText(/storage error/i)).toBeInTheDocument()
    expect(screen.getByText(/storage quota exceeded/i)).toBeInTheDocument()
  })

  it('does not render error banner when storageError is null', () => {
    mockStorageError = null
    render(<WatchlistView />)
    expect(screen.queryByText(/storage error/i)).not.toBeInTheDocument()
  })

  it('renders empty-list message when watchlist is empty', () => {
    mockWatchlist = []
    render(<WatchlistView />)
    expect(screen.getByText(/your watchlist is empty/i)).toBeInTheDocument()
  })

  it('renders watchlist entries when watchlist has items', () => {
    mockWatchlist = [
      {
        productId: 'p1',
        productName: 'Sony WH-1000XM5',
        lastVerdict: 'BUY',
        addedAt: '2024-01-15T10:30:00.000Z',
      },
    ]
    render(<WatchlistView />)
    expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument()
  })
})
