import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../SearchBar'

// Mock the Zustand store hooks
const mockLookup = vi.fn()
const mockSetView = vi.fn()

vi.mock('../../stores/lookupStore', () => ({
  default: (selector: (s: { lookup: typeof mockLookup }) => unknown) =>
    selector({ lookup: mockLookup }),
}))

vi.mock('../../stores/uiStore', () => ({
  default: (selector: (s: { setView: typeof mockSetView }) => unknown) =>
    selector({ setView: mockSetView }),
}))

describe('SearchBar', () => {
  beforeEach(() => {
    mockLookup.mockClear()
    mockSetView.mockClear()
  })

  it('renders input with aria-label', () => {
    render(<SearchBar />)
    expect(screen.getByRole('textbox', { name: /search for a product by url or name/i })).toBeInTheDocument()
  })

  it('Enter submits and calls lookup + setView', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search for a product by url or name/i })
    await user.type(input, 'Sony WH-1000XM5{Enter}')
    expect(mockLookup).toHaveBeenCalledWith('Sony WH-1000XM5')
    expect(mockSetView).toHaveBeenCalledWith('result')
  })

  it('blank input shows validation message without calling lookup', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    const submitBtn = screen.getByRole('button', { name: /investigate/i })
    await user.click(submitBtn)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(mockLookup).not.toHaveBeenCalled()
  })

  it('>200 char name shows validation message without calling lookup', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search for a product by url or name/i })
    const longInput = 'a'.repeat(201)
    await user.type(input, longInput)
    const submitBtn = screen.getByRole('button', { name: /investigate/i })
    await user.click(submitBtn)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(mockLookup).not.toHaveBeenCalled()
  })

  it('submit button click triggers lookup', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search for a product by url or name/i })
    await user.type(input, 'Test Product')
    const submitBtn = screen.getByRole('button', { name: /investigate/i })
    await user.click(submitBtn)
    expect(mockLookup).toHaveBeenCalledWith('Test Product')
  })
})
