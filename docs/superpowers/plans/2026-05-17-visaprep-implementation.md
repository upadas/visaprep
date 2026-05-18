# VisaPrep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the VisaPrep Canada tourist visa document checklist app — wizard + board views, personalization rail, localStorage persistence — faithfully matching the high-fidelity prototype in `design_files/`.

**Architecture:** Single-page Vite + React app with Zustand for global state, all styles in a single CSS file derived from the prototype, and `@dnd-kit/core` for accessible board drag-and-drop. No backend — state persists to `localStorage` under the `vp-*` keys established by the prototype.

**Tech Stack:** Vite 6, React 19, Zustand 5, @dnd-kit/core 6, Vitest 3, @testing-library/react 16, Tailwind 4 (utility classes for layout only; design tokens are CSS custom properties)

**Design source:** `design_files/prototype/` — all component logic, copy, and CSS comes from these files. Do not invent behavior not present in the prototype.

---

## File Map

```
src/
  main.jsx                     entry — mounts App into #root
  App.jsx                      root — wires all pieces, keyboard nav
  data/
    docs.js                    DOCS array (10 documents)
    countries.js               COUNTRIES map (canada/usa/schengen)
  store/
    useStore.js                Zustand store — profile, statuses, files, current, view, country, tweaks
  styles/
    tokens.css                 ALL styles (extracted verbatim from prototype HTML)
  components/
    TopBar.jsx                 sticky header, country selector, nav links
    Rail.jsx                   personalization sidebar (passport/purpose/stay/party/history)
    ProgressBar.jsx            doc count + tab switcher + PDF + Save buttons + fill bar
    Toast.jsx                  bottom-center slide-up notification
    TweaksPanel.jsx            floating theme/density/view picker
  wizard/
    Wizard.jsx                 stepper pills + head + body + footer wired together
    DropZone.jsx               drag-or-click upload zone (mock — no real file I/O)
    FileCard.jsx               uploaded-file row with remove
    ChecksList.jsx             "What we'll verify" + "Why this matters" right column
  board/
    Board.jsx                  kanban container + dnd-kit DndContext
    BoardColumn.jsx            droppable column with count chip
    BoardCard.jsx              draggable card, click → wizard focus
  tests/
    docs.test.js               DOCS shape, all 10 present, required flags
    store.test.js              status transitions, reset, setters
    Wizard.test.jsx            renders step, stepper clicks, mark-done, skip
    Board.test.jsx             columns render, card click switches view
    Rail.test.jsx              profile field changes
```

---

## Task 1 — Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/test-setup.js`

- [ ] **Step 1: Initialise package.json**

```bash
cd /Users/lakshmi.p.mantravadi/src/BoringWebsites/CanadaVisa
npm init -y
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install react@^19 react-dom@^19 zustand@^5 @dnd-kit/core@^6
npm install -D vite@^6 @vitejs/plugin-react@^4 \
  vitest@^3 jsdom@^26 \
  @testing-library/react@^16 @testing-library/user-event@^14 @testing-library/jest-dom@^6 \
  tailwindcss@^4 autoprefixer@^10 postcss@^8
```

- [ ] **Step 3: Write vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VisaPrep — Canada Tourist Visa Checklist</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
</head>
<body data-theme="blue" data-density="default">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 5: Write src/test-setup.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Write src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/tokens.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

- [ ] **Step 7: Add scripts to package.json**

