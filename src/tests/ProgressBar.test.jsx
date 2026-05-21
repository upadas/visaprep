import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProgressBar from '../components/ProgressBar'

const base = {
  done: 0, total: 10, view: 'wizard',
  setView: vi.fn(), onPdf: vi.fn(), onSave: vi.fn(),
}

describe('ProgressBar PDF button', () => {
  it('is disabled when complete=false', () => {
    render(<ProgressBar {...base} complete={false} />)
    expect(screen.getByRole('button', { name: /pdf/i })).toBeDisabled()
  })

  it('is enabled when complete=true', () => {
    render(<ProgressBar {...base} complete={true} />)
    expect(screen.getByRole('button', { name: /pdf/i })).not.toBeDisabled()
  })

  it('has pdf-ready class when complete=true', () => {
    render(<ProgressBar {...base} complete={true} />)
    expect(screen.getByRole('button', { name: /pdf/i }).className).toContain('pdf-ready')
  })

  it('does not have pdf-ready class when complete=false', () => {
    render(<ProgressBar {...base} complete={false} />)
    expect(screen.getByRole('button', { name: /pdf/i }).className).not.toContain('pdf-ready')
  })

  it('shows done and total counts', () => {
    render(<ProgressBar {...base} done={7} total={10} complete={false} />)
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText(/of 10/i)).toBeInTheDocument()
  })
})
