# VisaPrep Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend VisaPrep with ~40 curated countries, country-specific document checklists, serverless URL-based save/restore, and stub navigation pages (Guides, Documents, Help).

**Architecture:** Three independent subsystems added to the existing Vite 6 + React 19 + Zustand 5 app — (1) pure data expansion in `src/data/`, (2) a URL-hash encode/decode save mechanism with a modal component, (3) a `page` state slice in Zustand wired to stub page components. No backend, no router library — hash-based state and inline conditional rendering only. All styles use existing CSS custom properties in `src/styles/tokens.css`.

**Tech Stack:** Vite 6, React 19, Zustand 5, @dnd-kit/core 6, Vitest 3, @testing-library/react 16, @testing-library/user-event 14

---

## File Map

```
src/
  data/
    countries.js              MODIFY — expand from 3 to 40 entries, add currency + eVisa fields
    docsForCountry.js         CREATE — getDocsForCountry(countryKey) returns 10-doc array
  components/
    SaveModal.jsx             CREATE — modal with URL display, copy link, mailto
    TopBar.jsx                MODIFY — wire "Sign in" to open SaveModal; nav links call setPage
  pages/
    GuidesPage.jsx            CREATE — stub with 3 guide cards
    DocumentsPage.jsx         CREATE — stub with document type grid
    HelpPage.jsx              CREATE — stub with 5 FAQ accordion items
  store/
    useStore.js               MODIFY — add page, setPage, saveModal; add restoreFromHash action
  App.jsx                     MODIFY — add SaveModal render, hash-restore useEffect, page routing
  tests/
    docsForCountry.test.js    CREATE — tests for getDocsForCountry
    SaveModal.test.jsx        CREATE — tests for SaveModal render + URL encode/decode logic
```

---

## Task 1: Expand `src/data/countries.js` to ~40 countries

**Files:**
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/data/countries.js`
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/tests/docs.test.js`

This task is pure data. No tests needed for the data shape beyond what already exists — but the existing `docs.test.js` asserts `COUNTRIES` has canada/usa/schengen; we keep those passing and add an assertion that the map has 40 keys. We also add `currency` and `eVisa` fields which the existing 3 entries lack — update those too.

- [ ] **Step 1: Update the COUNTRIES assertion in `src/tests/docs.test.js`**

Open `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/tests/docs.test.js` and replace the `describe('COUNTRIES', ...)` block with:

```js
describe('COUNTRIES', () => {
  it('has canada, usa, schengen', () => {
    expect(COUNTRIES).toHaveProperty('canada')
    expect(COUNTRIES).toHaveProperty('usa')
    expect(COUNTRIES).toHaveProperty('schengen')
  })
  it('canada has expected fee', () => { expect(COUNTRIES.canada.fee).toBe('CAD $100') })
  it('has ~40 entries', () => { expect(Object.keys(COUNTRIES).length).toBeGreaterThanOrEqual(40) })
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
```

