export function encodeState({ statuses, current, profile, country }) {
  return btoa(JSON.stringify({ statuses, current, profile, country }))
}

export function decodeState(encoded) {
  if (!encoded) return null
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return null
  }
}

export default function SaveModal({ statuses, current, profile, country, onClose }) {
  const encoded = encodeState({ statuses, current, profile, country })
  const url = `${window.location.href.split('#')[0]}#s=${encoded}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url).catch(() => {})
  }

  const mailtoHref =
    `mailto:?subject=${encodeURIComponent('My VisaPrep progress')}&body=${encodeURIComponent(
      `Open this link to restore your visa checklist progress:\n\n${url}`
    )}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 28,
          width: 520,
          maxWidth: '92vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h2 id="save-modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          Save your progress
        </h2>

        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
          Copy this link or email it to yourself. Opening it will restore exactly where you left off.
        </p>

        <input
          type="text"
          readOnly
          value={url}
          onClick={(e) => e.target.select()}
          style={{
            width: '100%',
            padding: '8px 10px',
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            border: '1px solid var(--line)',
            borderRadius: 6,
            background: 'var(--surface-2)',
            color: 'var(--ink)',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={handleCopy}>
            Copy link
          </button>
          <a
            href={mailtoHref}
            className="btn ghost"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Email to myself
          </a>
          <button className="btn ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
