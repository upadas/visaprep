# Handoff: Visa Application Wizard

## Overview

VisaPrep is a consumer web app for travellers preparing visa applications. The core surface is a **document checklist tool** that turns the typical static "what you need" page into a stateful, personalised flow.

This handoff covers the **central tool**: a wizard that walks users through their visa documents one at a time, with a board (kanban) view as an alternative for users who prefer to see everything at once. Both views read and write to the same underlying state, so a user can switch freely.

The page sits inside a larger product (auth, dashboard, multi-country support) but this handoff is scoped to the **checklist tool itself** plus the page chrome it lives in (top bar, page header, personalisation rail, progress bar, tab switcher).

## Screenshots

For quick reference. The HTML prototype in `design_files/` is the source of truth — these are reference renderings only.

| # | File | Shows |
|---|---|---|
| 1 | `screenshots/01-wizard-top.png` | Top of the page — chrome, title, progress bar, start of wizard step 1 |
| 2 | `screenshots/02-wizard-body.png` | Wizard body — drop zone, "What we'll verify" panel, tips card |
| 3 | `screenshots/03-wizard-footer.png` | Wizard footer — Back/Save/Continue, keyboard hint, reset link |
| 4 | `screenshots/04-wizard-progress.png` | Mid-progress state — 3/10 done, step 4 with uploaded file, verification checks (pass + warn) |
| 5 | `screenshots/05-board.png` | Board (kanban) view — To do / In progress / Done columns with cards |
| 6 | `screenshots/06-theme-dark.png` | Dark theme variant of the same page |

## About the Design Files

The files in `design_files/` are **design references created in HTML/React** — clickable prototypes showing the intended look, behavior, copy, and state transitions. They are **not** intended to be deployed or copied directly into production.

The task is to **recreate these designs in the target codebase's existing environment** (React/Next.js, Vue/Nuxt, Remix, etc.) using that codebase's established patterns: component library, design tokens, routing, state management, persistence layer, and styling system. If no environment exists yet, the recommended starting point is **Next.js + Tailwind + shadcn/ui + Zustand or React Query** — but anything modern that gives you composable components and good keyboard handling will work.

The prototype uses inline JSX with React 18, plain CSS variables for theming, and `localStorage` for persistence. None of those choices are prescriptive — they're just the simplest path to a faithful mock.

## Fidelity

**High-fidelity.** The prototype represents the intended final look: colors, typography, spacing, border-radius, shadows, micro-interactions, and copy are all production-intent. The developer should recreate this UI pixel-faithfully (within ~2px), then layer in the codebase's existing design tokens where they conflict with what's here.

The one explicit area for developer judgement is the **drag-and-drop interaction in the kanban view**. The prototype uses raw HTML5 drag events for the mock; production should use a more accessible library (e.g., `@dnd-kit/core`) with keyboard support.

## Screens / Views

There are **two views of the same data**, switchable via tabs in the progress bar: **Wizard** and **Board**. The page chrome around them is shared.

### Shared page chrome

**Top bar** (sticky, 56px tall, `--surface` bg, 1px `--line` bottom border)
- Left: VisaPrep wordmark — 28×28px square mark (`--brand` bg, white "V", 8px radius, Inter Tight 700 14px), followed by "VisaPrep" in Instrument Serif 22px.
- Center-left nav: four links — Application (active), Guides, Documents, Help. Active link has `--surface-2` background, 8px radius, 6/10px padding. Inactive: `--ink-2` color.
- Right: Country selector (160px native select, --bg fill, --line-2 border), help icon button, "Sign in" button.

**Page header** (max-width 1180px centered, 28px top padding)
- Breadcrumbs: 13px, `--muted`, with `›` separators. Final crumb is `--ink`.
- Title row, flex space-between, baseline-aligned:
  - H1 in Instrument Serif 44px, line-height 1.05, letter-spacing -0.015em. Two lines: "🇨🇦 Canada tourist visa" with "Canada" wrapped in `<em>` (italic, `--brand` color), then a second line "document checklist" in `--muted`.
  - Meta block on right: three pieces "Fee · CAD $100" · "Processing · 29 days" · "Updated · May 2026" — label `--muted`, value `--ink` bold, 13px.

