import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DropZone from '../wizard/DropZone'

describe('DropZone', () => {
  it('renders upload prompt and Choose file button', () => {
    render(<DropZone fileTypes="PDF · JPG · PNG" onUpload={vi.fn()} />)
    expect(screen.getByText(/Drop your file here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument()
  })

  it('shows error for oversized file', async () => {
    const onUpload = vi.fn()
    render(<DropZone fileTypes="PDF · JPG · PNG" onUpload={onUpload} />)
    const input = document.querySelector('input[type="file"]')
    const bigFile = new File(['x'.repeat(11 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' })
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
    fireEvent.change(input, { target: { files: [bigFile] } })
    await waitFor(() => expect(screen.getByText(/too large/i)).toBeInTheDocument())
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('shows error for wrong file type', async () => {
    render(<DropZone fileTypes="PDF" onUpload={vi.fn()} />)
    const input = document.querySelector('input[type="file"]')
    const badFile = new File(['data'], 'doc.exe', { type: 'application/octet-stream' })
    fireEvent.change(input, { target: { files: [badFile] } })
    await waitFor(() => expect(screen.getByText(/invalid file type/i)).toBeInTheDocument())
  })
})
