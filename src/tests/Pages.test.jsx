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
  it('renders a heading with country name', () => {
    render(<DocumentsPage />)
    // store defaults to 'canada'
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Canada')
  })

  it('renders real doc titles from getDocsForCountry', () => {
    render(<DocumentsPage />)
    expect(screen.getByText('Valid passport')).toBeInTheDocument()
    expect(screen.getByText('Proof of funds')).toBeInTheDocument()
  })

  it('does not show stale "40" text', () => {
    render(<DocumentsPage />)
    expect(screen.queryByText(/40/)).not.toBeInTheDocument()
  })

  it('renders Required and Optional badges', () => {
    render(<DocumentsPage />)
    const requiredBadges = screen.getAllByText('Required')
    expect(requiredBadges.length).toBeGreaterThan(0)
    const optionalBadges = screen.getAllByText('Optional')
    expect(optionalBadges.length).toBeGreaterThan(0)
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
