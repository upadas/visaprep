# Tranche 1 — UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship five UI polish improvements: favicon, fingerprint emoji on biometrics, trim countries to 15, replace TweaksPanel with a TopBar theme toggle, and make the PDF button green only when all required docs are done.

**Architecture:** All changes are UI-layer only — no new dependencies, no backend, no new pages. Each task touches at most 3 files and is independently committable. Theme state moves from a 4-value + density model to a 3-value `'light' | 'dark' | 'system'` model stored in the same `vp-tweaks` localStorage key.

**Tech Stack:** Vite 6 · React 19 · Zustand 5 · Vitest 3 · @testing-library/react 16 · CSS custom properties (`src/styles/tokens.css`)

---

## File map

| File | Action | Why |
|------|--------|-----|
| `public/favicon.svg` | **Create** | White "V" on brand-blue SVG favicon |
| `index.html` | Modify | Add favicon link; remove stale `data-density` attribute |
| `src/data/countries.js` | Modify | Trim from 40 → 15 entries |
| `src/data/docs.js` | Modify | Add `icon: '🫆'` to biometrics doc |
| `src/store/useStore.js` | Modify | New theme model (`light/dark/system`), remove density |
| `src/components/TopBar.jsx` | Modify | Add sun/moon/system cycling theme button |
| `src/components/ProgressBar.jsx` | Modify | Accept `complete` prop; disable + green PDF button |
| `src/App.jsx` | Modify | Remove TweaksPanel; new theme effect; pass `complete` to ProgressBar |
| `src/styles/app.css` | Modify | Add `.btn.pdf-ready` green style |
| `src/tests/docs.test.js` | Modify | Update countries count assertion to 15 |
| `src/tests/store.test.js` | Modify | Remove density tests; add theme cycling tests |
| `src/tests/ProgressBar.test.jsx` | **Create** | Tests for disabled/enabled/green PDF button |
| `docs/release-notes/v1.2.0.md` | **Create** | Release notes |

---

## Task 1: Favicon

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html`

- [ ] **Step 1: Create the public directory and SVG favicon**

Create `public/favicon.svg` with this exact content — white "V" on brand-blue (#0F4C81) rounded square, matching the `.brand-mark` in TopBar:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#0F4C81"/>
  <text
    x="16" y="22"
    font-family="'Inter Tight', 'Inter', system-ui, sans-serif"
    font-weight="700"
    font-size="18"
    fill="white"
    text-anchor="middle"
  >V</text>
</svg>
```

- [ ] **Step 2: Add favicon links to index.html**

Current `index.html` head:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>VisaPrep — Canada Tourist Visa Checklist</title>
```

Replace with:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>VisaPrep — Tourist Visa Document Checklist</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.svg" sizes="any" />
```

Also change the body opening tag from:
```html
<body data-theme="blue" data-density="default">
```
to:
```html
<body data-theme="">
```

- [ ] **Step 3: Verify favicon loads**

Run: `npm run dev`
Open `http://localhost:5173` in browser — check the browser tab shows the blue "V" icon.

- [ ] **Step 4: Commit**

```bash
git checkout -b feat/ui-polish
git add public/favicon.svg index.html
git commit -m "feat: add SVG favicon with V brand mark"
```

---

## Task 2: Trim countries to top 15

**Files:**
- Modify: `src/data/countries.js`
- Modify: `src/tests/docs.test.js`

- [ ] **Step 1: Update the failing test first**

In `src/tests/docs.test.js`, find and replace the countries count assertion:

Old:
```js
it('has ~40 entries', () => { expect(Object.keys(COUNTRIES).length).toBeGreaterThanOrEqual(40) })
```

New:
```js
it('has 15 entries', () => { expect(Object.keys(COUNTRIES).length).toBe(15) })
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx vitest run src/tests/docs.test.js
```
Expected: FAIL — "expected 40 to be 15"

- [ ] **Step 3: Rewrite countries.js with exactly 15 entries**

Replace the entire content of `src/data/countries.js`:

