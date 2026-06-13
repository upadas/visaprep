import { useState } from 'react'

export default function GuideModal({ guide, onClose }) {
  const [i, setI] = useState(0)
  const section = guide.sections[i]
  const isLast = i === guide.sections.length - 1

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={guide.title}
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{guide.title}</h3>
          <button
            className="btn ghost"
            aria-label="Close"
            onClick={onClose}
            style={{ padding: '2px 8px', fontSize: 16, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div style={{ minHeight: 120, marginBottom: 16 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600 }}>{section.heading}</h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{section.body}</p>
          {section.link && (
            <a
              href={section.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: 8, fontSize: 13, color: 'var(--brand)' }}
            >
              Visit official site →
            </a>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            {i + 1} / {guide.sections.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn ghost"
              onClick={() => setI(i - 1)}
              disabled={i === 0}
            >
              ← Back
            </button>
            <button
              className="btn"
              onClick={isLast ? onClose : () => setI(i + 1)}
            >
              {isLast ? 'Done' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