**Personalisation rail** (280px wide, sticky at top:80px, `--surface` bg, 1px `--line` border, 14px radius, 18px padding, `--shadow-sm`)
- Heading "Personalize" (14px 600) + sub "Your list adapts as you change these." (12px `--muted`).
- Five fields, each with an 11px uppercase 0.08em-tracked label in `--muted`:
  1. **Passport country** — native select, full-width.
  2. **Purpose** — pill group: Tourism / Family / Business / Transit. Selected pill has `--ink` bg, white text. Unselected: `--bg` bg, `--line-2` border, `--ink-2` text. 999px radius, 4/10px padding, 12px.
  3. **Length of stay** — text input.
  4. **Travelling with** — segmented control (3 buttons in a single rounded rect, dividers between). Selected: `--ink` bg, white text.
  5. **Have you applied before?** — segmented control with three options.
- Footer (top dashed border): "Auto-saved" + "⌘S" kbd hint, both 12px `--muted`.

**Progress bar** (above the wizard/board, `--surface` bg, 1px `--line` border, 14px radius, 16/18 padding, `--shadow-sm`)
- Top row, flex space-between:
  - Left: Big count "3" in Instrument Serif 28px next to "of 10 documents ready" in 14px `--muted`. Baseline-aligned.
  - Right: Tabs (Wizard / Board), then PDF button, then "Save my progress" primary button.
- Bar below: 8px tall, `--surface-2` background, 999px radius, filled portion is `--brand`. Width animates over 600ms `cubic-bezier(.2,.8,.2,1)`.

**Tabs** (the view switcher) — pill group, `--surface-2` bg, 1px `--line` border, 999px radius, 4px padding. Each button is 7/14, 999px radius, 13px. Selected tab has `--surface` bg + `--shadow-sm`. Icon (emoji) + label, 6px gap.

### View 1 — Wizard

The default view. Stateful, one document at a time.

**Container**: `--surface` bg, 1px `--line` border, 14px radius, `--shadow-md`. Overflow hidden so the stepper bleeds to the edges.

**Stepper** (top of wizard, 16/24 padding)
- A row of equal-width pills, 4px tall, 999px radius, 4px gap. One per document.
- States:
  - Default: `--surface-2` bg.
  - Done: `--brand` bg.
  - Current: `--brand` bg + 4px `--brand-soft` ring around it (`box-shadow: 0 0 0 4px var(--brand-soft)`).
- Clickable to jump.

**Head** (20/24 padding, flex space-between)
- Left:
  - Eyebrow "Step 3 of 10" — 12px, uppercase, 0.08em tracked, `--muted`.
  - H2: Document title in Instrument Serif 32px / line-height 1.1 / letter-spacing -0.01em. 6px top margin.
  - Description in 14px `--ink-2`, max 60ch, 8px top margin.
- Right: Two badges side-by-side, 6px gap:
  - Status badge: "Required" (pink/red: bg `#FBE9E5`, border `#F0C9C0`, text `#82200F`) or "Recommended" (brand-soft fill, brand-2 text).
  - File-type badge: neutral (`--surface-2` bg, `--line-2` border, `--ink-2` text). E.g., "PDF · JPG · PNG".
- Badge sizing: 11px, 3/8 padding, 999px radius, uppercase, 0.06em tracked.

**Body** (24px padding, grid `1fr 320px`, 24px gap; stacks below 880px)

*Left column*:
- **Drop zone** (when no file uploaded): 1.5px dashed `--line-2` border, 14px radius, `--bg` background, 28/24 padding, centered content. Hover/drag-over state: border becomes `--brand`, bg `--brand-soft`. Inside: a 44×44 circular icon (`--surface` bg, `--line-2` border, ↑ glyph), then h4 (16px 600) "Drop your file here, or click to browse", then 13px `--muted` line with file types + size + privacy ("stays on your device"), then a "Choose file" button.
- **File card** (when uploaded): horizontal row, `--surface` bg, 1px `--line` border, 8px radius, 10/12 padding. 32×32 "PDF" badge (brand-soft bg, brand text, 6px radius, 11px 600), filename (14px 500, truncate), meta line "1.4 MB · 8 pages · just now" (12px `--muted`), green ✓ checkmark, "Remove" ghost button.
- After upload, below file: a line "{n} of {total} automatic checks pass." with `n/total` in `--ink` bold.
- **Tips card** (below): `--brand-soft` background, 8px radius, 14/16 padding. h4 in `--brand-2` color "Tips from immigration consultants" (13px 600). List of tips, each prefixed with 💡.