```js
export const COUNTRIES = {
  canada:      { flag: '🇨🇦', name: 'Canada',           visa: 'Tourist Visa (TRV)',          fee: 'CAD $100',    proc: '29 days avg.',  currency: 'CAD', eVisa: true  },
  usa:         { flag: '🇺🇸', name: 'United States',    visa: 'B1/B2 Visitor',               fee: 'USD $185',    proc: '8–12 weeks',    currency: 'USD', eVisa: false },
  schengen:    { flag: '🇪🇺', name: 'Schengen',         visa: 'Type C Short-Stay',           fee: 'EUR €90',     proc: '15 days avg.',  currency: 'EUR', eVisa: false },
  uk:          { flag: '🇬🇧', name: 'United Kingdom',   visa: 'Standard Visitor Visa',       fee: 'GBP £115',    proc: '3 weeks avg.',  currency: 'GBP', eVisa: true  },
  australia:   { flag: '🇦🇺', name: 'Australia',        visa: 'Tourist Visa (subclass 600)', fee: 'AUD $190',    proc: '25 days avg.',  currency: 'AUD', eVisa: true  },
  japan:       { flag: '🇯🇵', name: 'Japan',            visa: 'Temporary Visitor Visa',      fee: 'JPY ¥3,000',  proc: '5 days avg.',   currency: 'JPY', eVisa: false },
  india:       { flag: '🇮🇳', name: 'India',            visa: 'e-Tourist Visa',              fee: 'USD $25',     proc: '3 days avg.',   currency: 'INR', eVisa: true  },
  newzealand:  { flag: '🇳🇿', name: 'New Zealand',      visa: 'Visitor Visa',                fee: 'NZD $211',    proc: '20 days avg.',  currency: 'NZD', eVisa: true  },
  china:       { flag: '🇨🇳', name: 'China',            visa: 'L Tourist Visa',              fee: 'USD $140',    proc: '4 days avg.',   currency: 'CNY', eVisa: false },
  singapore:   { flag: '🇸🇬', name: 'Singapore',        visa: 'Short-Term Visit Pass',       fee: 'SGD $30',     proc: '3 days avg.',   currency: 'SGD', eVisa: true  },
  southkorea:  { flag: '🇰🇷', name: 'South Korea',      visa: 'C-3 Tourist Visa',            fee: 'USD $50',     proc: '5 days avg.',   currency: 'KRW', eVisa: false },
  uae:         { flag: '🇦🇪', name: 'UAE',              visa: 'Tourist Visa (30-day)',        fee: 'AED 300',     proc: '3–5 days',      currency: 'AED', eVisa: true  },
  thailand:    { flag: '🇹🇭', name: 'Thailand',         visa: 'TR Tourist Visa',             fee: 'THB 2,000',   proc: '2 days avg.',   currency: 'THB', eVisa: true  },
  malaysia:    { flag: '🇲🇾', name: 'Malaysia',         visa: 'eNTRI / Single Entry',        fee: 'MYR 50',      proc: '1 day avg.',    currency: 'MYR', eVisa: true  },
  philippines: { flag: '🇵🇭', name: 'Philippines',     visa: 'Tourist Visa (9a)',            fee: 'USD $30',     proc: '3 days avg.',   currency: 'PHP', eVisa: false },
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/tests/docs.test.js
```
Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/countries.js src/tests/docs.test.js
git commit -m "feat: trim countries dropdown to top 15"
```

---

## Task 3: Fingerprint emoji on biometrics card

**Files:**
- Modify: `src/data/docs.js` (add `icon` field to biometrics)
- Modify: `src/wizard/Wizard.jsx` (render icon in header)
- Modify: `src/board/BoardCard.jsx` (render icon next to title)

No new tests needed — the icon is cosmetic; existing Wizard and Board tests still pass as-is.

- [ ] **Step 1: Add icon field to biometrics in docs.js**

In `src/data/docs.js`, find the biometrics entry (id: `'biometrics'`) and add `icon: '🫆'`:

```js
{
  id: 'biometrics',
  title: 'Biometrics',
  icon: '🫆',          // ← add this line
  summary: 'Fee paid and fingerprints taken at an authorised centre.',
  required: false,
  // ... rest unchanged
}
```

The `icon` field is `undefined` on all other docs — that's intentional. No changes to other docs.

- [ ] **Step 2: Render icon in Wizard wiz-head**

In `src/wizard/Wizard.jsx`, find the `wiz-head` block:

```jsx
<div className="wiz-head">
  <div>
    <div className="step-of">Step {current + 1} of {total}</div>
    <h2>{doc.title}</h2>
    <p className="desc">{doc.summary}</p>
  </div>
