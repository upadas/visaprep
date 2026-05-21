export default function ProgressBar({ done, total, view, setView, onPdf, onSave, complete }) {
  return (
    <div className="progress-bar">
      <div className="row1">
        <div className="left">
          <span className="count">{done}</span>
          <span className="of">of {total} documents ready</span>
        </div>
        <div className="actions">
          <div className="tabs" role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === 'wizard'} onClick={() => setView('wizard')}>
              🧭 Wizard
            </button>
            <button role="tab" aria-selected={view === 'kanban'} onClick={() => setView('kanban')}>
              ▦ Board
            </button>
          </div>
          <button
            className={`btn${complete ? ' pdf-ready' : ''}`}
            onClick={onPdf}
            disabled={!complete}
            aria-label={complete ? 'Download PDF checklist' : 'Complete all required documents to unlock PDF'}
          >
            ⤓ PDF
          </button>
          <button className="btn primary" onClick={onSave}>Save my progress</button>
        </div>
      </div>
      <div className="bar">
        <i style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}
