const STEPS = [
  {
    icon: '🔗',
    title: 'No account needed',
    body: 'VisaPrep has no passwords or sign-ups. Your progress is saved into a private link that only you hold.',
  },
  {
    icon: '💾',
    title: 'Save your progress',
    body: 'Click "Sign in" in the top bar. A link is generated that encodes your country, current step, profile, and every document status.',
  },
  {
    icon: '📧',
    title: 'Keep the link',
    body: 'Copy the link or email it to yourself from the same dialog. Bookmark it or keep the email — that link is your save file.',
  },
  {
    icon: '↩️',
    title: 'Restore anywhere',
    body: 'Open the link on any device and VisaPrep loads exactly where you left off — same country, step, and checklist state.',
  },
  {
    icon: '🔒',
    title: 'Your files stay private',
    body: 'Uploaded documents are stored only on this device (in your browser) and are never put in the link or sent to any server.',
  },
]

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="How VisaPrep works"
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>How saving works</h3>
          <button
            className="btn ghost"
            aria-label="Close"
            onClick={onClose}
            style={{ padding: '2px 8px', fontSize: 16, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
          VisaPrep keeps your progress without any account. Here's the whole flow:
        </p>

        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEPS.map((s) => (
            <li key={s.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, lineHeight: 1.3 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  )
}