*Right column* (320px):
- **What we'll verify** card: `--surface-2` bg, 8px radius, 14/16 padding. h4 (13px 600). Bulleted checks — but instead of bullets, each item has a circular indicator (16×16, 50% radius, `--surface` bg, `--line-2` border, with a centered SVG checkmark in `--ok` green). 8px gap between items, 13px text in `--ink-2`. Warn state (after upload, if check fails): bg `#FFF6E0`, border `#E2C58A`, with a `⚠` SVG instead of the checkmark. When no file is uploaded, all items show in default (un-failed) state.
- **Why this matters** card: `--bg` bg, 1px `--line` border, 14px radius, 16px padding. h4 + a single short paragraph that varies based on required/recommended.

**Footer** (1px `--line` top, 14/24 padding, flex space-between)
- Left: "← Back" button (disabled on first step) + keyboard hint "← → to navigate" with kbd-styled keys.
- Right (if recommended): "Skip — doesn't apply" ghost button.
- Right: "Save for later" neutral button, then primary "Mark done & continue →". On the last step, primary becomes "Finish ✓".

### View 2 — Board (kanban)

Same data, three-column board.

**Container**: same shell as wizard.

**Head**: H3 "Application board" in Instrument Serif 22px + sub "Drag cards between columns. Click any card to open it." 13px `--muted`.

**Columns** (grid `1fr 1fr 1fr`, 12px gap, stacks below 880px)
- Each column: `--bg` bg, 1px `--line` border, 8px radius, 12px padding, min-height 320px.
- Column heading: name (13px 600) + count chip (11px, `--surface` bg, `--line-2` border, 999px radius, 1/8 padding).
- Order: **To do** → **In progress** → **Done**.
- Empty column placeholder: 12px `--muted`, centered, 24px vertical padding. Copy differs per column.

**Card**: `--surface` bg, 1px `--line` border, 8px radius, 10/12 padding, 8px bottom margin, `--shadow-sm`, draggable, cursor grab. Hover: `translateY(-1px)` + `--shadow-md`. Content:
- Title 14px 500.
- Summary 12px `--muted`, line-height 1.4.
- Footer row (8px top margin, 11px `--muted`): a 6×6 colored dot — `--err` for required, `--brand` for recommended — followed by "Required" or "Recommended", then file types right-aligned (just the first type, e.g. "PDF").

**Drag behavior**:
- Drag a card onto a column to update its status.
- Click a card to switch to wizard view focused on that document.
- Production should use `@dnd-kit/core` for accessible drag + keyboard support.

## Interactions & Behavior

### Navigation
- **Tabs (Wizard ↔ Board)**: instant view swap, both reading the same status map.
- **Stepper pills**: clicking jumps to that step in the wizard.
- **Card click in board**: switches to wizard view, focused on that document.
- **Keyboard**: in wizard view, `←` / `→` navigate steps. Ignored when focus is in an input/select/textarea.

### Upload (mocked)
- Drop or click the drop zone creates a mock file entry. Production should accept real files via `<input type="file">` or drag/drop, validate against `fileTypes`, run any client-side checks (PDF page count, balance heuristics where applicable), and store either to local IndexedDB or upload to a backend.
- Removing a file restores the drop zone.

### Status transitions
- "Mark done & continue" → status `done`, auto-advance to next step.
- "Skip — doesn't apply" → status `skipped`, advance.
- "Save for later" → status `todo`, advance.
- Board drag → sets status directly.

### Animations
- View swap (wizard ↔ board): a 320ms fade-in (`fadein` keyframe, opacity 0 + 4px translateY). Apply `key={view}` or `key={doc.id}` to retrigger on swap and step change.
- Progress bar fill: width transitions 600ms `cubic-bezier(.2,.8,.2,1)`.
- All other interactive elements (buttons, pills, drop zone hover): 220ms `cubic-bezier(.2,.8,.2,1)`.
- Toast: slide up from `translateY(20px)` to 0 + opacity 0→1, 220ms.

