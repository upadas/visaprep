export default function FileCard({ file, checksCount, checksPassed, onRemove }) {
  return (
    <div>
      <div className="file">
        <div className="ico">PDF</div>
        <div className="info">
          <div className="name">{file.name}</div>
          <div className="meta">{file.size} · {file.at}</div>
        </div>
        <span className="ok">✓</span>
        <button className="btn ghost sm" onClick={onRemove}>Remove</button>
      </div>
      {checksCount != null && (
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{checksPassed} of {checksCount}</b> automatic checks pass.
        </div>
      )}
    </div>
  )
}
