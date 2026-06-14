import { describe, it, expect } from 'vitest'
import { buildChecklistPdf } from '../lib/generatePdf'

const SAMPLE = {
  country: 'canada',
  countryMeta: { flag: '🇨🇦', name: 'Canada', visa: 'Tourist Visa (TRV)', fee: 'CAD $100', proc: '29 days avg.' },
  profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
  docs: [
    { id: 'passport', title: 'Valid passport', required: true, summary: '', fileTypes: 'PDF', checks: [], tips: [] },
    { id: 'photos',   title: 'Recent photographs', required: true, summary: '', fileTypes: 'JPG', checks: [], tips: [] },
  ],
  statuses: { passport: 'done', photos: 'todo' },
  files: {
    passport: { name: 'passport.pdf', sizeBytes: 1000, type: 'application/pdf', at: '10:00', dataURL: 'data:application/pdf;base64,AAAA' },
    // a 1x1 transparent PNG so addImage has something valid:
    photos: { name: 'photo.png', sizeBytes: 100, type: 'image/png', at: '10:01', dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
  },
}

describe('buildChecklistPdf', () => {
  it('returns a jsPDF document without throwing', () => {
    const doc = buildChecklistPdf(SAMPLE)
    expect(doc).toBeTruthy()
    expect(typeof doc.output).toBe('function') // jsPDF instances expose .output()
  })

  it('produces a non-empty PDF', () => {
    const doc = buildChecklistPdf(SAMPLE)
    const blob = doc.output('blob')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('handles missing files/statuses gracefully', () => {
    const doc = buildChecklistPdf({ ...SAMPLE, files: {}, statuses: {} })
    expect(doc).toBeTruthy()
  })

  it('handles missing profile fields gracefully', () => {
    const doc = buildChecklistPdf({ ...SAMPLE, profile: {} })
    expect(doc).toBeTruthy()
    expect(typeof doc.output).toBe('function')
  })

  it('handles an empty docs array', () => {
    const doc = buildChecklistPdf({ ...SAMPLE, docs: [] })
    expect(doc).toBeTruthy()
  })
})