- [ ] **Step 2: Run the new test to confirm it fails**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/docs.test.js
```

Expected: FAIL — "has ~40 entries" fails (only 3 now), "every entry has required shape" fails (missing currency/eVisa).

- [ ] **Step 3: Replace `src/data/countries.js` with the full 40-country map**

```js
export const COUNTRIES = {
  canada:      { flag: '🇨🇦', name: 'Canada',           visa: 'Tourist Visa (TRV)',          fee: 'CAD $100',   proc: '29 days avg.',  currency: 'CAD', eVisa: true  },
  usa:         { flag: '🇺🇸', name: 'United States',    visa: 'B1/B2 Visitor',               fee: 'USD $185',   proc: '8–12 weeks',    currency: 'USD', eVisa: false },
  schengen:    { flag: '🇪🇺', name: 'Schengen',         visa: 'Type C Short-Stay',           fee: 'EUR €90',    proc: '15 days avg.',  currency: 'EUR', eVisa: false },
  uk:          { flag: '🇬🇧', name: 'United Kingdom',   visa: 'Standard Visitor Visa',       fee: 'GBP £115',   proc: '3 weeks avg.',  currency: 'GBP', eVisa: true  },
  australia:   { flag: '🇦🇺', name: 'Australia',        visa: 'Tourist Visa (subclass 600)', fee: 'AUD $190',   proc: '25 days avg.',  currency: 'AUD', eVisa: true  },
  japan:       { flag: '🇯🇵', name: 'Japan',            visa: 'Temporary Visitor Visa',      fee: 'JPY ¥3,000', proc: '5 days avg.',   currency: 'JPY', eVisa: false },
  southkorea:  { flag: '🇰🇷', name: 'South Korea',      visa: 'C-3 Tourist Visa',            fee: 'USD $50',    proc: '5 days avg.',   currency: 'KRW', eVisa: false },
  uae:         { flag: '🇦🇪', name: 'UAE',              visa: 'Tourist Visa (30-day)',        fee: 'AED 300',    proc: '3–5 days',      currency: 'AED', eVisa: true  },
  singapore:   { flag: '🇸🇬', name: 'Singapore',        visa: 'Short-Term Visit Pass',       fee: 'SGD $30',    proc: '3 days avg.',   currency: 'SGD', eVisa: true  },
  newzealand:  { flag: '🇳🇿', name: 'New Zealand',      visa: 'Visitor Visa',                fee: 'NZD $211',   proc: '20 days avg.',  currency: 'NZD', eVisa: true  },
  china:       { flag: '🇨🇳', name: 'China',            visa: 'L Tourist Visa',              fee: 'USD $140',   proc: '4 days avg.',   currency: 'CNY', eVisa: false },
  thailand:    { flag: '🇹🇭', name: 'Thailand',         visa: 'TR Tourist Visa',             fee: 'THB 2,000',  proc: '2 days avg.',   currency: 'THB', eVisa: true  },
  malaysia:    { flag: '🇲🇾', name: 'Malaysia',         visa: 'eNTRI / Single Entry',        fee: 'MYR 50',     proc: '1 day avg.',    currency: 'MYR', eVisa: true  },
  indonesia:   { flag: '🇮🇩', name: 'Indonesia',        visa: 'Visa on Arrival / e-VOA',     fee: 'IDR 500,000', proc: '1 day avg.',   currency: 'IDR', eVisa: true  },
  india:       { flag: '🇮🇳', name: 'India',            visa: 'e-Tourist Visa',              fee: 'USD $25',    proc: '3 days avg.',   currency: 'INR', eVisa: true  },
  brazil:      { flag: '🇧🇷', name: 'Brazil',           visa: 'VITEM II Tourist Visa',       fee: 'USD $80',    proc: '10 days avg.',  currency: 'BRL', eVisa: false },
  mexico:      { flag: '🇲🇽', name: 'Mexico',           visa: 'Tourist Card (FMM)',          fee: 'MXN $686',   proc: 'On arrival',    currency: 'MXN', eVisa: false },
  turkey:      { flag: '🇹🇷', name: 'Turkey',           visa: 'e-Visa',                      fee: 'USD $60',    proc: '2 days avg.',   currency: 'TRY', eVisa: true  },
  egypt:       { flag: '🇪🇬', name: 'Egypt',            visa: 'Tourist Visa',                fee: 'USD $25',    proc: 'On arrival',    currency: 'EGP', eVisa: true  },
  morocco:     { flag: '🇲🇦', name: 'Morocco',          visa: 'Entry Stamp',                 fee: 'Free',       proc: 'On arrival',    currency: 'MAD', eVisa: false },
  southafrica: { flag: '🇿🇦', name: 'South Africa',    visa: 'Visitor\'s Visa',             fee: 'ZAR R425',   proc: '10 days avg.',  currency: 'ZAR', eVisa: false },
  vietnam:     { flag: '🇻🇳', name: 'Vietnam',          visa: 'e-Visa',                      fee: 'USD $25',    proc: '3 days avg.',   currency: 'VND', eVisa: true  },
  philippines: { flag: '🇵🇭', name: 'Philippines',     visa: 'Tourist Visa (9a)',            fee: 'USD $30',    proc: '3 days avg.',   currency: 'PHP', eVisa: false },
  srilanka:    { flag: '🇱🇰', name: 'Sri Lanka',        visa: 'ETA Tourist',                 fee: 'USD $20',    proc: '2 days avg.',   currency: 'LKR', eVisa: true  },
  nepal:       { flag: '🇳🇵', name: 'Nepal',            visa: 'Tourist Visa',                fee: 'USD $30',    proc: 'On arrival',    currency: 'NPR', eVisa: true  },
  kenya:       { flag: '🇰🇪', name: 'Kenya',            visa: 'e-Visa',                      fee: 'USD $51',    proc: '3 days avg.',   currency: 'KES', eVisa: true  },
  tanzania:    { flag: '🇹🇿', name: 'Tanzania',         visa: 'Tourist Visa',                fee: 'USD $50',    proc: 'On arrival',    currency: 'TZS', eVisa: true  },
  qatar:       { flag: '🇶🇦', name: 'Qatar',            visa: 'e-Visa',                      fee: 'USD $18',    proc: '4 days avg.',   currency: 'QAR', eVisa: true  },
  saudi:       { flag: '🇸🇦', name: 'Saudi Arabia',    visa: 'e-Visa (Tourist)',             fee: 'SAR 440',    proc: '3 days avg.',   currency: 'SAR', eVisa: true  },
  oman:        { flag: '🇴🇲', name: 'Oman',             visa: 'e-Visa',                      fee: 'OMR 20',     proc: '3 days avg.',   currency: 'OMR', eVisa: true  },
  jordan:      { flag: '🇯🇴', name: 'Jordan',           visa: 'Visitor Visa',                fee: 'JOD 40',     proc: 'On arrival',    currency: 'JOD', eVisa: true  },
  georgia:     { flag: '🇬🇪', name: 'Georgia',          visa: 'Visa-free / e-Visa',          fee: 'USD $20',    proc: '5 days avg.',   currency: 'GEL', eVisa: true  },
  armenia:     { flag: '🇦🇲', name: 'Armenia',          visa: 'e-Visa',                      fee: 'USD $6',     proc: '2 days avg.',   currency: 'AMD', eVisa: true  },
  kazakh:      { flag: '🇰🇿', name: 'Kazakhstan',       visa: 'e-Visa',                      fee: 'USD $0',     proc: '5 days avg.',   currency: 'KZT', eVisa: true  },
  azerbaijan:  { flag: '🇦🇿', name: 'Azerbaijan',       visa: 'ASAN Visa (e-Visa)',          fee: 'USD $20',    proc: '3 days avg.',   currency: 'AZN', eVisa: true  },
  bahrain:     { flag: '🇧🇭', name: 'Bahrain',          visa: 'eVisa',                       fee: 'BHD 5',      proc: '3 days avg.',   currency: 'BHD', eVisa: true  },
  maldives:    { flag: '🇲🇻', name: 'Maldives',         visa: 'Tourist Visa (on arrival)',   fee: 'Free',       proc: 'On arrival',    currency: 'MVR', eVisa: false },
  rwanda:      { flag: '🇷🇼', name: 'Rwanda',           visa: 'e-Visa',                      fee: 'USD $50',    proc: '3 days avg.',   currency: 'RWF', eVisa: true  },
  ethiopia:    { flag: '🇪🇹', name: 'Ethiopia',         visa: 'e-Visa',                      fee: 'USD $82',    proc: '3 days avg.',   currency: 'ETB', eVisa: true  },
  cambodia:    { flag: '🇰🇭', name: 'Cambodia',         visa: 'e-Visa',                      fee: 'USD $36',    proc: '3 days avg.',   currency: 'KHR', eVisa: true  },
}
```

- [ ] **Step 4: Run tests — all should pass**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/docs.test.js
```

Expected: PASS — all 6 tests green.

- [ ] **Step 5: Run full suite to confirm no regressions**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: 30+ tests passing, 0 failing.

- [ ] **Step 6: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/data/countries.js src/tests/docs.test.js && git commit -m "feat: expand COUNTRIES to 40 entries with currency + eVisa fields"
```

---

## Task 2: Create `src/data/docsForCountry.js` + tests

**Files:**
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/data/docsForCountry.js`
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/tests/docsForCountry.test.js`

`getDocsForCountry(countryKey)` returns a fresh 10-element array. Each element matches the DOCS shape (`id`, `title`, `summary`, `required`, `fileTypes`, `checks`, `tips`). Country-specific fields: `form.title` and `form.summary` (different form name per country), `funds.summary` (different daily amount), `biometrics.required` (only Canada, UK, USA, Schengen, Australia require it). All other docs are identical to the Canada base.

- [ ] **Step 1: Write the failing tests in `src/tests/docsForCountry.test.js`**

```js
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
```

- [ ] **Step 2: Run to verify tests fail**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/docsForCountry.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/data/docsForCountry.js`**

