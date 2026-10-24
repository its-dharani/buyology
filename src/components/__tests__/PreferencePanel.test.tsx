import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreferencePanel from '../PreferencePanel'
import type { PreferenceState } from '../../types'

const mockSetPreferences = vi.fn()
const mockPreferences: PreferenceState = {
  price: true,
  reviews: true,
  availability: true,
  brandTrust: true,
  sustainability: true,
}

vi.mock('../../stores/userDataStore', () => ({
  default: (selector: (s: { preferences: PreferenceState; setPreferences: typeof mockSetPreferences }) => unknown) =>
    selector({ preferences: mockPreferences, setPreferences: mockSetPreferences }),
}))

describe('PreferencePanel', () => {
  beforeEach(() => {
    mockSetPreferences.mockClear()
  })

  it('renders all 5 preference pills with correct labels', () => {
    render(<PreferencePanel />)
    expect(screen.getByRole('switch', { name: /price preference/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /reviews preference/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /availability preference/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /brand trust preference/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /sustainability preference/i })).toBeInTheDocument()
  })

  it('pills have correct aria-checked attribute reflecting preference state', () => {
    render(<PreferencePanel />)
    const priceBtn = screen.getByRole('switch', { name: /price preference/i })
    expect(priceBtn).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking a pill calls setPreferences with the toggled state', async () => {
    const user = userEvent.setup()
    render(<PreferencePanel />)
    const priceBtn = screen.getByRole('switch', { name: /price preference/i })
    await user.click(priceBtn)
    expect(mockSetPreferences).toHaveBeenCalledWith({
      ...mockPreferences,
      price: false,
    })
  })

  it('clicking another pill toggles its specific preference', async () => {
    const user = userEvent.setup()
    render(<PreferencePanel />)
    const reviewsBtn = screen.getByRole('switch', { name: /reviews preference/i })
    await user.click(reviewsBtn)
    expect(mockSetPreferences).toHaveBeenCalledWith({
      ...mockPreferences,
      reviews: false,
    })
  })
})
