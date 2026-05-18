const PURPOSES   = ['Tourism', 'Family', 'Business', 'Transit']
const PARTIES    = ['Solo', 'Family', 'Group']
const HISTORIES  = [
  { value: 'No',             label: 'No' },
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
            <button key={p} aria-pressed={profile.purpose === p ? 'true' : 'false'} onClick={() => set('purpose', p)}>{p}</button>
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
            <button key={p} aria-pressed={profile.party === p ? 'true' : 'false'} onClick={() => set('party', p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Have you applied before?</label>
        <div className="seg">
          {HISTORIES.map(({ value, label }) => (
            <button key={value} aria-pressed={profile.history === value ? 'true' : 'false'} onClick={() => set('history', value)}>{label}</button>
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
