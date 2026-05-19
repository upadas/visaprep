export default function GuidesPage() {
  const guides = [
    {
      title: 'How to complete IMM 5257',
      description: 'Step-by-step walkthrough of every section of the Canada Temporary Resident Visa form — from personal details to travel history.',
      tag: 'Canada',
    },
    {
      title: 'Proof of funds explained',
      description: 'Understand exactly how much money you need to show, which documents count, and how to strengthen a borderline bank statement.',
      tag: 'All countries',
    },
    {
      title: 'Biometrics guide',
      description: 'Which countries require biometrics, how to book your appointment, what to bring, and how the receipt fits into your application.',
      tag: 'Canada · USA · UK · Schengen · Australia',
    },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Immigration Guides</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        In-depth articles to help you understand each stage of the visa application process.
        Select a guide to read the full version.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {guides.map((g) => (
          <div
            key={g.title}
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
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {g.tag}
            </span>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{g.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{g.description}</p>
            <button className="btn ghost sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
              Read guide →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