```js
// Base 10-doc checklist derived from Canada. Override per-country fields with the
// OVERRIDES map. getDocsForCountry() always returns a fresh deep clone.

const BASE_DOCS = [
  {
    id: 'passport',
    title: 'Valid passport',
    summary: '6+ months validity, with at least 2 blank pages.',
    required: true,
    fileTypes: 'PDF · JPG · PNG',
    checks: [
      { ok: true,  text: '6+ months validity beyond return' },
      { ok: true,  text: 'At least 2 blank pages' },
      { ok: true,  text: 'Photo page legible, not cropped' },
      { ok: false, text: "Signature page included (we'll prompt if missing)" },
    ],
    tips: [
      'Scan in colour at 300 DPI minimum.',
      "Don't cover the machine-readable strip.",
      'If renewed recently, include the old passport too.',
    ],
  },
  {
    id: 'form',
    title: 'Application form (IMM 5257)',
    summary: 'The standard temporary resident visa form, filled and signed.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Form opens in Adobe Reader' },
      { ok: true,  text: 'All required fields complete' },
      { ok: true,  text: 'Validated barcode visible on last page' },
      { ok: false, text: 'Signature in section 11 (manually verify)' },
    ],
    tips: ["Use Adobe Reader, not browser preview, or barcodes won't generate."],
  },
  {
    id: 'photos',
    title: 'Recent photographs',
    summary: 'Two photos, 35×45mm, white background, taken in the last 6 months.',
    required: true,
    fileTypes: 'JPG · PNG',
    checks: [
      { ok: true,  text: 'White / off-white background' },
      { ok: true,  text: 'Neutral expression, mouth closed' },
      { ok: false, text: 'No glasses or headwear (unless religious)' },
      { ok: true,  text: 'Taken within 6 months' },
    ],
    tips: ['Studio prints on matte paper hold up better in heat & humidity.'],
  },
  {
    id: 'funds',
    title: 'Proof of funds',
    summary: 'Bank statements covering the last 4 months, ~CAD $100/day of stay.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Covers last 4 months continuously' },
      { ok: true,  text: 'Bank stamp / signature visible' },
      { ok: false, text: 'Closing balance ≥ trip cost' },
      { ok: true,  text: 'Name matches passport exactly' },
      { ok: false, text: 'All pages present, none missing' },
    ],
    tips: [
      "Net banking PDFs work — make sure they're not screenshot images.",
      'Add a sponsor letter if balance is borderline.',
    ],
  },
  {
    id: 'itinerary',
    title: 'Travel itinerary',
    summary: 'Tentative bookings — flights and hotels. No need to pay yet.',
    required: true,
    fileTypes: 'PDF · JPG',
    checks: [
      { ok: true, text: 'Round-trip dates within stated travel period' },
      { ok: true, text: 'Hotel reservations cover full stay' },
      { ok: true, text: 'Names match all applicants on this file' },
    ],
    tips: ['Use refundable bookings or hold-only fares — the visa office accepts reservations.'],
  },
  {
    id: 'invitation',
    title: 'Letter of invitation',
    summary: 'If staying with family or friends — notarized.',
    required: false,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: "Host's status declared" },
      { ok: true,  text: 'Relationship described' },
      { ok: false, text: 'Notarization stamp visible' },
    ],
    tips: ["Skip if you're staying in hotels."],
  },
  {
    id: 'employment',
    title: 'Employment letter',
    summary: 'Job title, salary, leave approval, and return commitment.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'On company letterhead' },
      { ok: true,  text: 'States approved leave dates' },
      { ok: true,  text: 'Confirms position held on return' },
      { ok: false, text: 'Signed by HR or manager' },
    ],
    tips: ['Self-employed? Substitute with business registration + tax returns.'],
  },
  {
    id: 'history',
    title: 'Travel history',
    summary: 'Old passports and prior visa pages.',
    required: false,
    fileTypes: 'PDF · JPG · PNG',
    checks: [
      { ok: true, text: 'Last 10 years covered' },
      { ok: true, text: 'Pages with stamps & visas included' },
    ],
    tips: ['Strong history of compliant travel improves approval odds significantly.'],
  },
  {
    id: 'biometrics',
    title: 'Biometrics receipt',
    summary: 'Fee paid and fingerprints taken at an authorised centre.',
    required: false,   // overridden to true for biometric countries
    fileTypes: 'PDF',
    checks: [
      { ok: true, text: 'Receipt dated within 30 days' },
      { ok: true, text: 'Instruction letter attached' },
    ],
    tips: ['Book biometrics same day as fee payment to avoid expiry.'],
  },
  {
    id: 'cover',
    title: 'Cover letter',
    summary: 'Purpose of visit, ties to home country, and return plan.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Purpose clearly stated in first paragraph' },
      { ok: true,  text: 'Strong ties listed (job, family, property)' },
      { ok: false, text: 'Return commitment in closing paragraph' },
    ],
    tips: ['Keep it to one page. Visa officers spend < 2 minutes per file.'],
  },
]

// Countries that require biometrics
const BIOMETRIC_COUNTRIES = new Set(['canada', 'uk', 'usa', 'schengen', 'australia'])

// Per-country overrides for form and funds fields
const OVERRIDES = {
  canada: {
    form:  { title: 'Application form (IMM 5257)',        summary: 'The standard temporary resident visa form, filled and signed.' },
    funds: { summary: 'Bank statements covering the last 4 months, ~CAD $100/day of stay.' },
    biometrics: { summary: 'CAD $85 fee, taken at a VAC within 30 days of application.', tips: ['Book biometrics same day as fee payment to avoid expiry.'] },
  },
  usa: {
    form:  { title: 'Application form (DS-160)',          summary: 'The Online Nonimmigrant Visa Application DS-160, submitted via CEAC portal.' },
    funds: { summary: 'Bank statements for last 3 months showing ~USD $100/day of planned stay.' },
    biometrics: { summary: 'USD $85 MRV fee paid; fingerprints at US Embassy/Consulate on interview day.', tips: ['Schedule your visa interview early — slots fill weeks in advance.'] },
  },
  uk: {
    form:  { title: 'Online application (VAF — UK Visas)',  summary: 'Complete the Standard Visitor VAF form online via UKVI and pay before booking biometrics.' },
    funds: { summary: 'Bank statements showing at least £50/day for the duration of your visit.' },
    biometrics: { summary: 'GBP £19.20 fee, fingerprints at a UKVCAS service point.', tips: ['Book biometrics appointment immediately after submitting the online form.'] },
  },
  schengen: {
    form:  { title: 'Schengen Application Form (Annex I)', summary: 'Uniform Schengen Visa Application Form, signed and dated, submitted to the embassy of the main destination.' },
    funds: { summary: 'Bank statements showing €100/day (minimum €500 for the whole trip).' },
    biometrics: { summary: 'EUR €0 (included in visa fee); fingerprints at the consulate or authorised VAC.', tips: ['Biometrics may be waived if collected within the last 59 months — check with the consulate.'] },
  },
  australia: {
    form:  { title: 'Online application (Form 1419 — subclass 600)', summary: 'Tourist Visa subclass 600 application lodged online via ImmiAccount.' },
    funds: { summary: 'Bank statements showing AUD $5,000+ or AUD $1,000/month for the duration.' },
    biometrics: { summary: 'AUD $0 (no separate fee); health exam and biometrics collected at a panel clinic if requested.', tips: ['You may be asked for biometrics after lodging — respond to the request within the given timeframe.'] },
  },
  japan: {
    form:  { title: 'Visa Application Form (Ministry of Foreign Affairs)',  summary: 'Japan tourist visa application form, signed, with recent photo affixed.' },
    funds: { summary: 'Bank statements for last 3 months — typically JPY ¥10,000/day (approx. USD $70/day).' },
  },
  southkorea: {
    form:  { title: 'Visa Application Form (Form No. 17)',  summary: 'Korean visa application form submitted at the Korean Embassy or Consulate.' },
    funds: { summary: 'Bank statements for last 3–6 months with a minimum balance of USD $3,000 or equivalent.' },
  },
  uae: {
    form:  { title: 'Online Visa Application (ICA Portal)', summary: 'UAE tourist visa applied through the ICA (Federal Authority for Identity) online portal.' },
    funds: { summary: 'Bank statements showing AED 4,000+ or USD $1,000+ for the trip duration.' },
  },
  singapore: {
    form:  { title: 'SAVE Application (ICA e-Service)',     summary: 'Short-Term Visit Pass application submitted online via the Singapore ICA SAVE portal.' },
    funds: { summary: 'Bank statements showing SGD $1,000+ or USD $750+ for the stay.' },
  },
  newzealand: {
    form:  { title: 'Visitor Visa Application (INZ 1017)',  summary: 'New Zealand Visitor Visa application form lodged online via Immigration New Zealand.' },
    funds: { summary: 'Evidence of NZD $1,000/month of stay or NZD $400 if accommodation is prepaid.' },
  },
  china: {
    form:  { title: 'Visa Application Form (Form V.2013)',   summary: 'China L-category tourist visa application, completed online and printed for submission at the consulate.' },
    funds: { summary: 'Bank statements for last 3 months showing CNY ¥500/day (approx. USD $70/day).' },
  },
  thailand: {
    form:  { title: 'Thailand e-Visa Application (TR)',     summary: 'Thailand TR tourist visa applied online via the Thailand e-Visa portal.' },
    funds: { summary: 'Bank statements showing THB 20,000+ per person for the trip.' },
  },
  malaysia: {
    form:  { title: 'eNTRI / Visa Application (eVISA Malaysia)', summary: 'Malaysia eNTRI note or single-entry visa applied online via the eVISA Malaysia portal.' },
    funds: { summary: 'Bank statements showing MYR 1,000+ or USD $250+ for the stay.' },
  },
  indonesia: {
    form:  { title: 'e-VOA Application (Molina Portal)',    summary: 'Indonesia e-Visa on Arrival (e-VOA) applied online before travel via the Molina portal.' },
    funds: { summary: 'Bank statements showing IDR 5,000,000+ or USD $350+ for the trip.' },
  },
  india: {
    form:  { title: 'India e-Tourist Visa Application (indianvisaonline.gov.in)', summary: 'e-Tourist Visa applied online; two entries allowed in 30/90/365-day options.' },
    funds: { summary: 'Bank statements showing USD $25/day or USD $500 for the trip (whichever is higher).' },
  },
  brazil: {
    form:  { title: 'Brazil Tourist Visa Application (VITEM II)', summary: 'Brazilian VITEM II tourist visa submitted at the Brazilian Consulate.' },
    funds: { summary: 'Bank statements for last 3 months showing BRL 1,500+ or USD $300+ for the trip.' },
  },
  mexico: {
    form:  { title: 'Forma Migratoria Múltiple (FMM)',      summary: 'Mexico FMM tourist card — can be filled online or on arrival at the port of entry.' },
    funds: { summary: 'Bank statements showing USD $200 per person for the trip or credit card proof of funds.' },
  },
  turkey: {
    form:  { title: 'Turkey e-Visa Application (evisa.gov.tr)', summary: 'Turkish e-Visa applied online at the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the stay.' },
  },
  egypt: {
    form:  { title: 'Egypt e-Visa Application (visa2egypt.gov.eg)', summary: 'Egypt tourist visa applied online via the official Egyptian e-Visa portal.' },
    funds: { summary: 'Bank statements showing USD $30/day or USD $300 minimum for the trip.' },
  },
  morocco: {
    form:  { title: 'Entry Declaration Form',               summary: 'Morocco entry stamp on arrival — no advance visa required. Complete the entry form at the border.' },
    funds: { summary: 'Bank statements or cash equivalent of MAD 1,000+ (approx. USD $100) per week.' },
  },
  southafrica: {
    form:  { title: 'South Africa Visitor\'s Visa Application (BI-84)', summary: 'South Africa visitor\'s visa using form BI-84 submitted at the nearest South African embassy.' },
    funds: { summary: 'Bank statements for last 3 months showing ZAR 10,000+ or USD $550+ for the stay.' },
  },
  vietnam: {
    form:  { title: 'Vietnam e-Visa Application (evisa.xuatnhapcanh.gov.vn)', summary: 'Vietnam e-Visa applied online via the official government portal — single or multiple entry.' },
    funds: { summary: 'Bank statements showing USD $25/day or USD $300 minimum for the trip.' },
  },
  philippines: {
    form:  { title: 'Philippines Visa Application (9a)',    summary: 'Tourist visa (9a) application submitted at the Philippine Embassy or Consulate.' },
    funds: { summary: 'Bank statements showing PHP 10,000+ or USD $180+ for the duration of stay.' },
  },
  srilanka: {
    form:  { title: 'Sri Lanka ETA Application (eta.gov.lk)', summary: 'Sri Lanka Electronic Travel Authorisation (ETA) applied online before travel.' },
    funds: { summary: 'Bank statements showing USD $30/day or USD $250 minimum for the trip.' },
  },
  nepal: {
    form:  { title: 'Nepal Tourist Visa Application (online or on arrival)', summary: 'Nepal tourist visa applied online via the Nepal immigration portal or on arrival at Tribhuvan Airport.' },
    funds: { summary: 'Bank statements or cash of USD $25/day — USD $30/day average recommended.' },
  },
  kenya: {
    form:  { title: 'Kenya e-Visa Application (evisa.go.ke)', summary: 'Kenya e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the trip.' },
  },
  tanzania: {
    form:  { title: 'Tanzania e-Visa Application (eservices.immigration.go.tz)', summary: 'Tanzania tourist e-Visa applied online — also available on arrival at Kilimanjaro and Julius Nyerere airports.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the trip.' },
  },
  qatar: {
    form:  { title: 'Qatar e-Visa Application (Hayya platform)', summary: 'Qatar tourist e-Visa applied online via the Hayya platform or on arrival for eligible nationalities.' },
    funds: { summary: 'Bank statements showing USD $30/day or QAR 500+ for the duration.' },
  },
  saudi: {
    form:  { title: 'Saudi Arabia e-Visa Application (visa.visitsaudi.com)', summary: 'Saudi Arabia tourist e-Visa applied online at the official Visit Saudi portal.' },
    funds: { summary: 'Bank statements showing SAR 200/day or USD $55/day for the trip.' },
  },
  oman: {
    form:  { title: 'Oman e-Visa Application (evisa.rop.gov.om)', summary: 'Oman e-Visa applied online via the Royal Oman Police portal.' },
    funds: { summary: 'Bank statements showing OMR 25/day or USD $65/day for the stay.' },
  },
  jordan: {
    form:  { title: 'Jordan Visa Application (jordan.gov.jo)', summary: 'Jordan visitor visa applied online or on arrival at most ports of entry.' },
    funds: { summary: 'Bank statements showing JOD 40+ for the trip or credit card with USD $200 limit.' },
  },
  georgia: {
    form:  { title: 'Georgia e-Visa Application (evisa.gov.ge)', summary: 'Georgia e-Visa applied online — many nationalities are visa-free for up to 365 days.' },
    funds: { summary: 'Bank statements showing GEL 50/day or USD $20/day for the stay.' },
  },
  armenia: {
    form:  { title: 'Armenia e-Visa Application (evisa.mfa.am)', summary: 'Armenia e-Visa applied online via the Ministry of Foreign Affairs portal.' },
    funds: { summary: 'Bank statements showing AMD 10,000/day or USD $25/day for the trip.' },
  },
  kazakh: {
    form:  { title: 'Kazakhstan e-Visa Application (evisa.mfa.kz)', summary: 'Kazakhstan e-Visa applied online via the Ministry of Foreign Affairs portal.' },
    funds: { summary: 'Bank statements showing USD $30/day or KZT 15,000/day for the stay.' },
  },
  azerbaijan: {
    form:  { title: 'Azerbaijan ASAN e-Visa Application (evisa.gov.az)', summary: 'Azerbaijan ASAN e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing AZN 30/day or USD $18/day for the trip.' },
  },
  bahrain: {
    form:  { title: 'Bahrain e-Visa Application (evisa.gov.bh)', summary: 'Bahrain e-Visa applied online via the government portal or on arrival at Bahrain International Airport.' },
    funds: { summary: 'Bank statements showing BHD 20/day or USD $55/day for the stay.' },
  },
  maldives: {
    form:  { title: 'Maldives Arrival Card',                summary: 'Maldives issues a 30-day tourist visa free on arrival. Complete the arrival card before landing.' },
    funds: { summary: 'Bank statements showing USD $100/day or MVR 1,500/day — hotel bookings accepted as proof.' },
  },
  rwanda: {
    form:  { title: 'Rwanda e-Visa Application (irembo.gov.rw)', summary: 'Rwanda e-Visa applied online via the Irembo government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or RWF 60,000/day for the trip.' },
  },
  ethiopia: {
    form:  { title: 'Ethiopia e-Visa Application (evisa.gov.et)', summary: 'Ethiopia tourist e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or ETB 5,000/day for the stay.' },
  },
  cambodia: {
    form:  { title: 'Cambodia e-Visa Application (evisa.gov.kh)', summary: 'Cambodia e-Visa (T) applied online — also available on arrival at major ports.' },
    funds: { summary: 'Bank statements showing USD $30/day or KHR 125,000/day for the trip.' },
  },
}

/**
 * Returns a fresh 10-doc checklist for the given country key.
 * Falls back to Canada overrides for unknown keys.
 *
 * @param {string} countryKey - key from COUNTRIES map (e.g. 'usa', 'uk')
 * @returns {Array} - array of 10 doc objects
 */
export function getDocsForCountry(countryKey) {
  const overrides = OVERRIDES[countryKey] ?? OVERRIDES.canada
  const requiresBiometrics = BIOMETRIC_COUNTRIES.has(countryKey)

  return BASE_DOCS.map((doc) => {
    const docOverride = overrides[doc.id]
    const base = { ...doc, checks: doc.checks.map((c) => ({ ...c })), tips: [...doc.tips] }

    if (doc.id === 'biometrics') {
      base.required = requiresBiometrics
    }

    if (docOverride) {
      return { ...base, ...docOverride }
    }

    return base
  })
}
```

