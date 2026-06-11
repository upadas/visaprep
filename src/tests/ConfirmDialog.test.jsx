import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ConfirmDialog from '../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders title and message', () => {
    render(<ConfirmDialog title="Reset?" message="This will erase everything." onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Reset?')).toBeInTheDocument()
    expect(screen.getByText(/erase everything/i)).toBeInTheDocument()
  })

  it('calls onCancel when Cancel clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ConfirmDialog title="Reset?" message="msg" onConfirm={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onConfirm when confirm button clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ConfirmDialog title="Reset?" message="msg" confirmLabel="Yes, reset" onConfirm={onConfirm} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /yes, reset/i }))
    expect(onConfirm).toHaveBeenCalled()
  })
})
