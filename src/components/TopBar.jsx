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
