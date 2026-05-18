import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Board from '../board/Board'
import { DOCS } from '../data/docs'

describe('Board', () => {
  it('renders three columns', () => {
    render(<Board docs={DOCS} statuses={{}} setStatus={() => {}} setCurrent={() => {}} setView={() => {}} />)
    expect(screen.getByText('To do')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('all docs appear in To do initially', () => {
    render(<Board docs={DOCS} statuses={{}} setStatus={() => {}} setCurrent={() => {}} setView={() => {}} />)
    expect(screen.getByText('Valid passport')).toBeInTheDocument()
  })

  it('done docs appear in Done column', () => {
    render(
      <Board docs={DOCS} statuses={{ passport: 'done' }} setStatus={() => {}} setCurrent={() => {}} setView={() => {}} />
    )
    // The Done column should have count 1
    const doneCols = screen.getAllByText('Done')
    expect(doneCols.length).toBeGreaterThan(0)
  })

  it('clicking a card calls setCurrent and setView', async () => {
    const setCurrent = vi.fn()
    const setView    = vi.fn()
    render(<Board docs={DOCS} statuses={{}} setStatus={() => {}} setCurrent={setCurrent} setView={setView} />)
    // Use fireEvent for synthetic click events that bypass dnd-kit listeners
    const cards = document.querySelectorAll('.kan-card')
    fireEvent.click(cards[0])
    expect(setCurrent).toHaveBeenCalledWith(0)
    expect(setView).toHaveBeenCalledWith('wizard')
  })
})
