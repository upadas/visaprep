import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import GuidesPage from '../pages/GuidesPage'
import DocumentsPage from '../pages/DocumentsPage'
import HelpPage from '../pages/HelpPage'

describe('GuidesPage', () => {
  it('renders a heading', () => {
    render(<GuidesPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders at least one guide card with a button', () => {
    render(<GuidesPage />)
    // GuidesPage renders "Read guide →" buttons (not anchor links)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders multiple guide card headings', () => {
    render(<GuidesPage />)
    // h1 + one h2 per guide card (3 guides)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.length).toBeGreaterThanOrEqual(3)
  })
})

describe('DocumentsPage', () => {
  it('renders a heading', () => {
    render(<DocumentsPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders document type cards (8 cards)', () => {
    render(<DocumentsPage />)
    // 1 h1 + 8 h2s (one per doc type card)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.length).toBe(8)
  })

  it('renders known document type names', () => {
    render(<DocumentsPage />)
    expect(screen.getByText('Passport')).toBeInTheDocument()
    expect(screen.getByText('Bank statements')).toBeInTheDocument()
    expect(screen.getByText('Biometrics')).toBeInTheDocument()
  })
})

describe('HelpPage', () => {
  it('renders FAQ heading', () => {
    render(<HelpPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders multiple FAQ buttons (one per FAQ item)', () => {
    render(<HelpPage />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('clicking a FAQ button expands its answer', async () => {
    const user = userEvent.setup()
    render(<HelpPage />)
    const firstButton = screen.getAllByRole('button')[0]
    // Initially collapsed
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(firstButton)
    // After click — expanded
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('answer text is visible after expanding a FAQ item', async () => {
    const user = userEvent.setup()
    render(<HelpPage />)
    const firstButton = screen.getAllByRole('button')[0]
    // Answer should not be in the document before click
    expect(screen.queryByText(/localStorage/)).not.toBeInTheDocument()
    await user.click(firstButton)
    // First FAQ answer mentions localStorage
    expect(screen.getByText(/localStorage/)).toBeInTheDocument()
  })
})
