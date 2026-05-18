import DropZone from './DropZone'
import FileCard from './FileCard'
import ChecksList from './ChecksList'

export default function Wizard({ docs, statuses, current, setCurrent, setStatus, files, setFiles }) {
  const total = docs.length
  const doc   = docs[current]
  const file  = files[doc.id]

  const goto = (i) => setCurrent(Math.max(0, Math.min(total - 1, i)))

  const onUpload = () =>
    setFiles({ ...files, [doc.id]: { name: doc.id + '.pdf', size: '1.4 MB · 8 pages', at: 'just now' } })

  const onRemove = () => {
    const next = { ...files }
    delete next[doc.id]
    setFiles(next)
  }

  const markDone = () => {
    setStatus(doc.id, 'done')
    if (current < total - 1) setCurrent(current + 1)
  }

  const skip = () => {
    setStatus(doc.id, 'skipped')
    if (current < total - 1) setCurrent(current + 1)
  }

  const saveForLater = () => {
    setStatus(doc.id, 'todo')
    if (current < total - 1) setCurrent(current + 1)
  }

  return (
    <section className="wizard fade" key={doc.id}>
      {/* Stepper */}
      <div className="stepper">
        {docs.map((d, i) => {
          const s = statuses[d.id]
          const cls = i === current ? 'stp cur' : s === 'done' ? 'stp done' : 'stp'
          return <div key={d.id} className={cls} onClick={() => goto(i)} title={d.title} />
        })}
      </div>

      {/* Head */}
      <div className="wiz-head">
        <div>
          <div className="step-of">Step {current + 1} of {total}</div>
          <h2>{doc.title}</h2>
          <p className="desc">{doc.summary}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className={'badge ' + (doc.required ? 'req' : 'rec')}>
            {doc.required ? 'Required' : 'Recommended'}
          </span>
          <span className="badge">{doc.fileTypes}</span>
        </div>
      </div>

      {/* Body */}
      <div className="wiz-body">
        <div>
          {!file
            ? <DropZone fileTypes={doc.fileTypes} onUpload={onUpload} />
            : <FileCard
                file={file}
                checksCount={doc.checks.length}
                checksPassed={doc.checks.filter((c) => c.ok).length}
                onRemove={onRemove}
              />
          }
          {doc.tips.length > 0 && (
            <div className="checks" style={{ marginTop: 14, background: 'var(--brand-soft)' }}>
              <h4 style={{ color: 'var(--brand-2)' }}>Tips from immigration consultants</h4>
              <ul>
                {doc.tips.map((t, i) => <li key={i}>💡 {t}</li>)}
              </ul>
            </div>
          )}
        </div>
        <ChecksList checks={doc.checks} hasFile={!!file} required={doc.required} />
      </div>

      {/* Footer */}
      <div className="wiz-foot">
        <div className="left">
          <button className="btn" disabled={current === 0} onClick={() => goto(current - 1)}>← Back</button>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            <span className="kbd">←</span> <span className="kbd">→</span> to navigate
          </span>
        </div>
        <div className="right">
          {!doc.required && (
            <button className="btn ghost sm" onClick={skip}>Skip — doesn't apply</button>
          )}
          <button className="btn" onClick={saveForLater}>Save for later</button>
          <button className="btn primary" onClick={markDone}>
            {current === total - 1 ? 'Finish ✓' : 'Mark done & continue →'}
          </button>
        </div>
      </div>
    </section>
  )
}
