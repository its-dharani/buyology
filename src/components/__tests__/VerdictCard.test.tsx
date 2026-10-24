import { render, screen } from '@testing-library/react'
import VerdictCard from '../VerdictCard'

describe('VerdictCard', () => {
  it('renders "BUY" text for BUY verdict', () => {
    render(<VerdictCard verdict="BUY" confidence={80} />)
    expect(screen.getByText('BUY')).toBeInTheDocument()
  })

  it('renders "WAIT" text for WAIT verdict', () => {
    render(<VerdictCard verdict="WAIT" confidence={50} />)
    expect(screen.getByText('WAIT')).toBeInTheDocument()
  })

  it('renders "SKIP" text for SKIP verdict', () => {
    render(<VerdictCard verdict="SKIP" confidence={20} />)
    expect(screen.getByText('SKIP')).toBeInTheDocument()
  })

  it('renders the confidence percentage', () => {
    render(<VerdictCard verdict="BUY" confidence={75} />)
    expect(screen.getByText(/75%/)).toBeInTheDocument()
  })

  it('has role="status"', () => {
    render(<VerdictCard verdict="BUY" confidence={80} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-live="polite"', () => {
    render(<VerdictCard verdict="BUY" confidence={80} />)
    const statusEl = screen.getByRole('status')
    expect(statusEl).toHaveAttribute('aria-live', 'polite')
  })
})
