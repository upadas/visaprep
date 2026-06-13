import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import HelpModal from '../components/HelpModal'

describe('HelpModal', () => {
  it('renders the save explanation', () => {
    render(<HelpModal onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: /how visaprep works/i })).toBeInTheDocument()
    expect(screen.getByText(/no account needed/i)).toBeInTheDocument()
    expect(screen.getByText(/restore anywhere/i)).toBeInTheDocument()
  })

  it('calls onClose when Got it is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<HelpModal onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /got it/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the ✕ button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<HelpModal onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