### Toasts
- Appear bottom-centered. `--ink` bg, `--bg` text, 999px radius, 10/16 padding, `--shadow-lg`. Auto-dismiss after 1.8s. Triggered on country switch, PDF generate, save, reset.

### Hover states
- All `.btn`: slightly darker background (`--surface-2` for neutral, `--brand-2` for primary).
- Cards: lift 1px + larger shadow.
- Drop zone: border → brand, bg → brand-soft.

### Responsive
- Below 980px: rail stacks above main column.
- Below 880px: wizard body collapses to single column; kanban becomes single column.
- Below 700px: page padding reduces to 16px, h1 to 32px, top bar nav hidden (replaced with hamburger in production).

## State Management

All app state should live in a single store (Zustand, Redux, or context):

```ts
type ProfileState = {
  passport: string;       // "India" | "Nigeria" | "Philippines" | ...
  purpose: "Tourism" | "Family" | "Business" | "Transit";
  stay: string;           // "14 days"
  party: "Solo" | "Family" | "Group";
  history: "No" | "Yes — approved" | "Yes — refused";
};

type DocStatus = "todo" | "doing" | "done" | "skipped";

type AppState = {
  country: "canada" | "usa" | "schengen";
  view: "wizard" | "kanban";
  current: number;                          // current wizard step index
  profile: ProfileState;
  statuses: Record<string, DocStatus>;       // by doc.id
  files: Record<string, FileMeta>;           // by doc.id
  // actions
  setCountry, setView, setCurrent, setProfile, setStatus, setFiles, reset
};
```

### Persistence
The prototype writes `profile`, `statuses`, `files`, and `tweaks` to `localStorage` on every change. Production: keep that pattern for anonymous users and add a server sync once the user signs in (via email). The "Save my progress" button is the explicit handoff from local to server.

### Data
Documents are static reference data — see `prototype/data.jsx`. In production they should be authored as MDX or YAML per country/visa-type and served from CMS or static. Each document has:

```ts
type Doc = {
  id: string;
  title: string;
  summary: string;
  required: boolean;
  fileTypes: string;            // "PDF · JPG · PNG"
  checks: { ok: boolean; text: string }[];
  tips: string[];
};
```

## Design Tokens

### Colors (light, default "blue" theme)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F4EE` | Page background |
| `--surface` | `#FFFFFF` | Cards, top bar, wizard shell |
| `--surface-2` | `#F1ECE0` | Inset wells, kbd, secondary fills |
| `--ink` | `#0E1116` | Primary text, dark buttons |
| `--ink-2` | `#3A4150` | Body text |
| `--muted` | `#6B7280` | Meta, captions |
| `--line` | `#E3DDCE` | Card borders |
| `--line-2` | `#D5CDB8` | Input borders, dashed dividers |
| `--brand` | `#0F4C81` | Primary actions, accents |
| `--brand-2` | `#0B3B66` | Brand hover |
| `--brand-soft` | `#E5EEF6` | Brand-tinted fills, tip cards |
| `--accent` | `#F4D35E` | Highlight (sparingly) |
| `--ok` | `#1F8A5B` | Check pass |
| `--warn` | `#C8821E` | Check warn |
| `--err` | `#B0301B` | Required dot, errors |

### Alt themes (provided in prototype)
- **Green**: `--brand: #1F6F4A; --brand-2: #15553A; --brand-soft: #E4F0EA;`
- **Mono**: `--brand: #0E1116; --brand-soft: #EFEEEA; --accent: #FFD43B;`
- **Dark**: `--bg: #0E1116; --surface: #171B22; --surface-2: #1F242D; --ink: #F1EEE6; --ink-2: #C7CAD1; --muted: #8C93A1; --line: #262C36; --line-2: #323945; --brand: #5B9DD9; --brand-2: #7CB3E3; --brand-soft: #1A2A3A;`

Production should pick **one** theme and ship it; the prototype's theme switcher exists to validate the system, not to ship as a feature.

