const DOC_TYPES = [
  { icon: '🛂', name: 'Passport', desc: 'Requirements for validity period, blank pages, and scan quality for all major destinations.' },
  { icon: '🏦', name: 'Bank statements', desc: 'How to present bank statements, what balance is needed, and how to handle sponsor letters.' },
  { icon: '📷', name: 'Photos', desc: 'Specification guide: size, background colour, expression, and common rejection reasons.' },
  { icon: '✈️', name: 'Travel itinerary', desc: 'How to generate acceptable flight reservations and hotel bookings without paying upfront.' },
  { icon: '📝', name: 'Application forms', desc: 'Direct links to official visa application forms for all 40 supported countries.' },
  { icon: '💼', name: 'Employment letter', desc: 'Template and checklist: what your HR letter must state to satisfy the visa officer.' },
  { icon: '📜', name: 'Cover letter', desc: 'Writing a compelling one-page cover letter that establishes strong ties to your home country.' },
  { icon: '🦷', name: 'Biometrics', desc: 'Countries that require fingerprinting, how to book, and what the receipt should look like.' },
]

export default function DocumentsPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Document Library</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        Reference guides for every document type in the visa checklist.
        Click any card for full specifications and country-specific requirements.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {DOC_TYPES.map((d) => (
          <div
            key={d.name}
            style={{
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 18,
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 28 }}>{d.icon}</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{d.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
