import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TopBar from '../components/TopBar'

const base = {
  country: 'canada',
  onCountry: vi.fn(),
  onSaveModal: vi.fn(),
  onHelp: vi.fn(),
  page: 'app',
  onPage: vi.fn(),
  theme: 'light',
  onTheme: vi.fn(),
}

describe('TopBar', () => {
  it('renders brand name', () => {
    render(<TopBar {...base} />)
    expect(screen.getByText('VisaPrep')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<TopBar {...base} />)
    expect(screen.getByRole('link', { name: 'Application' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Guides' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Documents' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument()
  })

  it('active nav link matches current page', () => {
    render(<TopBar {...base} page="guides" />)
    expect(screen.getByRole('link', { name: 'Guides' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Application' })).not.toHaveClass('active')
  })

  it('clicking a nav link calls onPage', async () => {
    const user = userEvent.setup()
    const onPage = vi.fn()
    render(<TopBar {...base} onPage={onPage} />)
    await user.click(screen.getByRole('link', { name: 'Guides' }))
    expect(onPage).toHaveBeenCalledWith('guides')
  })

  it('clicking Sign in calls onSaveModal', async () => {
    const user = userEvent.setup()
    const onSaveModal = vi.fn()
    render(<TopBar {...base} onSaveModal={onSaveModal} />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(onSaveModal).toHaveBeenCalled()
  })

  it('clicking the ? button calls onHelp', async () => {
    const user = userEvent.setup()
    const onHelp = vi.fn()
    render(<TopBar {...base} onHelp={onHelp} />)
    await user.click(screen.getByRole('button', { name: /how saving works/i }))
    expect(onHelp).toHaveBeenCalled()
  })

  it('theme button shows correct icon for light theme', () => {
    render(<TopBar {...base} theme="light" />)
    expect(screen.getByRole('button', { name: /switch to dark/i })).toBeInTheDocument()
  })

  it('theme button shows correct icon for dark theme', () => {
    render(<TopBar {...base} theme="dark" />)
    expect(screen.getByRole('button', { name: /switch to system/i })).toBeInTheDocument()
  })

  it('clicking theme button calls onTheme with next value', async () => {
    const user = userEvent.setup()
    const onTheme = vi.fn()
    render(<TopBar {...base} theme="light" onTheme={onTheme} />)
    await user.click(screen.getByRole('button', { name: /switch to dark/i }))
    expect(onTheme).toHaveBeenCalledWith('dark')
  })

  it('renders country selector with 5 options', () => {
    render(<TopBar {...base} />)
    const select = screen.getByRole('combobox', { name: /select country/i })
    expect(select).toBeInTheDocument()
    expect(select.options.length).toBe(5)
  })

  it('changing country select calls onCountry', async () => {
    const user = userEvent.setup()
    const onCountry = vi.fn()
    render(<TopBar {...base} onCountry={onCountry} />)
    await user.selectOptions(screen.getByRole('combobox'), 'usa')
    expect(onCountry).toHaveBeenCalledWith('usa')
  })
})
