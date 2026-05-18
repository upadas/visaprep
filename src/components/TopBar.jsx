import { COUNTRIES } from '../data/countries'

export default function TopBar({ country, onCountry }) {
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
