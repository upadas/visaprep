// src/tests/Wizard.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DropZone from '../wizard/DropZone'
import FileCard from '../wizard/FileCard'
import ChecksList from '../wizard/ChecksList'
import Wizard from '../wizard/Wizard'
import { DOCS } from '../data/docs'

describe('DropZone', () => {
  it('renders browse prompt', () => {
    render(<DropZone fileTypes="PDF · JPG" onUpload={() => {}} />)
    expect(screen.getByText(/Drop your file here/)).toBeInTheDocument()
  })

  it('renders Choose file button', () => {
    render(<DropZone fileTypes="PDF" onUpload={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Choose file/i })).toBeInTheDocument()
  })
})

describe('FileCard', () => {
  const file = { name: 'passport.pdf', sizeBytes: 1470000, type: 'application/pdf', at: 'just now' }

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

// Helper: build default props for Wizard
function makeProps(overrides = {}) {
  const statuses = {}
  DOCS.forEach((d) => { statuses[d.id] = 'todo' })
  return {
    docs: DOCS,
    statuses,
    current: 0,
    setCurrent: vi.fn(),
    setStatus: vi.fn(),
    files: {},
    setFiles: vi.fn(),
    ...overrides,
  }
}

describe('Wizard full component', () => {
  it('renders step 1 title "Valid passport" when current=0', () => {
    render(<Wizard {...makeProps()} />)
    expect(screen.getByRole('heading', { name: /Valid passport/i })).toBeInTheDocument()
  })

  it('shows "Step 1 of 10" indicator', () => {
    render(<Wizard {...makeProps()} />)
    expect(screen.getByText('Step 1 of 10')).toBeInTheDocument()
  })

  it('"Mark done & continue →" calls setStatus with (doc.id, "done") and setCurrent with 1', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<Wizard {...props} />)
    await user.click(screen.getByRole('button', { name: /Mark done & continue/i }))
    expect(props.setStatus).toHaveBeenCalledWith('passport', 'done')
    expect(props.setCurrent).toHaveBeenCalledWith(1)
  })

  it('"Save for later" calls setStatus with (doc.id, "todo") and advances setCurrent', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<Wizard {...props} />)
    await user.click(screen.getByRole('button', { name: /Save for later/i }))
    expect(props.setStatus).toHaveBeenCalledWith('passport', 'todo')
    expect(props.setCurrent).toHaveBeenCalledWith(1)
  })

  it('"← Back" button is disabled when current=0', () => {
    render(<Wizard {...makeProps()} />)
    expect(screen.getByRole('button', { name: /← Back/i })).toBeDisabled()
  })

  it('"← Back" calls setCurrent(0) when current=1', async () => {
    const user = userEvent.setup()
    const props = makeProps({ current: 1 })
    render(<Wizard {...props} />)
    await user.click(screen.getByRole('button', { name: /← Back/i }))
    expect(props.setCurrent).toHaveBeenCalledWith(0)
  })

  it('shows "Finish ✓" button text on last step (current=9)', () => {
    render(<Wizard {...makeProps({ current: 9 })} />)
    expect(screen.getByRole('button', { name: /Finish ✓/i })).toBeInTheDocument()
  })

  it('"Skip — doesn\'t apply" appears for non-required docs (current=5, invitation)', () => {
    // current=5 is "invitation" which has required=false
    render(<Wizard {...makeProps({ current: 5 })} />)
    expect(screen.getByRole('button', { name: /Skip — doesn't apply/i })).toBeInTheDocument()
  })

  it('"Skip — doesn\'t apply" does NOT appear for required docs (current=0, passport)', () => {
    // current=0 is "passport" which has required=true
    render(<Wizard {...makeProps({ current: 0 })} />)
    expect(screen.queryByRole('button', { name: /Skip — doesn't apply/i })).not.toBeInTheDocument()
  })
})
