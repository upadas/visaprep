import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store/useStore'

const store = () => useStore.getState()
const reset = () => useStore.setState(useStore.getInitialState())

describe('useStore', () => {
  beforeEach(() => { reset() })

  it('initial view is wizard', () => { expect(store().view).toBe('wizard') })
  it('initial country is canada', () => { expect(store().country).toBe('canada') })
  it('initial current is 0', () => { expect(store().current).toBe(0) })

  it('setStatus updates statuses', () => {
    store().setStatus('passport', 'done')
    expect(store().statuses.passport).toBe('done')
  })

  it('setStatus does not mutate other statuses', () => {
    store().setStatus('passport', 'done')
    store().setStatus('form', 'doing')
    expect(store().statuses.passport).toBe('done')
    expect(store().statuses.form).toBe('doing')
  })

  it('resetProgress clears statuses and files and current', () => {
    store().setStatus('passport', 'done')
    store().setFiles({ passport: { name: 'test.pdf' } })
    store().resetProgress()
    expect(store().statuses).toEqual({})
    expect(store().files).toEqual({})
    expect(store().current).toBe(0)
  })

  it('setView changes the view', () => {
    store().setView('kanban')
    expect(store().view).toBe('kanban')
  })

  it('setTweak updates tweaks', () => {
    store().setTweak('theme', 'dark')
    expect(store().tweaks.theme).toBe('dark')
  })

  it('setProfile merges profile', () => {
    store().setProfile({ purpose: 'Family' })
    expect(store().profile.purpose).toBe('Family')
    expect(store().profile.passport).toBe('India')
  })

  it('initial page is app', () => { expect(store().page).toBe('app') })
  it('setPage changes page', () => {
    store().setPage('guides')
    expect(store().page).toBe('guides')
  })
  it('resetProgress does not change page', () => {
    store().setPage('guides')
    store().resetProgress()
    expect(store().page).toBe('guides')
  })
})
