function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function FileCard({ file, checksCount, checksPassed, onRemove }) {
  const isImage = file.type?.startsWith('image/')
  const size    = formatSize(file.sizeBytes)

  return (
    <div>
      <div className="file">
        {isImage && file.dataURL ? (
          <img
            src={file.dataURL}
            alt={file.name}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
          />
        ) : (
          <div className="ico">{file.type === 'application/pdf' ? 'PDF' : '📄'}</div>
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