Replace the `"scripts"` block:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server on `http://localhost:5173` (white page — App not written yet, that's fine)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/test-setup.js
git commit -m "chore: scaffold Vite + React + Zustand + dnd-kit + Vitest"
```

---

## Task 2 — Design Tokens (CSS)

**Files:**
- Create: `src/styles/tokens.css`

All styles are extracted verbatim from `design_files/VisaPrep Wizard.html`. No Tailwind classes are used for visual design — only for structural layout helpers where needed.

- [ ] **Step 1: Create src/styles/tokens.css**

```css
/* ===== Tokens ===== */
:root {
  --bg: #F6F4EE;
  --surface: #FFFFFF;
  --surface-2: #F1ECE0;
  --ink: #0E1116;
  --ink-2: #3A4150;
  --muted: #6B7280;
  --line: #E3DDCE;
  --line-2: #D5CDB8;
  --brand: #0F4C81;
  --brand-2: #0B3B66;
  --brand-soft: #E5EEF6;
  --accent: #F4D35E;
  --ok: #1F8A5B;
  --warn: #C8821E;
  --err: #B0301B;
  --radius: 14px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 0 rgba(14,17,22,.04), 0 1px 2px rgba(14,17,22,.06);
  --shadow-md: 0 1px 0 rgba(14,17,22,.04), 0 8px 24px -8px rgba(14,17,22,.18);
  --shadow-lg: 0 24px 60px -20px rgba(14,17,22,.25), 0 1px 0 rgba(14,17,22,.04);
  --t: 220ms cubic-bezier(.2,.8,.2,1);
  --pad: 18px; --gap: 14px; --row: 52px;
}
[data-theme="green"] { --brand:#1F6F4A; --brand-2:#15553A; --brand-soft:#E4F0EA; }
[data-theme="mono"]  { --brand:#0E1116; --brand-2:#000; --brand-soft:#EFEEEA; }
[data-theme="dark"]  {
  --bg:#0E1116; --surface:#171B22; --surface-2:#1F242D;
  --ink:#F1EEE6; --ink-2:#C7CAD1; --muted:#8C93A1;
  --line:#262C36; --line-2:#323945;
  --brand:#5B9DD9; --brand-2:#7CB3E3; --brand-soft:#1A2A3A;
}
[data-density="compact"]  { --pad:14px; --gap:10px; --row:44px; }
[data-density="default"]  { --pad:18px; --gap:14px; --row:52px; }
[data-density="spacious"] { --pad:26px; --gap:20px; --row:64px; }

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Inter Tight", system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
}

/* ===== App shell ===== */
.app { min-height: 100vh; display: grid; grid-template-rows: auto 1fr; }

/* ===== TopBar ===== */
.topbar {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 20;
  backdrop-filter: saturate(140%) blur(8px);
}
.brand { display: flex; align-items: center; gap: 10px; font-family: "Instrument Serif", serif; font-size: 22px; letter-spacing: -0.01em; }
.brand-mark { width:28px; height:28px; border-radius:8px; background:var(--brand); display:grid; place-items:center; color:white; font-family:"Inter Tight"; font-weight:700; font-size:14px; }
.topbar nav { display: flex; gap: 4px; font-size: 14px; color: var(--ink-2); }
.topbar nav a { padding: 6px 10px; border-radius: 8px; color: inherit; text-decoration: none; }
.topbar nav a.active { background: var(--surface-2); color: var(--ink); }
.topbar .right { display: flex; align-items: center; gap: 10px; }

/* ===== Page header ===== */
.page-head { padding: 28px 32px 0; max-width: 1180px; margin: 0 auto; width: 100%; }
.crumbs { font-size: 13px; color: var(--muted); display: flex; gap: 6px; align-items: center; }
.crumbs a { color: inherit; text-decoration: none; }
.crumbs a:hover { color: var(--ink); }
.page-title { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-top: 10px; }
.page-title h1 { font-family: "Instrument Serif"; font-weight: 400; font-size: 44px; line-height: 1.05; letter-spacing: -0.015em; margin: 0; flex: 1; min-width: 0; }
.page-title h1 em { font-style: italic; color: var(--brand); }
.page-title .meta { font-size: 13px; color: var(--muted); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
.page-title .meta b { color: var(--ink); font-weight: 600; }
.page-body { padding: 22px 32px 80px; max-width: 1180px; margin: 0 auto; width: 100%; }

/* ===== Layout ===== */
.layout { display: grid; grid-template-columns: 260px minmax(0,1fr); gap: 20px; align-items: start; }
@media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }

/* ===== Rail ===== */
.rail { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; position: sticky; top: 80px; box-shadow: var(--shadow-sm); }
.rail h3 { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
.rail .sub { font-size: 12px; color: var(--muted); margin-bottom: 14px; }
.field { margin-top: 14px; }
.field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 600; display: block; }
.select, .input { width: 100%; margin-top: 6px; padding: 8px 10px; background: var(--bg); border: 1px solid var(--line-2); border-radius: var(--radius-sm); font: inherit; color: inherit; transition: border-color var(--t), box-shadow var(--t); }
.select:focus, .input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }
.seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; background: var(--bg); border: 1px solid var(--line-2); border-radius: var(--radius-sm); overflow: hidden; margin-top: 6px; }
.seg button { appearance: none; border: 0; background: transparent; padding: 6px 8px; font: inherit; color: var(--ink-2); cursor: pointer; transition: background var(--t),color var(--t); font-size: 13px; }
.seg button + button { border-left: 1px solid var(--line-2); }
.seg button[aria-pressed="true"] { background: var(--ink); color: white; }
.pillrow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.pillrow button { appearance: none; border: 1px solid var(--line-2); background: var(--bg); border-radius: 999px; padding: 4px 10px; font: inherit; font-size: 12px; color: var(--ink-2); cursor: pointer; transition: all var(--t); }
.pillrow button[aria-pressed="true"] { background: var(--ink); color: white; border-color: var(--ink); }
.rail .footer { margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--line-2); font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; gap: 10px; }

