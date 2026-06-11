export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: 14 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: 'var(--err)', color: 'white', borderColor: 'var(--err)' }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
