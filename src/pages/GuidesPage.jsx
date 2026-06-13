import { useState } from 'react'
import { useStore } from '../store/useStore'
import { COUNTRIES } from '../data/countries'
import { GUIDES } from '../data/guides'
import GuideModal from '../components/GuideModal'

export default function GuidesPage() {
  const country = useStore((s) => s.country)
  const { flag, name } = COUNTRIES[country]
  const guides = GUIDES[country] ?? GUIDES.canada
  const [active, setActive] = useState(null)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {flag} {name} immigration guides
      </h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        In-depth articles to help you understand each stage of the visa application process.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {guides.map((g) => (
          <div
            key={g.id}
            style={{
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 20,
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{g.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{g.blurb}</p>
            <button
              className="btn ghost sm"
              style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              onClick={() => setActive(g)}
            >
              Read guide →
            </button>
          </div>
        ))}
      </div>
      {active && <GuideModal guide={active} onClose={() => setActive(null)} />}
    </div>
  )
}