```

Change the `<h2>` line to:
```jsx
    <h2>{doc.icon && <span style={{ marginRight: 6 }}>{doc.icon}</span>}{doc.title}</h2>
```

- [ ] **Step 3: Render icon in BoardCard**

In `src/board/BoardCard.jsx`, find:
```jsx
<div className="t">{doc.title}</div>
```

Change to:
```jsx
<div className="t">{doc.icon && <span style={{ marginRight: 4 }}>{doc.icon}</span>}{doc.title}</div>
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```
Expected: 65 tests pass (no new failures — icon is cosmetic, existing snapshots don't exist).

- [ ] **Step 5: Commit**

```bash
git add src/data/docs.js src/wizard/Wizard.jsx src/board/BoardCard.jsx
git commit -m "feat: add fingerprint emoji to biometrics card"
```

---

## Task 4: Remove TweaksPanel — add theme toggle to TopBar

**Files:**
- Modify: `src/store/useStore.js`
- Modify: `src/components/TopBar.jsx`
- Modify: `src/App.jsx`
- Modify: `src/tests/store.test.js`

**Theme model:** `'light' | 'dark' | 'system'`
- `light` → `document.body.dataset.theme = ''` (uses base `:root` tokens — the existing blue/light theme)
- `dark` → `document.body.dataset.theme = 'dark'`
- `system` → read `window.matchMedia('(prefers-color-scheme: dark)')`, apply `'dark'` or `''`, listen for changes

- [ ] **Step 1: Update store tests first**

In `src/tests/store.test.js`, find any test that references `density` or `theme: 'blue'` and update:

Find:
```js
it('initial tweaks have blue theme and default density', ...
```
(or whichever store test covers tweaks) — replace with:

```js
it('initial theme is light', () => {
  const store = useStore.getInitialState()
  expect(store.tweaks.theme).toBe('light')
  expect(store.tweaks.density).toBeUndefined()
})

it('setTweak changes theme', () => {
  useStore.setState(useStore.getInitialState())
  const { setTweak } = useStore.getState()
  setTweak('theme', 'dark')
  expect(useStore.getState().tweaks.theme).toBe('dark')
})
```

- [ ] **Step 2: Run to confirm failures**

```bash
npx vitest run src/tests/store.test.js
```
Expected: 1–2 failures on the tweaks assertions.

- [ ] **Step 3: Update useStore.js**

Replace the `INITIAL` tweaks line and the localStorage loading for tweaks:

Old `INITIAL`:
```js
tweaks: { theme: 'blue', density: 'default' },
```

New:
```js
tweaks: { theme: 'light' },
```

Find the store init block that loads tweaks from localStorage. It currently reads:
```js
tweaks: load(LS_TWEAKS, INITIAL.tweaks),
```

Replace with migration-safe version:
```js
tweaks: (() => {
  const raw = load(LS_TWEAKS, INITIAL.tweaks)
  const valid = ['light', 'dark', 'system']
  const theme = valid.includes(raw?.theme) ? raw.theme : 'light'
  return { theme }
})(),
```

Also update `getInitialState` at the bottom:
```js
useStore.getInitialState = () => ({
  ...INITIAL,
  statuses: {},
  files: {},
  tweaks: { theme: 'light' },
})
```

- [ ] **Step 4: Run store tests — expect pass**

```bash
npx vitest run src/tests/store.test.js
```
Expected: all 12 store tests pass.

- [ ] **Step 5: Update TopBar.jsx — add theme toggle button**

Replace the entire content of `src/components/TopBar.jsx`:

```jsx
import { COUNTRIES } from '../data/countries'

const CYCLE = { light: 'dark', dark: 'system', system: 'light' }
const ICON  = { light: '☀️',   dark: '🌙',      system: '💻' }

export default function TopBar({ country, onCountry, onSaveModal, page, onPage, theme, onTheme }) {
  const currentTheme = ICON[theme] ? theme : 'light'

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
        <button
          className="btn ghost icon"
          aria-label={`Switch to ${CYCLE[currentTheme]} mode`}
          title={`Theme: ${currentTheme} — click to switch`}
          onClick={() => onTheme(CYCLE[currentTheme])}
        >
          {ICON[currentTheme]}
        </button>
        <button className="btn ghost icon" aria-label="Help">?</button>
        <button className="btn" onClick={onSaveModal}>Sign in</button>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Update App.jsx — remove TweaksPanel, new theme effect, pass theme to TopBar**

In `src/App.jsx`:

**Remove** the TweaksPanel import:
```js
import TweaksPanel from './components/TweaksPanel'  // DELETE this line
```

**Update** the destructuring from useStore — remove `setTweak`, keep `tweaks`:
```js
const {
  country, setCountry,
  view, setView,
  current, setCurrent,
  page, setPage,
  profile, setProfile,
  statuses, setStatus,
  files, setFiles,
  tweaks, setTweak,   // keep setTweak for theme cycling
  resetProgress,
} = useStore()
```

**Replace** the theme/density useEffect (currently two lines) with the new system-aware version:
```js
useEffect(() => {
  const { theme } = tweaks
  if (theme === 'dark') {
    document.body.dataset.theme = 'dark'
  } else if (theme === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    document.body.dataset.theme = mq.matches ? 'dark' : ''
    const handler = (e) => { document.body.dataset.theme = e.matches ? 'dark' : '' }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  } else {
    document.body.dataset.theme = ''
  }
}, [tweaks.theme])
```

**Update** the TopBar usage to pass theme props:
```jsx
<TopBar
  country={country}
  onCountry={handleCountry}
  onSaveModal={() => setSaveModalOpen(true)}
  page={page}
  onPage={setPage}
  theme={tweaks.theme}
  onTheme={(t) => setTweak('theme', t)}
/>
```

**Remove** the `<TweaksPanel tweaks={tweaks} setTweak={setTweak} />` line from the JSX return.

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```
Expected: 65 tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/store/useStore.js src/components/TopBar.jsx src/App.jsx src/tests/store.test.js
git commit -m "feat: replace TweaksPanel with TopBar theme toggle (light/dark/system)"
```

---

## Task 5: PDF button — disabled until all required docs done, green when complete

**Files:**
- Create: `src/tests/ProgressBar.test.jsx`
- Modify: `src/components/ProgressBar.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles/app.css`

**Logic:** `complete = requiredTotal > 0 && requiredDone === requiredTotal`
where `requiredDone` counts docs with `required: true` AND `statuses[d.id] === 'done'`.

- [ ] **Step 1: Write failing tests**

Create `src/tests/ProgressBar.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run to confirm failures**

```bash
npx vitest run src/tests/ProgressBar.test.jsx
```
Expected: 5 failures — `complete` prop doesn't exist yet.

- [ ] **Step 3: Update ProgressBar.jsx**

Replace the entire content of `src/components/ProgressBar.jsx`:

```jsx
export default function ProgressBar({ done, total, view, setView, onPdf, onSave, complete }) {
  return (
    <div className="progress-bar">
      <div className="row1">
        <div className="left">
          <span className="count">{done}</span>
          <span className="of">of {total} documents ready</span>
        </div>
        <div className="actions">
          <div className="tabs" role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === 'wizard'} onClick={() => setView('wizard')}>
              🧭 Wizard
            </button>
            <button role="tab" aria-selected={view === 'kanban'} onClick={() => setView('kanban')}>
              ▦ Board
            </button>
          </div>
          <button
            className={`btn${complete ? ' pdf-ready' : ''}`}
            onClick={onPdf}
            disabled={!complete}
            aria-label={complete ? 'Download PDF checklist' : 'Complete all required documents to unlock PDF'}
            title={complete ? 'Download PDF' : 'Mark all required documents as done to unlock'}
          >
            ⤓ PDF
          </button>
          <button className="btn primary" onClick={onSave}>Save my progress</button>
        </div>
      </div>
      <div className="bar">
        <i style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add pdf-ready style to app.css**

In `src/styles/app.css`, find the `.btn` rules section and append after existing button styles:

```css
.btn.pdf-ready { background: var(--ok); color: white; border-color: var(--ok); }
.btn.pdf-ready:hover { filter: brightness(1.1); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

(`--ok` is `#1F8A5B` — defined in `tokens.css`)

- [ ] **Step 5: Update App.jsx — compute complete, pass to ProgressBar**

In `src/App.jsx`, find:
```js
const docs = getDocsForCountry(country)
const done  = docs.filter((d) => statuses[d.id] === 'done').length
const total = docs.length
```

Replace with:
```js
const docs = getDocsForCountry(country)
const requiredDocs  = docs.filter((d) => d.required)
const done          = docs.filter((d) => statuses[d.id] === 'done').length
const total         = docs.length
const requiredDone  = requiredDocs.filter((d) => statuses[d.id] === 'done').length
const allRequiredDone = requiredDocs.length > 0 && requiredDone === requiredDocs.length
```

Find the ProgressBar usage:
```jsx
<ProgressBar
  done={done}
  total={total}
  view={view}
  setView={setView}
  onPdf={() => flash('PDF generated')}
  onSave={() => flash('Saved & emailed')}
/>
```

Replace with:
```jsx
<ProgressBar
  done={done}
  total={total}
  view={view}
  setView={setView}
  onPdf={() => flash('PDF generated')}
  onSave={() => flash('Saved & emailed')}
  complete={allRequiredDone}
/>
```

- [ ] **Step 6: Run full test suite**

```bash
npx vitest run
```
Expected: 70 tests pass (65 existing + 5 new ProgressBar tests).

- [ ] **Step 7: Production build check**

```bash
npm run build
```
Expected: clean build, no errors.

- [ ] **Step 8: Commit**

```bash
git add src/tests/ProgressBar.test.jsx src/components/ProgressBar.jsx src/App.jsx src/styles/app.css
git commit -m "feat: PDF button disabled until all required docs done, green when complete"
```

---

## Task 6: Release notes + push

**Files:**
- Create: `docs/release-notes/v1.2.0.md`

- [ ] **Step 1: Create release notes**

Create `docs/release-notes/v1.2.0.md`:

```markdown
# v1.2.0 — UI Polish

**Released:** 2026-05-19
**Branch:** feat/ui-polish
**Commits:** Task 1–5 of Tranche 1

## What's new

### Favicon
Blue "V" SVG favicon matches the brand mark in the top bar. Shows correctly in browser tabs and bookmarks.

### Fingerprint icon on biometrics
The biometrics document card now shows 🫆 next to the title in both Wizard and Board views.

### Countries trimmed to top 15
Dropdown reduced from 40 to 15 high-traffic destinations: Canada, USA, Schengen, UK, Australia, Japan, India, New Zealand, China, Singapore, South Korea, UAE, Thailand, Malaysia, Philippines.

### Theme toggle in TopBar
The floating Tweaks panel is removed. A compact ☀️/🌙/💻 button in the top bar cycles between Light, Dark, and System modes. System mode follows the OS preference and updates automatically when it changes. Density controls removed permanently.

### PDF button — progress-gated
The PDF button is disabled and greyed out until all **required** documents are marked Done. Once complete, it turns green (`#1F8A5B`) and becomes clickable. Optional documents (e.g. biometrics for non-biometric countries) do not block the PDF.

## Technical
| | |
|---|---|
| **Tests** | 70 tests, all passing (+5 ProgressBar tests) |
| **Breaking** | `tweaks.density` removed from store; `tweaks.theme` values changed from `'blue'/'green'/'mono'/'dark'` to `'light'/'dark'/'system'`. Existing localStorage is migrated automatically on load. |
```

- [ ] **Step 2: Commit and push**

```bash
git add docs/release-notes/v1.2.0.md
git commit -m "docs: add v1.2.0 release notes (Tranche 1 — UI polish)"
git push -u origin feat/ui-polish
```
