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
              aria-pressed={tweaks.theme === s.id ? 'true' : 'false'}
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
            <button key={d} aria-pressed={tweaks.density === d ? 'true' : 'false'} onClick={() => setTweak('density', d)}>
              {d[0].toUpperCase() + d.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
