// src/tests/Wizard.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DropZone from '../wizard/DropZone'
import FileCard from '../wizard/FileCard'
import ChecksList from '../wizard/ChecksList'

describe('DropZone', () => {
  it('renders browse prompt', () => {
    render(<DropZone fileTypes="PDF · JPG" onUpload={() => {}} />)
    expect(screen.getByText(/Drop your file here/)).toBeInTheDocument()
  })

  it('calls onUpload when Choose file clicked', async () => {
    const user = userEvent.setup()
    const onUpload = vi.fn()
    render(<DropZone fileTypes="PDF" onUpload={onUpload} />)
    await user.click(screen.getByRole('button', { name: /Choose file/ }))
    expect(onUpload).toHaveBeenCalled()
  })
})

describe('FileCard', () => {
  const file = { name: 'passport.pdf', size: '1.4 MB · 8 pages', at: 'just now' }

  it('renders filename', () => {
    render(<FileCard file={file} onRemove={() => {}} />)
    expect(screen.getByText('passport.pdf')).toBeInTheDocument()
  })

  it('calls onRemove when Remove clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<FileCard file={file} onRemove={onRemove} />)
    await user.click(screen.getByRole('button', { name: /Remove/ }))
    expect(onRemove).toHaveBeenCalled()
  })
})

describe('ChecksList', () => {
  const checks = [
    { ok: true,  text: 'Valid check' },
    { ok: false, text: 'Warn check' },
  ]

  it('renders check texts', () => {
    render(<ChecksList checks={checks} hasFile={false} required={true} />)
    expect(screen.getByText('Valid check')).toBeInTheDocument()
    expect(screen.getByText('Warn check')).toBeInTheDocument()
  })

  it('shows required why-this-matters text when required', () => {
    render(<ChecksList checks={checks} hasFile={false} required={true} />)
    expect(screen.getByText(/IRCC checks first/)).toBeInTheDocument()
  })

  it('shows optional text when not required', () => {
    render(<ChecksList checks={checks} hasFile={false} required={false} />)
    expect(screen.getByText(/Optional/)).toBeInTheDocument()
  })
})