- [ ] **Step 4: Run the tests — all should pass**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/docsForCountry.test.js
```

Expected: PASS — all 19 tests green.

- [ ] **Step 5: Run full suite**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 6: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/data/docsForCountry.js src/tests/docsForCountry.test.js && git commit -m "feat: add getDocsForCountry with country-specific form/funds/biometrics overrides"
```

---

## Task 3: SaveModal component + URL encode/decode logic + tests

**Files:**
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/components/SaveModal.jsx`
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/tests/SaveModal.test.jsx`

The modal is self-contained. It receives `{ statuses, current, profile, country, onClose }` as props, encodes them into a URL hash, and renders the URL + buttons. It does NOT touch `window.location` itself — the App controls that. We expose a pure helper `encodeState(state)` and `decodeState(hash)` from the same file so they can be tested without mounting the component.

- [ ] **Step 1: Write the failing tests in `src/tests/SaveModal.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SaveModal, { encodeState, decodeState } from '../components/SaveModal'

// --- pure function tests (no DOM needed) ---

describe('encodeState / decodeState', () => {
  const state = {
    statuses: { passport: 'done', form: 'doing' },
    current: 2,
    profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
    country: 'canada',
  }

  it('encodeState returns a non-empty string', () => {
    expect(typeof encodeState(state)).toBe('string')
    expect(encodeState(state).length).toBeGreaterThan(0)
  })

  it('round-trips state through encode → decode', () => {
    const encoded = encodeState(state)
    const decoded = decodeState(encoded)
    expect(decoded).toEqual(state)
  })

  it('decodeState returns null for empty string', () => {
    expect(decodeState('')).toBeNull()
  })

  it('decodeState returns null for invalid base64', () => {
    expect(decodeState('!!!not-base64!!!')).toBeNull()
  })

  it('encodeState produces valid base64 (no spaces, URL-safe chars)', () => {
    const encoded = encodeState(state)
    expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/)
  })
})

// --- component rendering tests ---

describe('SaveModal', () => {
  const defaultProps = {
    statuses: { passport: 'done' },
    current: 1,
    profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
    country: 'canada',
    onClose: vi.fn(),
  }

  beforeEach(() => {
    // jsdom doesn't implement window.location.href well, stub it
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:5173/', hash: '' },
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'navigator', {
      value: { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => { vi.clearAllMocks() })

  it('renders a heading "Save your progress"', () => {
    render(<SaveModal {...defaultProps} />)
    expect(screen.getByRole('heading', { name: /save your progress/i })).toBeInTheDocument()
  })

  it('renders the encoded URL in a readonly input', () => {
    render(<SaveModal {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('readOnly')
    expect(input.value).toContain('#s=')
  })

  it('renders a "Copy link" button', () => {
    render(<SaveModal {...defaultProps} />)
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
  })

  it('renders an "Email to myself" link', () => {
    render(<SaveModal {...defaultProps} />)
    const link = screen.getByRole('link', { name: /email to myself/i })
    expect(link).toBeInTheDocument()
    expect(link.href).toContain('mailto:')
  })

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SaveModal {...defaultProps} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('"Copy link" calls navigator.clipboard.writeText with the URL', async () => {
    const user = userEvent.setup()
    render(<SaveModal {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /copy link/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('#s='))
  })
})
```