### Typography
- **Display (h1, h2)**: Instrument Serif, regular, italic for emphasis. `letter-spacing: -0.015em` on h1, `-0.01em` on h2.
- **UI (everything else)**: Inter Tight, with `font-feature-settings: "ss01","cv11"` for the alt single-storey 'a' and straight 'l'. Weights: 400 (body), 500 (button labels, card titles), 600 (h3/h4), 700 (badge text).
- **Mono**: JetBrains Mono for kbd hints and any code-like values.

### Type scale
- 11px — eyebrows, badges, kbd, footer-meta
- 12px — small captions, helper text
- 13px — UI labels, button text, secondary body
- 14px — body, primary button
- 16px — drop-zone h4
- 22px — kanban head (Instrument Serif)
- 28px — progress count (Instrument Serif)
- 32px — wizard h2 (Instrument Serif)
- 44px — page h1 (Instrument Serif)

### Spacing scale
Use 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 28 / 32 / 44 — basically a 2px-step Tailwind-ish scale, with concrete values used per the spec above.

### Radii
- `--radius: 14px` — cards, large containers
- `--radius-sm: 8px` — buttons, inputs, smaller cards
- `999px` — pills, tabs, segmented controls, progress bar

### Shadows
- `--shadow-sm: 0 1px 0 rgba(14,17,22,.04), 0 1px 2px rgba(14,17,22,.06);`
- `--shadow-md: 0 1px 0 rgba(14,17,22,.04), 0 8px 24px -8px rgba(14,17,22,.18);`
- `--shadow-lg: 0 24px 60px -20px rgba(14,17,22,.25), 0 1px 0 rgba(14,17,22,.04);`

### Density (compact / default / spacious)
Three settings adjusting `--pad`, `--gap`, `--row`. Prototype exposes these but production should pick one and stick with it. Default values: `--pad: 18px; --gap: 14px; --row: 52px;`.

### Motion
- Standard transition: `220ms cubic-bezier(.2, .8, .2, 1)`.
- Progress bar: `600ms cubic-bezier(.2, .8, .2, 1)`.
- View fade: `320ms cubic-bezier(.2, .8, .2, 1)`.

## Assets

No raster assets are used. Icons are:
- **Brand mark**: text "V" set in Inter Tight 700 on a brand-coloured square. Replace with a real wordmark/logo if/when one exists.
- **Country flags**: emoji (🇨🇦 🇺🇸 🇪🇺). Production should swap for inline SVG flags (e.g., `flag-icons` package) for consistent cross-platform rendering.
- **Check/warn glyphs**: inline SVGs in CSS (see `.checks li::before`). Replace with the codebase's icon set (Lucide, Phosphor, etc.).
- **Other glyphs** (✦, ↑, ✓, ✕, ⌘): plain Unicode. Production should swap for the codebase's icon set for visual consistency.

## Files

The prototype lives in:

```
design_files/
├── VisaPrep Wizard.html      ← entry point, all styles inline
├── prototype/
│   ├── data.jsx              ← DOCS and COUNTRIES — reference content
│   ├── components.jsx        ← Topbar, Crumbs, Rail, Toast
│   ├── wizard.jsx            ← Wizard view
│   ├── kanban.jsx            ← Board view
│   └── app.jsx               ← root App, state, tweaks panel
```

To run the prototype locally: serve the folder with any static HTTP server (e.g. `python3 -m http.server`) and open `VisaPrep Wizard.html`. It uses CDN React + in-browser Babel — no build step required.

Also included for context:

```
design_files/wireframes/
└── ...                        ← original low-fi exploration of 5 page directions.
                                V2 ("Tool-First") was selected and developed into
                                this hi-fi prototype.
```

The wireframes are not part of the implementation scope but show the alternative directions considered and why this one was chosen.

## Out of scope for this handoff

- Authentication, account, email capture flows beyond the "Save my progress" button.
- Server-side document verification (the prototype's `checks` array is illustrative; real verification needs OCR + business rules).
- Payment, application submission, government integration.
- Multi-language / RTL.
- Real accessibility audit (the prototype is keyboard-navigable in the wizard and has aria attributes on the tabs/segmented controls, but a full audit + screen-reader pass is needed before launch).
