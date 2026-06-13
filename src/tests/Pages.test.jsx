import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import GuidesPage from '../pages/GuidesPage'
import DocumentsPage from '../pages/DocumentsPage'
import HelpPage from '../pages/HelpPage'

describe('GuidesPage', () => {
  it('renders a heading for the default country (canada)', () => {
    render(<GuidesPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders canada-scoped guide titles', () => {
    render(<GuidesPage />)
    expect(screen.getByText('How to complete IMM 5257')).toBeInTheDocument()
    expect(screen.getByText('Proof of funds explained')).toBeInTheDocument()
    expect(screen.getByText('Biometrics guide')).toBeInTheDocument()
  })

  it('renders at least one Read guide button', () => {
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders multiple guide card headings (h2)', () => {
    render(<GuidesPage />)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.length).toBeGreaterThanOrEqual(3)
  })

  it('clicking "Read guide →" opens the modal with the first section heading', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // First section heading of first canada guide (form)
    expect(screen.getByText('What this form is')).toBeInTheDocument()
  })

  it('clicking Next → advances to the next section', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    // First section visible
    expect(screen.getByText('What this form is')).toBeInTheDocument()
    // Click Next
    await user.click(screen.getByRole('button', { name: /next/i }))
    // Second section of canada form guide
    expect(screen.getByText('Use Adobe Acrobat Reader — not a browser')).toBeInTheDocument()
  })

  it('shows section counter', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    expect(screen.getByText(/1 \//)).toBeInTheDocument()
  })

  it('navigating to the last section shows the official source link', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    // Navigate through all sections until Done appears
    let nextBtn = screen.queryByRole('button', { name: /next/i })
    while (nextBtn) {
      await user.click(nextBtn)
      nextBtn = screen.queryByRole('button', { name: /next/i })
    }
    expect(screen.getByText('Official source')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /visit official site/i })).toHaveAttribute(
      'href',
      'https://www.canada.ca/en/immigration-refugees-citizenship.html'
    )
  })

  it('clicking ✕ closes the modal', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clicking Done on the last section closes the modal', async () => {
    const user = userEvent.setup()
    render(<GuidesPage />)
    const buttons = screen.getAllByRole('button', { name: /read guide/i })
    await user.click(buttons[0])
    let nextBtn = screen.queryByRole('button', { name: /next/i })
    while (nextBtn) {
      await user.click(nextBtn)
      nextBtn = screen.queryByRole('button', { name: /next/i })
    }
    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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
