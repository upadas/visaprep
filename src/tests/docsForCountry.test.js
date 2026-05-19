import { describe, it, expect } from 'vitest'
import { getDocsForCountry } from '../data/docsForCountry'

describe('getDocsForCountry', () => {
  it('returns an array of 10 docs', () => {
    expect(getDocsForCountry('canada')).toHaveLength(10)
  })

  it('every doc has required shape', () => {
    const docs = getDocsForCountry('canada')
    for (const d of docs) {
      expect(d).toHaveProperty('id')
      expect(d).toHaveProperty('title')
      expect(d).toHaveProperty('summary')
      expect(typeof d.required).toBe('boolean')
      expect(Array.isArray(d.checks)).toBe(true)
      expect(Array.isArray(d.tips)).toBe(true)
    }
  })

  it('canada form is IMM 5257', () => {
    const docs = getDocsForCountry('canada')
    const form = docs.find((d) => d.id === 'form')
    expect(form.title).toContain('IMM 5257')
  })

  it('usa form is DS-160', () => {
    const docs = getDocsForCountry('usa')
    const form = docs.find((d) => d.id === 'form')
    expect(form.title).toContain('DS-160')
  })

  it('uk form mentions VAF', () => {
    const docs = getDocsForCountry('uk')
    const form = docs.find((d) => d.id === 'form')
    expect(form.title).toContain('VAF')
  })

  it('schengen form mentions Schengen Application Form', () => {
    const docs = getDocsForCountry('schengen')
    const form = docs.find((d) => d.id === 'form')
    expect(form.title.toLowerCase()).toContain('schengen')
  })

  it('australia form mentions Form 1419', () => {
    const docs = getDocsForCountry('australia')
    const form = docs.find((d) => d.id === 'form')
    expect(form.title).toContain('1419')
  })

  it('canada funds mentions CAD $100/day', () => {
    const docs = getDocsForCountry('canada')
    const funds = docs.find((d) => d.id === 'funds')
    expect(funds.summary).toContain('CAD $100')
  })

  it('uk funds mentions £50/day', () => {
    const docs = getDocsForCountry('uk')
    const funds = docs.find((d) => d.id === 'funds')
    expect(funds.summary).toContain('£50')
  })

  it('usa funds mentions USD $100/day', () => {
    const docs = getDocsForCountry('usa')
    const funds = docs.find((d) => d.id === 'funds')
    expect(funds.summary).toContain('USD $100')
  })

  it('canada biometrics is required', () => {
    const docs = getDocsForCountry('canada')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(true)
  })

  it('uk biometrics is required', () => {
    const docs = getDocsForCountry('uk')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(true)
  })

  it('usa biometrics is required', () => {
    const docs = getDocsForCountry('usa')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(true)
  })

  it('schengen biometrics is required', () => {
    const docs = getDocsForCountry('schengen')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(true)
  })

  it('australia biometrics is required', () => {
    const docs = getDocsForCountry('australia')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(true)
  })

  it('japan biometrics is NOT required', () => {
    const docs = getDocsForCountry('japan')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(false)
  })

  it('thailand biometrics is NOT required', () => {
    const docs = getDocsForCountry('thailand')
    const bio = docs.find((d) => d.id === 'biometrics')
    expect(bio.required).toBe(false)
  })

  it('returns distinct array instances per call (no shared mutation risk)', () => {
    const a = getDocsForCountry('canada')
    const b = getDocsForCountry('canada')
    expect(a).not.toBe(b)
    expect(a[0]).not.toBe(b[0])
  })

  it('unknown country falls back to canada shape', () => {
    const docs = getDocsForCountry('unknowncountry')
    expect(docs).toHaveLength(10)
    const form = docs.find((d) => d.id === 'form')
    expect(form.title).toContain('IMM 5257')
  })
})
