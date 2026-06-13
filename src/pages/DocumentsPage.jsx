import { useStore } from '../store/useStore'
import { getDocsForCountry } from '../data/docsForCountry'
import { COUNTRIES } from '../data/countries'

export default function DocumentsPage() {
  const country = useStore((s) => s.country)
  const docs = getDocsForCountry(country)
  const { flag, name } = COUNTRIES[country] ?? COUNTRIES.canada

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {flag} {name} — document library
      </h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        Reference of every document needed for the {name} tourist visa.
        Use this as a preparation guide before uploading your files.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 20,
              background: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{doc.icon ?? '📄'}</span>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, flex: 1 }}>{doc.title}</h2>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: doc.required ? '1px solid var(--ok)' : '1px solid var(--line)',
                  color: doc.required ? 'var(--ok)' : 'var(--muted)',
                }}
              >
                {doc.required ? 'Required' : 'Optional'}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.55 }}>
              {doc.summary}
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 10px' }}>
              Accepts: {doc.fileTypes}
            </p>
            {doc.checks.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  What to prepare
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
                  {doc.checks.map((check, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>
                      {check.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
