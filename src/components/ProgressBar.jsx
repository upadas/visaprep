export default function ProgressBar({ done, total, view, setView, onPdf, onSave }) {
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
          <button className="btn" onClick={onPdf}>⤓ PDF</button>
          <button className="btn primary" onClick={onSave}>Save my progress</button>
        </div>
      </div>
      <div className="bar">
        <i style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}
