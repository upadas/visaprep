import { COUNTRIES } from '../data/countries'

const CYCLE = { light: 'dark', dark: 'system', system: 'light' }
const ICON  = { light: '☀️',   dark: '🌙',      system: '💻' }

export default function TopBar({ country, onCountry, onSaveModal, onHelp, page, onPage, theme, onTheme }) {
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
        <button className="btn ghost icon" aria-label="How saving works" onClick={onHelp}>?</button>
        <button className="btn" onClick={onSaveModal}>Sign in</button>
      </div>
    </header>
  )
}
