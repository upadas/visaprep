import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SaveModal, { encodeState, decodeState } from '../components/SaveModal'

describe('encodeState / decodeState', () => {
  const state = {
    statuses: { passport: 'done', form: 'doing' },
    current: 2,
    profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
    country: 'canada',
  }

  it('encodeState returns a non-empty string', () => {
    expect(typeof encodeState(state)).toBe('string')
    expect(encodeState(state).length).toBeGreaterThan(0)
  })

  it('round-trips state through encode → decode', () => {
    const encoded = encodeState(state)
    const decoded = decodeState(encoded)
    expect(decoded).toEqual(state)
  })

  it('decodeState returns null for empty string', () => {
    expect(decodeState('')).toBeNull()
  })

  it('decodeState returns null for invalid base64', () => {
    expect(decodeState('!!!not-base64!!!')).toBeNull()
  })

  it('encodeState produces valid base64 (no spaces, URL-safe chars)', () => {
    const encoded = encodeState(state)
    expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/)
  })
})

describe('SaveModal', () => {
  const defaultProps = {
    statuses: { passport: 'done' },
    current: 1,
    profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
    country: 'canada',
    onClose: vi.fn(),
  }

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:5173/', hash: '' },
      writable: true,
      configurable: true,
    })
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true,
      })
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    }
  })

  afterEach(() => { vi.clearAllMocks() })

  it('renders a heading "Save your progress"', () => {
    render(<SaveModal {...defaultProps} />)
    expect(screen.getByRole('heading', { name: /save your progress/i })).toBeInTheDocument()
  })

  it('renders the encoded URL in a readonly input', () => {
    render(<SaveModal {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('readOnly')
    expect(input.value).toContain('#s=')
  })

  it('renders a "Copy link" button', () => {
    render(<SaveModal {...defaultProps} />)
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
  })

  it('renders an "Email to myself" link', () => {
    render(<SaveModal {...defaultProps} />)
    const link = screen.getByRole('link', { name: /email to myself/i })
    expect(link).toBeInTheDocument()
    expect(link.href).toContain('mailto:')
  })

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SaveModal {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('"Copy link" calls navigator.clipboard.writeText with the URL', async () => {
    const user = userEvent.setup()
    render(<SaveModal {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /copy link/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('#s='))
  })
})