/* ===== Main column ===== */
.main { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

/* ===== Progress bar ===== */
.progress-bar { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px 18px; box-shadow: var(--shadow-sm); }
.progress-bar .row1 { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.progress-bar .row1 .left { display: flex; align-items: baseline; gap: 10px; }
.progress-bar .row1 .left .count { font-family: "Instrument Serif"; font-size: 28px; line-height: 1; }
.progress-bar .row1 .left .of { font-size: 14px; color: var(--muted); }
.progress-bar .row1 .actions { display: flex; gap: 8px; }
.bar { height: 8px; background: var(--surface-2); border-radius: 999px; overflow: hidden; margin-top: 12px; }
.bar > i { display: block; height: 100%; background: var(--brand); transition: width 600ms cubic-bezier(.2,.8,.2,1); }

/* ===== Tabs ===== */
.tabs { display: flex; gap: 4px; background: var(--surface-2); border: 1px solid var(--line); padding: 4px; border-radius: 999px; width: fit-content; }
.tabs button { appearance: none; border: 0; background: transparent; padding: 7px 14px; border-radius: 999px; font: inherit; font-size: 13px; color: var(--ink-2); cursor: pointer; transition: all var(--t); display: flex; align-items: center; gap: 6px; }
.tabs button[aria-selected="true"] { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }

/* ===== Buttons ===== */
.btn { appearance: none; border: 1px solid var(--line-2); background: var(--surface); border-radius: var(--radius-sm); padding: 8px 14px; font: inherit; font-size: 14px; font-weight: 500; color: var(--ink); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all var(--t); }
.btn:hover { background: var(--surface-2); }
.btn.primary { background: var(--brand); color: white; border-color: var(--brand); }
.btn.primary:hover { background: var(--brand-2); border-color: var(--brand-2); }
.btn.ghost { background: transparent; border-color: transparent; }
.btn.ghost:hover { background: var(--surface-2); }
.btn.sm { padding: 5px 10px; font-size: 13px; }
.btn.icon { padding: 7px 8px; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

/* ===== Wizard ===== */
.wizard { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); }
.stepper { display: flex; gap: 4px; flex-wrap: wrap; padding: 16px 24px 0; }
.stepper .stp { flex: 1 1 24px; height: 4px; border-radius: 999px; background: var(--surface-2); transition: background var(--t); cursor: pointer; }
.stepper .stp.done { background: var(--brand); }
.stepper .stp.cur  { background: var(--brand); box-shadow: 0 0 0 4px var(--brand-soft); }
.wiz-head { padding: 20px 24px 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.wiz-head .step-of { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
.wiz-head h2 { font-family: "Instrument Serif"; font-weight: 400; font-size: 32px; line-height: 1.1; letter-spacing: -0.01em; margin: 6px 0 0; }
.wiz-head .desc { color: var(--ink-2); margin-top: 8px; max-width: 60ch; font-size: 14px; }
.badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; padding: 3px 8px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--line-2); color: var(--ink-2); text-transform: uppercase; letter-spacing: 0.06em; }
.badge.req { background: #FBE9E5; border-color: #F0C9C0; color: #82200F; }
.badge.rec { background: var(--brand-soft); color: var(--brand-2); }
.wiz-body { padding: 24px; display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
@media (max-width: 880px) { .wiz-body { grid-template-columns: 1fr; } }
.wiz-foot { border-top: 1px solid var(--line); padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--surface); }
.wiz-foot .left, .wiz-foot .right { display: flex; gap: 8px; align-items: center; }

/* ===== Drop zone ===== */
.drop { border: 1.5px dashed var(--line-2); border-radius: var(--radius); padding: 28px 24px; background: var(--bg); text-align: center; transition: all var(--t); cursor: pointer; }
.drop:hover, .drop.over { border-color: var(--brand); background: var(--brand-soft); }
.drop .icon { width:44px; height:44px; border-radius:50%; background:var(--surface); border:1px solid var(--line-2); display:grid; place-items:center; margin:0 auto 10px; font-size:18px; }
.drop h4 { margin: 0; font-size: 16px; }
.drop p  { margin: 4px 0 12px; font-size: 13px; color: var(--muted); }

/* ===== File card ===== */
.file { display:flex; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-sm); padding:10px 12px; margin-top:10px; }
.file .ico  { width:32px; height:32px; border-radius:6px; background:var(--brand-soft); color:var(--brand); display:grid; place-items:center; font-weight:600; font-size:11px; }
.file .info { flex:1; min-width:0; }
.file .name { font-size:14px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.file .meta { font-size:12px; color:var(--muted); }
.file .ok   { color:var(--ok); font-size:18px; }

/* ===== Checks ===== */
.checks { background:var(--surface-2); border-radius:var(--radius-sm); padding:14px 16px; }
.checks h4  { margin:0 0 8px; font-size:13px; font-weight:600; }
.checks ul  { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--ink-2); }
.checks li  { display:flex; align-items:flex-start; gap:8px; line-height:1.4; }
.checks li::before { content:""; width:16px; height:16px; border-radius:50%; flex:0 0 16px; background:var(--surface) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M3 8.5l3 3 7-7' fill='none' stroke='%231F8A5B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>") center/12px no-repeat; border:1px solid var(--line-2); margin-top:1px; }
.checks li.warn::before { background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 4v5M8 11v.5' fill='none' stroke='%23C8821E' stroke-width='2' stroke-linecap='round'/></svg>"); border-color:#E2C58A; background-color:#FFF6E0; }
.right-card { background:var(--bg); border:1px solid var(--line); border-radius:var(--radius); padding:16px; }
.right-card h4 { margin:0 0 8px; font-size:13px; font-weight:600; }

/* ===== Kanban ===== */
.kanban { background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:16px; box-shadow:var(--shadow-md); }
.kan-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:12px; }
.kan-head h3 { margin:0; font-family:"Instrument Serif"; font-size:22px; font-weight:400; }
.kan-cols { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
@media (max-width: 880px) { .kan-cols { grid-template-columns: 1fr; } }
.kan-col { background:var(--bg); border:1px solid var(--line); border-radius:var(--radius-sm); padding:12px; min-height:320px; }
.kan-col h4 { margin:0 0 10px; font-size:13px; font-weight:600; display:flex; justify-content:space-between; align-items:center; }
.kan-col h4 .num { font-size:11px; color:var(--muted); font-weight:500; background:var(--surface); border:1px solid var(--line-2); border-radius:999px; padding:1px 8px; }
.kan-card { background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:8px; cursor:grab; box-shadow:var(--shadow-sm); transition:transform var(--t),box-shadow var(--t); }
.kan-card:hover { transform:translateY(-1px); box-shadow:var(--shadow-md); }
.kan-card .t { font-size:14px; font-weight:500; }
.kan-card .m { font-size:12px; color:var(--muted); margin-top:2px; line-height:1.4; }
.kan-card .footer { display:flex; gap:6px; align-items:center; margin-top:8px; font-size:11px; color:var(--muted); }
.kan-card .dot { width:6px; height:6px; border-radius:50%; background:var(--muted); }
.kan-card .dot.req { background:var(--err); }
.kan-card .dot.rec { background:var(--brand); }

/* ===== Tweaks ===== */
.tweaks { position:fixed; right:18px; bottom:18px; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow-lg); padding:14px; width:260px; font-size:13px; z-index:30; }
.tweaks h4 { margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); }
.tweaks .row { display:flex; justify-content:space-between; align-items:center; margin:8px 0; }
.tweaks .row label { font-weight:500; }
.tweaks .swatches { display:flex; gap:6px; }
.swatch { width:22px; height:22px; border-radius:50%; border:2px solid transparent; cursor:pointer; transition:border-color var(--t); }
.swatch[aria-pressed="true"] { border-color:var(--ink); }
.tweaks-toggle { position:fixed; right:18px; bottom:18px; background:var(--ink); color:white; border:0; border-radius:999px; padding:10px 14px; font:inherit; font-size:13px; font-weight:500; cursor:pointer; box-shadow:var(--shadow-md); z-index:30; display:flex; align-items:center; gap:6px; }

/* ===== Toast ===== */
.toast { position:fixed; left:50%; bottom:24px; transform:translateX(-50%) translateY(20px); background:var(--ink); color:var(--bg); padding:10px 16px; border-radius:999px; font-size:13px; box-shadow:var(--shadow-lg); opacity:0; transition:all var(--t); z-index:40; pointer-events:none; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

/* ===== Misc ===== */
.kbd { font-family:"JetBrains Mono"; font-size:11px; background:var(--surface-2); border:1px solid var(--line-2); border-radius:4px; padding:1px 5px; color:var(--ink-2); }
@keyframes fadein { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:none; } }
.fade { animation: fadein 320ms cubic-bezier(.2,.8,.2,1) both; }

/* ===== Responsive ===== */
@media (max-width: 700px) {
  .page-head, .page-body { padding-left: 16px; padding-right: 16px; }
  .page-title h1 { font-size: 32px; }
  .topbar nav { display: none; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add design tokens and component CSS extracted from prototype"
```

---

## Task 3 — Data Layer

**Files:**
- Create: `src/data/docs.js`
- Create: `src/data/countries.js`
- Create: `src/tests/docs.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/tests/docs.test.js
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
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test
```
Expected: FAIL — `../data/docs` not found

- [ ] **Step 3: Write src/data/docs.js** (copied from `design_files/prototype/data.jsx`, converted to ES module)

```js
export const DOCS = [
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
      { ok: false, text: 'Signature page included (we\'ll prompt if missing)' },
    ],
    tips: [
      'Scan in colour at 300 DPI minimum.',
      'Don\'t cover the machine-readable strip.',
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
    tips: ['Use Adobe Reader, not browser preview, or barcodes won\'t generate.'],
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
      'Net banking PDFs work — make sure they\'re not screenshot images.',
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
    tips: ['Use refundable bookings or hold-only fares — IRCC accepts reservations.'],
  },
  {
    id: 'invitation',
    title: 'Letter of invitation',
    summary: 'If staying with family or friends in Canada — notarized.',
    required: false,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Host\'s status (citizen / PR) declared' },
      { ok: true,  text: 'Relationship described' },
      { ok: false, text: 'Notarization stamp visible' },
    ],
    tips: ['Skip if you\'re staying in hotels.'],
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
    tips: ['Self-employed? Substitute with business registration + GST returns.'],
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
    summary: 'CAD $85 fee, taken at a VAC within 30 days of application.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true, text: 'Receipt dated within 30 days' },
      { ok: true, text: 'Biometric Instruction Letter (BIL) attached' },
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
```

- [ ] **Step 4: Write src/data/countries.js**

```js
export const COUNTRIES = {
  canada:   { flag: '🇨🇦', name: 'Canada',        visa: 'Tourist Visa (TRV)',  fee: 'CAD $100', proc: '29 days avg.' },
  usa:      { flag: '🇺🇸', name: 'United States', visa: 'B1/B2 Visitor',       fee: 'USD $185', proc: '8–12 weeks'   },
  schengen: { flag: '🇪🇺', name: 'Schengen',      visa: 'Type C Short-Stay',   fee: 'EUR €90',  proc: '15 days avg.' },
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```
Expected: 6 tests pass

- [ ] **Step 6: Commit**

```bash
git add src/data/ src/tests/docs.test.js
git commit -m "feat: add docs and countries data with tests"
```

---

## Task 4 — Zustand Store

**Files:**
- Create: `src/store/useStore.js`
- Create: `src/tests/store.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/tests/store.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store/useStore'
import { act } from '@testing-library/react'

// Access store state directly (Zustand supports this outside React)
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
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test src/tests/store.test.js
```
Expected: FAIL — `../store/useStore` not found

- [ ] **Step 3: Write src/store/useStore.js**

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
    document.body.dataset[key] = value
    return { tweaks }
  }),

  resetProgress: () => set(() => {
    try { localStorage.removeItem(LS_STATUS); localStorage.removeItem(LS_FILES) } catch {}
    return { statuses: {}, files: {}, current: 0 }
  }),
}))

// Expose for tests
useStore.getInitialState = () => ({ ...INITIAL, statuses: {}, files: {}, tweaks: INITIAL.tweaks })
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test src/tests/store.test.js
```
Expected: 9 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/store/useStore.js src/tests/store.test.js
git commit -m "feat: add Zustand store with localStorage persistence and tests"
```

---

## Task 5 — TopBar, Rail, Toast

**Files:**
- Create: `src/components/TopBar.jsx`
- Create: `src/components/Rail.jsx`
- Create: `src/components/Toast.jsx`
- Create: `src/tests/Rail.test.jsx`

- [ ] **Step 1: Write the failing Rail test**

```jsx
// src/tests/Rail.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Rail from '../components/Rail'

const defaultProfile = { passport: 'India', purpose: 'Tourism', stay: '14 days', party: 'Family', history: 'No' }

describe('Rail', () => {
  it('renders Personalize heading', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    expect(screen.getByText('Personalize')).toBeInTheDocument()
  })

  it('shows current purpose as pressed', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    expect(screen.getByRole('button', { name: 'Tourism' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Family' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls setProfile when purpose pill clicked', async () => {
    const user = userEvent.setup()
    const setProfile = vi.fn()
    render(<Rail profile={defaultProfile} setProfile={setProfile} />)
    await user.click(screen.getByRole('button', { name: 'Business' }))
    expect(setProfile).toHaveBeenCalledWith({ ...defaultProfile, purpose: 'Business' })
  })

  it('shows Solo/Family/Group for travelling with', () => {
    render(<Rail profile={defaultProfile} setProfile={() => {}} />)
    expect(screen.getByRole('button', { name: 'Solo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Group' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test src/tests/Rail.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Write src/components/TopBar.jsx**

```jsx
import { COUNTRIES } from '../data/countries'

export default function TopBar({ country, onCountry }) {
  const c = COUNTRIES[country]
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="brand">
          <div className="brand-mark">V</div>
          VisaPrep
        </div>
        <nav>
          <a href="#" className="active">Application</a>
          <a href="#">Guides</a>
          <a href="#">Documents</a>
          <a href="#">Help</a>
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
        <button className="btn">Sign in</button>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Write src/components/Rail.jsx**

```jsx
const PURPOSES   = ['Tourism', 'Family', 'Business', 'Transit']
const PARTIES    = ['Solo', 'Family', 'Group']
const HISTORIES  = [
  { value: 'No',           label: 'No' },
  { value: 'Yes — approved', label: 'Yes ✓' },
  { value: 'Yes — refused',  label: 'Yes ✕' },
]

export default function Rail({ profile, setProfile }) {
  const set = (k, v) => setProfile({ ...profile, [k]: v })
  return (
    <aside className="rail">
      <h3>Personalize</h3>
      <div className="sub">Your list adapts as you change these.</div>

      <div className="field">
        <label>Passport country</label>
        <select className="select" value={profile.passport} onChange={(e) => set('passport', e.target.value)}>
          {['India', 'Nigeria', 'Philippines', 'Brazil', 'Vietnam', 'Ukraine'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Purpose</label>
        <div className="pillrow">
          {PURPOSES.map((p) => (
            <button key={p} aria-pressed={profile.purpose === p} onClick={() => set('purpose', p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Length of stay</label>
        <input className="input" value={profile.stay} onChange={(e) => set('stay', e.target.value)} />
      </div>

      <div className="field">
        <label>Travelling with</label>
        <div className="seg">
          {PARTIES.map((p) => (
            <button key={p} aria-pressed={profile.party === p} onClick={() => set('party', p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Have you applied before?</label>
        <div className="seg">
          {HISTORIES.map(({ value, label }) => (
            <button key={value} aria-pressed={profile.history === value} onClick={() => set('history', value)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="footer">
        <span>Auto-saved</span>
        <span className="kbd">⌘ S</span>
      </div>
    </aside>
  )
}
```

- [ ] **Step 5: Write src/components/Toast.jsx**

```jsx
export default function Toast({ msg, show }) {
  return <div className={'toast' + (show ? ' show' : '')}>{msg}</div>
}
```

- [ ] **Step 6: Run Rail tests to verify they pass**

```bash
npm test src/tests/Rail.test.jsx
```
Expected: 4 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/components/TopBar.jsx src/components/Rail.jsx src/components/Toast.jsx src/tests/Rail.test.jsx
git commit -m "feat: add TopBar, Rail, Toast components with tests"
```

---

## Task 6 — ProgressBar + TweaksPanel

**Files:**
- Create: `src/components/ProgressBar.jsx`
- Create: `src/components/TweaksPanel.jsx`

- [ ] **Step 1: Write src/components/ProgressBar.jsx**

```jsx
export default function ProgressBar({ done, total, view, setView, onPdf, onSave }) {
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
          <button className="btn" onClick={onPdf}>⤓ PDF</button>
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

- [ ] **Step 2: Write src/components/TweaksPanel.jsx**

```jsx
import { useState } from 'react'

const THEMES = [
  { id: 'blue',  color: '#0F4C81' },
  { id: 'green', color: '#1F6F4A' },
  { id: 'mono',  color: '#0E1116' },
  { id: 'dark',  color: '#5B9DD9', bg: '#0E1116' },
]

export default function TweaksPanel({ tweaks, setTweak }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button className="tweaks-toggle" onClick={() => setOpen(true)}>
        ✦ Tweaks
      </button>
    )
  }

  return (
    <div className="tweaks">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Tweaks</h4>
        <button className="btn ghost icon sm" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="row">
        <label>Theme</label>
        <div className="swatches">
          {THEMES.map((s) => (
            <button
              key={s.id}
              className="swatch"
              aria-pressed={tweaks.theme === s.id}
              aria-label={s.id}
              style={{ background: s.bg ? `linear-gradient(135deg, ${s.bg} 50%, ${s.color} 50%)` : s.color }}
              onClick={() => setTweak('theme', s.id)}
            />
          ))}
        </div>
      </div>

      <div className="row">
        <label>Density</label>
        <div className="seg" style={{ margin: 0, width: 180 }}>
          {['compact', 'default', 'spacious'].map((d) => (
            <button key={d} aria-pressed={tweaks.density === d} onClick={() => setTweak('density', d)}>
              {d[0].toUpperCase() + d.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProgressBar.jsx src/components/TweaksPanel.jsx
git commit -m "feat: add ProgressBar and TweaksPanel components"
```

---

## Task 7 — Wizard Sub-Components

**Files:**
- Create: `src/wizard/DropZone.jsx`
- Create: `src/wizard/FileCard.jsx`
- Create: `src/wizard/ChecksList.jsx`
- Create: `src/tests/Wizard.test.jsx`

- [ ] **Step 1: Write the failing Wizard test**

```jsx
// src/tests/Wizard.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DropZone from '../wizard/DropZone'
import FileCard from '../wizard/FileCard'
import ChecksList from '../wizard/ChecksList'

describe('DropZone', () => {
  it('renders browse prompt', () => {
    render(<DropZone fileTypes="PDF · JPG" onUpload={() => {}} />)
    expect(screen.getByText(/Drop your file here/)).toBeInTheDocument()
  })

  it('calls onUpload when Choose file clicked', async () => {
    const user = userEvent.setup()
    const onUpload = vi.fn()
    render(<DropZone fileTypes="PDF" onUpload={onUpload} />)
    await user.click(screen.getByRole('button', { name: /Choose file/ }))
    expect(onUpload).toHaveBeenCalled()
  })
})

describe('FileCard', () => {
  const file = { name: 'passport.pdf', size: '1.4 MB · 8 pages', at: 'just now' }

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
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test src/tests/Wizard.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Write src/wizard/DropZone.jsx**

```jsx
import { useState } from 'react'

export default function DropZone({ fileTypes, onUpload }) {
  const [over, setOver] = useState(false)
  return (
    <div
      className={'drop' + (over ? ' over' : '')}
      onClick={onUpload}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onUpload() }}
    >
      <div className="icon">↑</div>
      <h4>Drop your file here, or click to browse</h4>
      <p>{fileTypes} · max 10 MB · stays on your device</p>
      <button className="btn" onClick={(e) => { e.stopPropagation(); onUpload() }}>Choose file</button>
    </div>
  )
}
```

- [ ] **Step 4: Write src/wizard/FileCard.jsx**

```jsx
export default function FileCard({ file, checksCount, checksPassed, onRemove }) {
  return (
    <div>
      <div className="file">
        <div className="ico">PDF</div>
        <div className="info">
          <div className="name">{file.name}</div>
          <div className="meta">{file.size} · {file.at}</div>
        </div>
        <span className="ok">✓</span>
        <button className="btn ghost sm" onClick={onRemove}>Remove</button>
      </div>
      {checksCount != null && (
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{checksPassed} of {checksCount}</b> automatic checks pass.
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Write src/wizard/ChecksList.jsx**

```jsx
export default function ChecksList({ checks, hasFile, required }) {
  return (
    <aside>
      <div className="checks">
        <h4>What we'll verify</h4>
        <ul>
          {checks.map((c, i) => (
            <li key={i} className={hasFile && !c.ok ? 'warn' : ''}>{c.text}</li>
          ))}
        </ul>
      </div>
      <div className="right-card" style={{ marginTop: 12 }}>
        <h4>Why this matters</h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {required
            ? 'This is one of the documents IRCC checks first. A missing or unclear file here can stall your application by weeks.'
            : 'Optional, but strengthens your file. Skip if it doesn\'t apply to you.'}
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test src/tests/Wizard.test.jsx
```
Expected: 7 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/wizard/DropZone.jsx src/wizard/FileCard.jsx src/wizard/ChecksList.jsx src/tests/Wizard.test.jsx
git commit -m "feat: add wizard sub-components (DropZone, FileCard, ChecksList) with tests"
```

---

## Task 8 — Wizard Container

**Files:**
- Create: `src/wizard/Wizard.jsx`

- [ ] **Step 1: Write src/wizard/Wizard.jsx**

```jsx
import DropZone from './DropZone'
import FileCard from './FileCard'
import ChecksList from './ChecksList'

export default function Wizard({ docs, statuses, current, setCurrent, setStatus, files, setFiles }) {
  const total = docs.length
  const doc   = docs[current]
  const file  = files[doc.id]

  const goto = (i) => setCurrent(Math.max(0, Math.min(total - 1, i)))

  const onUpload = () =>
    setFiles({ ...files, [doc.id]: { name: doc.id + '.pdf', size: '1.4 MB · 8 pages', at: 'just now' } })

  const onRemove = () => {
    const next = { ...files }
    delete next[doc.id]
    setFiles(next)
  }

  const markDone = () => {
    setStatus(doc.id, 'done')
    if (current < total - 1) setCurrent(current + 1)
  }

  const skip = () => {
    setStatus(doc.id, 'skipped')
    if (current < total - 1) setCurrent(current + 1)
  }

  const saveForLater = () => {
    setStatus(doc.id, 'todo')
    if (current < total - 1) setCurrent(current + 1)
  }

  return (
    <section className="wizard fade" key={doc.id}>
      {/* Stepper */}
      <div className="stepper">
        {docs.map((d, i) => {
          const s = statuses[d.id]
          const cls = i === current ? 'stp cur' : s === 'done' ? 'stp done' : 'stp'
          return <div key={d.id} className={cls} onClick={() => goto(i)} title={d.title} />
        })}
      </div>

      {/* Head */}
      <div className="wiz-head">
        <div>
          <div className="step-of">Step {current + 1} of {total}</div>
          <h2>{doc.title}</h2>
          <p className="desc">{doc.summary}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className={'badge ' + (doc.required ? 'req' : 'rec')}>
            {doc.required ? 'Required' : 'Recommended'}
          </span>
          <span className="badge">{doc.fileTypes}</span>
        </div>
      </div>

      {/* Body */}
      <div className="wiz-body">
        <div>
          {!file
            ? <DropZone fileTypes={doc.fileTypes} onUpload={onUpload} />
            : <FileCard
                file={file}
                checksCount={doc.checks.length}
                checksPassed={doc.checks.filter((c) => c.ok).length}
                onRemove={onRemove}
              />
          }
          {doc.tips.length > 0 && (
            <div className="checks" style={{ marginTop: 14, background: 'var(--brand-soft)' }}>
              <h4 style={{ color: 'var(--brand-2)' }}>Tips from immigration consultants</h4>
              <ul>
                {doc.tips.map((t, i) => <li key={i}>💡 {t}</li>)}
              </ul>
            </div>
          )}
        </div>
        <ChecksList checks={doc.checks} hasFile={!!file} required={doc.required} />
      </div>

      {/* Footer */}
      <div className="wiz-foot">
        <div className="left">
          <button className="btn" disabled={current === 0} onClick={() => goto(current - 1)}>← Back</button>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            <span className="kbd">←</span> <span className="kbd">→</span> to navigate
          </span>
        </div>
        <div className="right">
          {!doc.required && (
            <button className="btn ghost sm" onClick={skip}>Skip — doesn't apply</button>
          )}
          <button className="btn" onClick={saveForLater}>Save for later</button>
          <button className="btn primary" onClick={markDone}>
            {current === total - 1 ? 'Finish ✓' : 'Mark done & continue →'}
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/wizard/Wizard.jsx
git commit -m "feat: add Wizard container component"
```

---

## Task 9 — Board (Kanban) with dnd-kit

**Files:**
- Create: `src/board/BoardCard.jsx`
- Create: `src/board/BoardColumn.jsx`
- Create: `src/board/Board.jsx`
- Create: `src/tests/Board.test.jsx`

- [ ] **Step 1: Write the failing Board test**

```jsx
// src/tests/Board.test.jsx
import { render, screen } from '@testing-library/react'
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
    const user = userEvent.setup()
    const setCurrent = vi.fn()
    const setView    = vi.fn()
    render(<Board docs={DOCS} statuses={{}} setStatus={() => {}} setCurrent={setCurrent} setView={setView} />)
    await user.click(screen.getByText('Valid passport'))
    expect(setCurrent).toHaveBeenCalledWith(0)
    expect(setView).toHaveBeenCalledWith('wizard')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test src/tests/Board.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Write src/board/BoardCard.jsx**

```jsx
import { useDraggable } from '@dnd-kit/core'

export default function BoardCard({ doc, index, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: doc.id })
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0.5 : 1 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kan-card"
      {...listeners}
      {...attributes}
      onClick={onClick}
    >
      <div className="t">{doc.title}</div>
      <div className="m">{doc.summary}</div>
      <div className="footer">
        <span className={'dot ' + (doc.required ? 'req' : 'rec')} />
        <span>{doc.required ? 'Required' : 'Recommended'}</span>
        <span style={{ marginLeft: 'auto' }}>{doc.fileTypes.split(' · ')[0]}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write src/board/BoardColumn.jsx**

```jsx
import { useDroppable } from '@dnd-kit/core'
import BoardCard from './BoardCard'

const EMPTY = {
  todo:  'All clear!',
  doing: 'Drag a card here when you start working on it.',
  done:  'Nothing here yet.',
}

export default function BoardColumn({ colId, label, docs, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: colId })
  return (
    <div
      ref={setNodeRef}
      className="kan-col"
      style={isOver ? { borderColor: 'var(--brand)' } : undefined}
    >
      <h4>
        <span>{label}</span>
        <span className="num">{docs.length}</span>
      </h4>
      {docs.map((doc, i) => (
        <BoardCard key={doc.id} doc={doc} index={i} onClick={() => onCardClick(doc)} />
      ))}
      {docs.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
          {EMPTY[colId]}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Write src/board/Board.jsx**

```jsx
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import BoardColumn from './BoardColumn'

const COLS = [
  { id: 'todo',  label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done',  label: 'Done' },
]

export default function Board({ docs, statuses, setStatus, setCurrent, setView }) {
  const sensors = useSensors(useSensor(PointerSensor))

  const docsForCol = (colId) =>
    docs.filter((d) => {
      const s = statuses[d.id] || 'todo'
      if (colId === 'todo') return s === 'todo' || s === 'skipped'
      return s === colId
    })

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setStatus(active.id, over.id)
    }
  }

  const onCardClick = (doc) => {
    const i = docs.findIndex((d) => d.id === doc.id)
    setCurrent(i)
    setView('wizard')
  }

  return (
    <section className="kanban fade">
      <div className="kan-head">
        <h3>Application board</h3>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Drag cards between columns. Click any card to open it.
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="kan-cols">
          {COLS.map((col) => (
            <BoardColumn
              key={col.id}
              colId={col.id}
              label={col.label}
              docs={docsForCol(col.id)}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </DndContext>
    </section>
  )
}
```

- [ ] **Step 6: Run Board tests to verify they pass**

```bash
npm test src/tests/Board.test.jsx
```
Expected: 4 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/board/ src/tests/Board.test.jsx
git commit -m "feat: add Board/kanban view with dnd-kit drag-and-drop and tests"
```

---

## Task 10 — App Root + Persistence Wiring

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Write src/App.jsx**

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

  const c = COUNTRIES[country]
  const done  = DOCS.filter((d) => statuses[d.id] === 'done').length
  const total = DOCS.length

  // Apply theme/density to body on mount and tweak change
  useEffect(() => {
    document.body.dataset.theme   = tweaks.theme
    document.body.dataset.density = tweaks.density
  }, [tweaks.theme, tweaks.density])

  // Keyboard navigation (wizard only)
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

  // Toast
  const [toast, setToast] = useState({ msg: '', show: false })
  const flash = useCallback((msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }, [])

  const handleCountry = (val) => { setCountry(val); flash('Switched country') }
  const handleReset   = () => { resetProgress(); flash('Progress reset') }

  return (
    <div className="app">
      <TopBar country={country} onCountry={handleCountry} />

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
    </div>
  )
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```
Expected: All tests pass (20+)

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- [ ] Page renders with TopBar, Rail, progress bar, Wizard step 1
- [ ] Clicking "Choose file" shows the file card
- [ ] Stepper pills advance on "Mark done & continue"
- [ ] Switching to Board view shows three columns
- [ ] Toast appears on country switch, PDF click, Save, Reset
- [ ] Tweaks panel opens and theme/density changes apply
- [ ] Refresh retains progress (localStorage)

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire App root — full wizard + board + persistence"
```

---

## Task 11 — Final Polish + Push

**Files:** No new files — verify, test, push.

- [ ] **Step 1: Run full test suite one final time**

```bash
npm test
```
Expected: All pass, zero failures

- [ ] **Step 2: Build to catch any bundler errors**

```bash
npm run build
```
Expected: `dist/` created with no errors

- [ ] **Step 3: Final git push**

```bash
git push origin main
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered by |
|---|---|
| Wizard view (stepper, head, body, footer) | Task 8 — Wizard.jsx |
| Board / kanban view | Task 9 — Board, BoardColumn, BoardCard |
| Personalization rail | Task 5 — Rail.jsx |
| Progress bar + tab switcher | Task 6 — ProgressBar.jsx |
| TopBar + country selector | Task 5 — TopBar.jsx |
| Design tokens + themes | Task 2 — tokens.css |
| localStorage persistence | Task 4 — useStore.js |
| Keyboard navigation ← → | Task 10 — App.jsx useEffect |
| Drag-and-drop (dnd-kit) | Task 9 — Board.jsx + BoardCard.jsx |
| Toast notifications | Task 5 — Toast.jsx, Task 10 — flash() |
| Tweaks panel (theme/density) | Task 6 — TweaksPanel.jsx |
| Animations (.fade) | Task 2 — tokens.css @keyframes fadein |
| Responsive breakpoints | Task 2 — tokens.css @media queries |
| DropZone hover/drag-over | Task 7 — DropZone.jsx |
| File card with remove | Task 7 — FileCard.jsx |
| Check states (ok/warn) | Task 7 — ChecksList.jsx |
| Required vs Recommended badges | Task 8 — Wizard.jsx |
| Skip / Save for later | Task 8 — Wizard.jsx |
| All 10 documents | Task 3 — docs.js |
| Canada / USA / Schengen countries | Task 3 — countries.js |

No gaps found.
