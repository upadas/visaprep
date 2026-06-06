import { describe, it, expect } from 'vitest'
import { DOCS } from '../data/docs'
import { COUNTRIES } from '../data/countries'

describe('DOCS', () => {
  it('has 10 documents', () => { expect(DOCS).toHaveLength(10) })
  it('every doc has required shape', () => {
    for (const d of DOCS) {
      expect(d).toHaveProperty('id')
      expect(d).toHaveProperty('title')
      expect(d).toHaveProperty('summary')
      expect(typeof d.required).toBe('boolean')
      expect(Array.isArray(d.checks)).toBe(true)
      expect(Array.isArray(d.tips)).toBe(true)
    }
  })
  it('has passport as first doc', () => { expect(DOCS[0].id).toBe('passport') })
  it('has cover as last doc',    () => { expect(DOCS[9].id).toBe('cover') })
})

describe('COUNTRIES', () => {
  it('has canada, usa, schengen', () => {
    expect(COUNTRIES).toHaveProperty('canada')
    expect(COUNTRIES).toHaveProperty('usa')
    expect(COUNTRIES).toHaveProperty('schengen')
  })
  it('canada has expected fee', () => { expect(COUNTRIES.canada.fee).toBe('CAD $100') })
  it('has 5 entries', () => { expect(Object.keys(COUNTRIES).length).toBe(5) })
  it('every entry has required shape', () => {
    for (const [key, c] of Object.entries(COUNTRIES)) {
      expect(c, `${key} missing flag`).toHaveProperty('flag')
      expect(c, `${key} missing name`).toHaveProperty('name')
      expect(c, `${key} missing visa`).toHaveProperty('visa')
      expect(c, `${key} missing fee`).toHaveProperty('fee')
      expect(c, `${key} missing proc`).toHaveProperty('proc')
      expect(c, `${key} missing currency`).toHaveProperty('currency')
      expect(typeof c.eVisa, `${key}.eVisa must be boolean`).toBe('boolean')
    }
  })
})
