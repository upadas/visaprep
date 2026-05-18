// src/tests/Rail.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Rail from '../components/Rail'

const defaultProfile = { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' }

describe('Rail', () => {
  it('renders Personalize heading', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    expect(screen.getByText('Personalize')).toBeInTheDocument()
  })

  it('shows current purpose as pressed', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    const buttons = screen.getAllByRole('button', { name: 'Tourism' })
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    const familyButtons = screen.getAllByRole('button', { name: 'Family' })
    const purposeFamilyButton = familyButtons[0]
    expect(purposeFamilyButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls setProfile when purpose pill clicked', async () => {
    const user = userEvent.setup()
    const setProfile = vi.fn()
    render(<Rail profile={defaultProfile} setProfile={setProfile} />)
    await user.click(screen.getByRole('button', { name: 'Business' }))
    expect(setProfile).toHaveBeenCalledWith({ ...defaultProfile, purpose: 'Business' })
  })

  it('shows Solo/Family/Group for travelling with', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    expect(screen.getByRole('button', { name: 'Solo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Group' })).toBeInTheDocument()
  })
})
