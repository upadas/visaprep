import { useState } from 'react'

const FAQS = [
  {
    q: 'Is my data sent to any server?',
    a: "No. All your progress — document statuses, profile answers, and uploaded files — is stored only in your browser's localStorage. Nothing is transmitted anywhere unless you use the \"Save\" link to share via email, which encodes everything in the URL itself.",
  },
  {
    q: 'Can I use VisaPrep for countries other than Canada?',
    a: 'Yes. Use the country selector in the top bar to switch between 40 supported tourist-visa destinations. The document checklist, form names, and fund requirements update automatically for each country.',
  },
  {
    q: 'How do I save my progress across devices?',
    a: 'Click "Sign in" in the top bar. VisaPrep will generate a link that encodes your entire progress. Copy the link or email it to yourself. Opening the link on any device restores your checklist exactly where you left off — no account needed.',
  },
  {
    q: 'Are the fees and processing times up to date?',
    a: 'VisaPrep uses verified data updated as of May 2026. Visa fees and processing times change frequently — always cross-check with the official embassy or immigration authority website before submitting your application.',
  },
  {
    q: 'What does "biometrics required" mean?',
    a: 'Some countries (Canada, USA, UK, Schengen, Australia) require you to provide fingerprints and a photograph at an authorised Visa Application Centre before or alongside your visa submission. VisaPrep marks the biometrics document as required only for those countries.',
  },
  {
    q: 'Can I reset my progress?',
    a: 'Yes. Scroll to the bottom of the checklist page and click "Reset progress". This clears all document statuses and uploaded files from your browser. Your profile answers (passport country, purpose, etc.) are preserved.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '14px 18px',
          fontSize: 15, fontWeight: 500, background: 'var(--surface)',
          border: 'none', cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink)',
        }}
        aria-expanded={open}
      >
        {q}
        <span style={{ fontSize: 18, lineHeight: 1, color: 'var(--muted)', marginLeft: 12 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{
          padding: '12px 18px 16px', fontSize: 14, color: 'var(--muted)',
          lineHeight: 1.65, borderTop: '1px solid var(--line)', background: 'var(--surface)',
        }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Help & FAQ</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>
        Answers to the most common questions about VisaPrep.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </div>
  )
}
