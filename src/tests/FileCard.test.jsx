import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import FileCard from '../wizard/FileCard'

const imageFile = {
  name: 'photo.png',
  sizeBytes: 2048,
  type: 'image/png',
  at: '10:01',
  dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
}

const pdfFile = {
  name: 'passport.pdf',
  sizeBytes: 1048576,
  type: 'application/pdf',
  at: '10:00',
  dataURL: 'data:application/pdf;base64,AAAA',
}

describe('FileCard', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows the filename and size', () => {
    render(<FileCard file={imageFile} onRemove={vi.fn()} />)
    expect(screen.getByText('photo.png')).toBeInTheDocument()
    expect(screen.getByText(/2 KB/)).toBeInTheDocument()
  })

  it('shows an enlarged preview on hover for image files', () => {
    render(<FileCard file={imageFile} onRemove={vi.fn()} />)
    const thumb = screen.getByAltText('photo.png')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.mouseEnter(thumb.parentElement)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByAltText('photo.png preview')).toBeInTheDocument()
    fireEvent.mouseLeave(thumb.parentElement)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('opens a PDF in a new tab when its icon is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<FileCard file={pdfFile} onRemove={vi.fn()} />)
    fireEvent.click(screen.getByTitle('Open PDF in new tab'))
    expect(openSpy).toHaveBeenCalledWith(pdfFile.dataURL, '_blank', 'noopener,noreferrer')
  })

  it('calls onRemove when Remove is clicked', () => {
    const onRemove = vi.fn()
    render(<FileCard file={imageFile} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalled()
  })
})
