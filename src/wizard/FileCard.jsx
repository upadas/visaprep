import { useState } from 'react'

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function FileCard({ file, checksCount, checksPassed, onRemove }) {
  const isImage = file.type?.startsWith('image/')
  const isPdf   = file.type === 'application/pdf'
  const size    = formatSize(file.sizeBytes)
  const [hover, setHover] = useState(false)

  const openInNewTab = () => {
    if (file.dataURL) window.open(file.dataURL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className="file">
        {isImage && file.dataURL ? (
          <div
            style={{ position: 'relative', flexShrink: 0 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img
              src={file.dataURL}
              alt={file.name}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'zoom-in', display: 'block' }}
            />
            {hover && (
              <div
                role="tooltip"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: 0,
                  zIndex: 30,
                  padding: 4,
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <img
                  src={file.dataURL}
                  alt={`${file.name} preview`}
                  style={{ width: 220, maxHeight: 280, objectFit: 'contain', borderRadius: 4, display: 'block' }}
                />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="ico"
            onClick={isPdf ? openInNewTab : undefined}
            title={isPdf ? 'Open PDF in new tab' : undefined}
            style={{
              cursor: isPdf ? 'pointer' : 'default',
              border: 'none',
              font: 'inherit',
            }}
          >
            {isPdf ? 'PDF' : '📄'}
          </button>
        )}
        <div className="info">
          <div className="name">{file.name}</div>
          <div className="meta">{size}{size && ' · '}uploaded at {file.at}</div>
        </div>
        <span className="ok">✓</span>
        <button className="btn ghost sm" onClick={onRemove}>Remove</button>
      </div>
      {checksCount != null && (
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{checksPassed} of {checksCount}</b> checks to verify manually.
        </div>
      )}
    </div>
  )
}