- [ ] **Step 2: Run to verify tests fail**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/SaveModal.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/SaveModal.jsx`**

```jsx
// Exported pure helpers — tested independently of the DOM.
export function encodeState({ statuses, current, profile, country }) {
  return btoa(JSON.stringify({ statuses, current, profile, country }))
}

export function decodeState(encoded) {
  if (!encoded) return null
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return null
  }
}

export default function SaveModal({ statuses, current, profile, country, onClose }) {
  const encoded = encodeState({ statuses, current, profile, country })
  const url = `${window.location.href.split('#')[0]}#s=${encoded}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).catch(() => {})
  }

  const mailtoHref =
    `mailto:?subject=${encodeURIComponent('My VisaPrep progress')}&body=${encodeURIComponent(
      `Open this link to restore your visa checklist progress:\n\n${url}`
    )}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 28,
          width: 520,
          maxWidth: '92vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h2 id="save-modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          Save your progress
        </h2>

        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
          Copy this link or email it to yourself. Opening it will restore exactly where you left off.
        </p>

        <input
          type="text"
          readOnly
          value={url}
          onClick={(e) => e.target.select()}
          style={{
            width: '100%',
            padding: '8px 10px',
            fontSize: 13,
            fontFamily: 'monospace',
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'var(--surface-2, #f5f5f5)',
            color: 'var(--ink)',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={handleCopy}>
            Copy link
          </button>
          <a
            href={mailtoHref}
            className="btn ghost"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Email to myself
          </a>
          <button className="btn ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests — all should pass**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/SaveModal.test.jsx
```

Expected: PASS — all 11 tests green.

- [ ] **Step 5: Run full suite**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 6: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/components/SaveModal.jsx src/tests/SaveModal.test.jsx && git commit -m "feat: add SaveModal with encodeState/decodeState and URL hash export"
```

---

## Task 4: Wire SaveModal into App and TopBar

**Files:**
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/App.jsx`
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/components/TopBar.jsx`

No new tests — the component and logic are already tested. This task is pure wiring.

- [ ] **Step 1: Update `src/components/TopBar.jsx` to accept and call `onSaveModal`**

Replace the entire file content with:

```jsx
import { COUNTRIES } from '../data/countries'

export default function TopBar({ country, onCountry, onSaveModal, page, onPage }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="brand">
          <div className="brand-mark">V</div>
          VisaPrep
        </div>
        <nav>
          <a
            href="#"
            className={page === 'app' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onPage('app') }}
          >Application</a>
          <a
            href="#"
            className={page === 'guides' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onPage('guides') }}
          >Guides</a>
          <a
            href="#"
            className={page === 'documents' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onPage('documents') }}
          >Documents</a>
          <a
            href="#"
            className={page === 'help' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onPage('help') }}
          >Help</a>
        </nav>
      </div>
      <div className="right">
        <select
          className="select"
          style={{ width: 180, padding: '6px 10px' }}
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          aria-label="Select country"
        >
          {Object.entries(COUNTRIES).map(([k, v]) => (
            <option key={k} value={k}>{v.flag} {v.name} · {v.visa}</option>
          ))}
        </select>
        <button className="btn ghost icon" aria-label="Help">?</button>
        <button className="btn" onClick={onSaveModal}>Sign in</button>
      </div>
    </header>
  )
}
```

Note: `page` and `onPage` are passed here in preparation for Task 6. For now they will be passed as `'app'` and a no-op from App so the component renders correctly until the page state is added in Task 5.

- [ ] **Step 2: Update `src/App.jsx` to import SaveModal, add modal state, hash-restore, and pass new props to TopBar**

Replace the entire file content with:

```jsx
import { useEffect, useCallback, useState } from 'react'
import { useStore } from './store/useStore'
import { DOCS } from './data/docs'
import { COUNTRIES } from './data/countries'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import ProgressBar from './components/ProgressBar'
import Toast from './components/Toast'
import TweaksPanel from './components/TweaksPanel'
import Wizard from './wizard/Wizard'
import Board from './board/Board'
import SaveModal, { decodeState } from './components/SaveModal'

export default function App() {
  const {
    country, setCountry,
    view, setView,
    current, setCurrent,
    profile, setProfile,
    statuses, setStatus,
    files, setFiles,
    tweaks, setTweak,
    resetProgress,
  } = useStore()

  const c = COUNTRIES[country] ?? COUNTRIES.canada
  const done  = DOCS.filter((d) => statuses[d.id] === 'done').length
  const total = DOCS.length

  // --- hash restore on mount ---
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#s=')) return
    const encoded = hash.slice(3)
    const restored = decodeState(encoded)
    if (!restored) return
    if (restored.country)  setCountry(restored.country)
    if (restored.current !== undefined) setCurrent(restored.current)
    if (restored.profile)  setProfile(restored.profile)
    if (restored.statuses) {
      Object.entries(restored.statuses).forEach(([id, status]) => setStatus(id, status))
    }
    // Clear the hash so refreshing doesn't re-restore
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- theme / density sync ---
  useEffect(() => {
    document.body.dataset.theme   = tweaks.theme
    document.body.dataset.density = tweaks.density
  }, [tweaks.theme, tweaks.density])

  // --- keyboard navigation ---
  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'wizard') return
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') setCurrent(Math.min(DOCS.length - 1, current + 1))
      if (e.key === 'ArrowLeft')  setCurrent(Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, current, setCurrent])

  // --- toast ---
  const [toast, setToast] = useState({ msg: '', show: false })
  const flash = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }, [])

  // --- save modal ---
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  // --- page (stub until Task 5 adds it to store) ---
  const [page, setPage] = useState('app')

  const handleCountry = (val) => { setCountry(val); flash('Switched country') }
  const handleReset   = () => { resetProgress(); flash('Progress reset') }

  return (
    <div className="app">
      <TopBar
        country={country}
        onCountry={handleCountry}
        onSaveModal={() => setSaveModalOpen(true)}
        page={page}
        onPage={setPage}
      />

      <div>
        <div className="page-head">
          <div className="crumbs">
            <a href="#">Home</a><span>›</span>
            <a href="#">Visas</a><span>›</span>
            <a href="#">{c.name}</a><span>›</span>
            <span style={{ color: 'var(--ink)' }}>Tourist visa application</span>
          </div>
          <div className="page-title">
            <h1>{c.flag} <em>{c.name}</em> tourist visa<br />
              <span style={{ color: 'var(--muted)' }}>document checklist</span>
            </h1>
            <div className="meta">
              <span>Fee · <b>{c.fee}</b></span>
              <span>Processing · <b>{c.proc}</b></span>
              <span>Updated · <b>May 2026</b></span>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="layout">
            <Rail profile={profile} setProfile={setProfile} />

            <div className="main">
              <ProgressBar
                done={done}
                total={total}
                view={view}
                setView={setView}
                onPdf={() => flash('PDF generated')}
                onSave={() => flash('Saved & emailed')}
              />

              {view === 'wizard'
                ? <Wizard
                    docs={DOCS}
                    statuses={statuses}
                    current={current}
                    setCurrent={setCurrent}
                    setStatus={setStatus}
                    files={files}
                    setFiles={setFiles}
                  />
                : <Board
                    docs={DOCS}
                    statuses={statuses}
                    setStatus={setStatus}
                    setCurrent={setCurrent}
                    setView={setView}
                  />
              }

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
                <span>Auto-saved locally · sync across devices by saving with email.</span>
                <button className="btn ghost sm" onClick={handleReset}>Reset progress</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
      <Toast msg={toast.msg} show={toast.show} />

      {saveModalOpen && (
        <SaveModal
          statuses={statuses}
          current={current}
          profile={profile}
          country={country}
          onClose={() => setSaveModalOpen(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Run the full test suite to confirm no regressions**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 4: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/App.jsx src/components/TopBar.jsx && git commit -m "feat: wire SaveModal into App and TopBar — Sign in button opens save/share modal"
```

---

## Task 5: Page state in Zustand store + stub pages

**Files:**
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/store/useStore.js`
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/pages/GuidesPage.jsx`
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/pages/DocumentsPage.jsx`
- Create: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/pages/HelpPage.jsx`

No tests required for pure stub pages or the `page`/`setPage` slice (it is a trivial setter — the store tests already cover the pattern). We do add one targeted test to `src/tests/store.test.js` to confirm `setPage` works and is included in `getInitialState`.

- [ ] **Step 1: Add `setPage` test to `src/tests/store.test.js`**

Open `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/tests/store.test.js` and append inside the `describe('useStore', ...)` block (before the closing `})`):

```js
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
```

- [ ] **Step 2: Run to confirm the new store tests fail**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/store.test.js
```

Expected: FAIL — `store().page` is undefined; `setPage` is not a function.

- [ ] **Step 3: Update `src/store/useStore.js` to add `page` and `setPage`**

Replace the entire file with:

```js
import { create } from 'zustand'

const LS_STATUS = 'vp-status'
const LS_FILES  = 'vp-files'
const LS_TWEAKS = 'vp-tweaks'

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const INITIAL = {
  country: 'canada',
  view: 'wizard',
  current: 0,
  page: 'app',
  profile: { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' },
  statuses: {},
  files: {},
  tweaks: { theme: 'blue', density: 'default' },
}

export const useStore = create((set, get) => ({
  ...INITIAL,
  statuses: load(LS_STATUS, {}),
  files:    load(LS_FILES,  {}),
  tweaks:   load(LS_TWEAKS, INITIAL.tweaks),

  setCountry: (country) => set({ country }),
  setView:    (view)    => set({ view }),
  setCurrent: (current) => set({ current }),
  setPage:    (page)    => set({ page }),

  setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

  setStatus: (id, status) => set((s) => {
    const statuses = { ...s.statuses, [id]: status }
    save(LS_STATUS, statuses)
    return { statuses }
  }),

  setFiles: (files) => set(() => {
    save(LS_FILES, files)
    return { files }
  }),

  setTweak: (key, value) => set((s) => {
    const tweaks = { ...s.tweaks, [key]: value }
    save(LS_TWEAKS, tweaks)
    try { document.body.dataset[key] = value } catch {}
    return { tweaks }
  }),

  resetProgress: () => set(() => {
    try { localStorage.removeItem(LS_STATUS); localStorage.removeItem(LS_FILES) } catch {}
    return { statuses: {}, files: {}, current: 0 }
  }),
}))

useStore.getInitialState = () => ({
  ...INITIAL,
  statuses: {},
  files: {},
  tweaks: { ...INITIAL.tweaks },
})
```

- [ ] **Step 4: Run the store tests to confirm they pass**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run src/tests/store.test.js
```

Expected: PASS — all store tests green including the 3 new page ones.

- [ ] **Step 5: Create `src/pages/GuidesPage.jsx`**

```jsx
export default function GuidesPage() {
  const guides = [
    {
      title: 'How to complete IMM 5257',
      description: 'Step-by-step walkthrough of every section of the Canada Temporary Resident Visa form — from personal details to travel history.',
      tag: 'Canada',
    },
    {
      title: 'Proof of funds explained',
      description: 'Understand exactly how much money you need to show, which documents count, and how to strengthen a borderline bank statement.',
      tag: 'All countries',
    },
    {
      title: 'Biometrics guide',
      description: 'Which countries require biometrics, how to book your appointment, what to bring, and how the receipt fits into your application.',
      tag: 'Canada · USA · UK · Schengen · Australia',
    },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Immigration Guides</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        In-depth articles to help you understand each stage of the visa application process.
        Select a guide to read the full version.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {guides.map((g) => (
          <div
            key={g.title}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {g.tag}
            </span>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{g.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{g.description}</p>
            <button className="btn ghost sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
              Read guide →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `src/pages/DocumentsPage.jsx`**

```jsx
const DOC_TYPES = [
  { icon: '🛂', name: 'Passport', desc: 'Requirements for validity period, blank pages, and scan quality for all major destinations.' },
  { icon: '🏦', name: 'Bank statements', desc: 'How to present bank statements, what balance is needed, and how to handle sponsor letters.' },
  { icon: '📷', name: 'Photos', desc: 'Specification guide: size, background colour, expression, and common rejection reasons.' },
  { icon: '✈️', name: 'Travel itinerary', desc: 'How to generate acceptable flight reservations and hotel bookings without paying upfront.' },
  { icon: '📝', name: 'Application forms', desc: 'Direct links to official visa application forms for all 40 supported countries.' },
  { icon: '💼', name: 'Employment letter', desc: 'Template and checklist: what your HR letter must state to satisfy the visa officer.' },
  { icon: '📜', name: 'Cover letter', desc: 'Writing a compelling one-page cover letter that establishes strong ties to your home country.' },
  { icon: '🦷', name: 'Biometrics', desc: 'Countries that require fingerprinting, how to book, and what the receipt should look like.' },
]

export default function DocumentsPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Document Library</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        Reference guides for every document type in the visa checklist.
        Click any card for full specifications and country-specific requirements.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {DOC_TYPES.map((d) => (
          <div
            key={d.name}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 18,
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 28 }}>{d.icon}</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{d.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create `src/pages/HelpPage.jsx`**

```jsx
import { useState } from 'react'

const FAQS = [
  {
    q: 'Is my data sent to any server?',
    a: 'No. All your progress — document statuses, profile answers, and uploaded files — is stored only in your browser\'s localStorage. Nothing is transmitted anywhere unless you use the "Save" link to share via email, which encodes everything in the URL itself.',
  },
  {
    q: 'Can I use VisaPrep for countries other than Canada?',
    a: 'Yes. Use the country selector in the top bar to switch between 40 supported tourist-visa destinations. The document checklist, form names, and fund requirements update automatically for each country.',
  },
  {
    q: 'How do I save my progress across devices?',
    a: 'Click "Sign in" in the top bar. VisaPrep will generate a link that encodes your entire progress. Copy the link or email it to yourself. Opening the link on any device restores your checklist exactly where you left off — no account needed.',
  },
  {
    q: 'Are the fees and processing times up to date?',
    a: 'VisaPrep uses verified data updated as of May 2026. Visa fees and processing times change frequently — always cross-check with the official embassy or immigration authority website before submitting your application.',
  },
  {
    q: 'What does "biometrics required" mean?',
    a: 'Some countries (Canada, USA, UK, Schengen, Australia) require you to provide fingerprints and a photograph at an authorised Visa Application Centre before or alongside your visa submission. VisaPrep marks the biometrics document as required only for those countries.',
  },
  {
    q: 'Can I reset my progress?',
    a: 'Yes. Scroll to the bottom of the checklist page and click "Reset progress". This clears all document statuses and uploaded files from your browser. Your profile answers (passport country, purpose, etc.) are preserved.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '14px 18px',
          fontSize: 15,
          fontWeight: 500,
          background: 'var(--surface)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--ink)',
        }}
        aria-expanded={open}
      >
        {q}
        <span style={{ fontSize: 18, lineHeight: 1, color: 'var(--muted)', marginLeft: 12 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div
          style={{
            padding: '12px 18px 16px',
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.65,
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          {a}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Help & FAQ</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        Answers to the most common questions about VisaPrep.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Run full test suite**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 9: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/store/useStore.js src/tests/store.test.js src/pages/GuidesPage.jsx src/pages/DocumentsPage.jsx src/pages/HelpPage.jsx && git commit -m "feat: add page state to store + GuidesPage, DocumentsPage, HelpPage stubs"
```

---

## Task 6: Wire page navigation in TopBar and App

**Files:**
- Modify: `/Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa/src/App.jsx`

TopBar already accepts `page` and `onPage` (wired in Task 4). This task moves `page` from local `useState` in App to the Zustand store's `page`/`setPage`, then adds conditional rendering of the three stub pages.

- [ ] **Step 1: Update `src/App.jsx` to use `page`/`setPage` from the store and render stub pages**

Replace the entire file content with:

```jsx
import { useEffect, useCallback, useState } from 'react'
import { useStore } from './store/useStore'
import { DOCS } from './data/docs'
import { COUNTRIES } from './data/countries'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import ProgressBar from './components/ProgressBar'
import Toast from './components/Toast'
import TweaksPanel from './components/TweaksPanel'
import Wizard from './wizard/Wizard'
import Board from './board/Board'
import SaveModal, { decodeState } from './components/SaveModal'
import GuidesPage from './pages/GuidesPage'
import DocumentsPage from './pages/DocumentsPage'
import HelpPage from './pages/HelpPage'

export default function App() {
  const {
    country, setCountry,
    view, setView,
    current, setCurrent,
    page, setPage,
    profile, setProfile,
    statuses, setStatus,
    files, setFiles,
    tweaks, setTweak,
    resetProgress,
  } = useStore()

  const c = COUNTRIES[country] ?? COUNTRIES.canada
  const done  = DOCS.filter((d) => statuses[d.id] === 'done').length
  const total = DOCS.length

  // --- hash restore on mount ---
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#s=')) return
    const encoded = hash.slice(3)
    const restored = decodeState(encoded)
    if (!restored) return
    if (restored.country)  setCountry(restored.country)
    if (restored.current !== undefined) setCurrent(restored.current)
    if (restored.profile)  setProfile(restored.profile)
    if (restored.statuses) {
      Object.entries(restored.statuses).forEach(([id, status]) => setStatus(id, status))
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- theme / density sync ---
  useEffect(() => {
    document.body.dataset.theme   = tweaks.theme
    document.body.dataset.density = tweaks.density
  }, [tweaks.theme, tweaks.density])

  // --- keyboard navigation (only active on main app page) ---
  useEffect(() => {
    const onKey = (e) => {
      if (page !== 'app') return
      if (view !== 'wizard') return
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') setCurrent(Math.min(DOCS.length - 1, current + 1))
      if (e.key === 'ArrowLeft')  setCurrent(Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, view, current, setCurrent])

  // --- toast ---
  const [toast, setToast] = useState({ msg: '', show: false })
  const flash = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }, [])

  // --- save modal ---
  const [saveModalOpen, setSaveModalOpen] = useState(false)

  const handleCountry = (val) => { setCountry(val); flash('Switched country') }
  const handleReset   = () => { resetProgress(); flash('Progress reset') }

  return (
    <div className="app">
      <TopBar
        country={country}
        onCountry={handleCountry}
        onSaveModal={() => setSaveModalOpen(true)}
        page={page}
        onPage={setPage}
      />

      {page === 'guides'    && <GuidesPage />}
      {page === 'documents' && <DocumentsPage />}
      {page === 'help'      && <HelpPage />}

      {page === 'app' && (
        <div>
          <div className="page-head">
            <div className="crumbs">
              <a href="#">Home</a><span>›</span>
              <a href="#">Visas</a><span>›</span>
              <a href="#">{c.name}</a><span>›</span>
              <span style={{ color: 'var(--ink)' }}>Tourist visa application</span>
            </div>
            <div className="page-title">
              <h1>{c.flag} <em>{c.name}</em> tourist visa<br />
                <span style={{ color: 'var(--muted)' }}>document checklist</span>
              </h1>
              <div className="meta">
                <span>Fee · <b>{c.fee}</b></span>
                <span>Processing · <b>{c.proc}</b></span>
                <span>Updated · <b>May 2026</b></span>
              </div>
            </div>
          </div>

          <div className="page-body">
            <div className="layout">
              <Rail profile={profile} setProfile={setProfile} />

              <div className="main">
                <ProgressBar
                  done={done}
                  total={total}
                  view={view}
                  setView={setView}
                  onPdf={() => flash('PDF generated')}
                  onSave={() => flash('Saved & emailed')}
                />

                {view === 'wizard'
                  ? <Wizard
                      docs={DOCS}
                      statuses={statuses}
                      current={current}
                      setCurrent={setCurrent}
                      setStatus={setStatus}
                      files={files}
                      setFiles={setFiles}
                    />
                  : <Board
                      docs={DOCS}
                      statuses={statuses}
                      setStatus={setStatus}
                      setCurrent={setCurrent}
                      setView={setView}
                    />
                }

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
                  <span>Auto-saved locally · sync across devices by saving with email.</span>
                  <button className="btn ghost sm" onClick={handleReset}>Reset progress</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
      <Toast msg={toast.msg} show={toast.show} />

      {saveModalOpen && (
        <SaveModal
          statuses={statuses}
          current={current}
          profile={profile}
          country={country}
          onClose={() => setSaveModalOpen(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run full test suite**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests passing.

- [ ] **Step 3: Commit**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git add src/App.jsx && git commit -m "feat: wire page navigation — Guides, Documents, Help nav links render stub pages"
```

---

## Task 7: Full test run + production build + push

**Files:** none (verification only)

- [ ] **Step 1: Run the full Vitest suite**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vitest run
```

Expected: all tests pass (30 original + 3 store page tests + 19 docsForCountry tests + 11 SaveModal tests + 4 countries expansion tests = ~67 tests). Zero failures.

- [ ] **Step 2: Run the Vite production build**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npm run build
```

Expected: `dist/` generated. No TypeScript or JSX errors. Bundle size is reasonable (no warning about chunks > 1 MB). If you see a chunk warning, ignore it for now — the project has no code-splitting configured and the countries data is intentionally large.

- [ ] **Step 3: Smoke-test the build locally**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && npx vite preview --port 4173
```

Open http://localhost:4173 and verify:
- Country selector shows ~40 countries
- "Sign in" opens the SaveModal with a URL containing `#s=`
- "Copy link" copies the URL (check browser console for errors)
- Nav links switch between Application / Guides / Documents / Help views
- The three stub pages render correctly
- Closing the browser and reopening the `#s=...` URL restores progress (test manually)

Stop the preview server with Ctrl+C when done.

- [ ] **Step 4: Push to remote**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa && git push
```

Expected: All 7 feature commits pushed successfully to `origin/main`.

---

## Spec Coverage Self-Review

| Requirement | Task |
|---|---|
| 40 countries in `countries.js` with flag/name/visa/fee/proc/currency/eVisa | Task 1 |
| `getDocsForCountry(key)` with country-specific form/funds/biometrics | Task 2 |
| SaveModal opens on "Sign in" click | Tasks 3+4 |
| Modal encodes state as `btoa(JSON.stringify(...))` → `#s=BASE64` | Task 3 |
| Modal shows URL + Copy link + Email to myself | Task 3 |
| Hash restore on app load + hash cleared after restore | Task 4 |
| `page` in Zustand store with `setPage` | Task 5 |
| GuidesPage stub with 3 guide cards | Task 5 |
| DocumentsPage stub with document type grid | Task 5 |
| HelpPage stub with 5+ FAQ accordion items | Task 5 |
| Nav links in TopBar call `setPage` | Tasks 4+6 |
| App renders stub pages when `page !== 'app'` | Task 6 |
| TDD: tests written before implementation for docsForCountry and SaveModal | Tasks 2+3 |
| Commit after each task | All tasks |
| Full build + push at the end | Task 7 |
