export default function ChecksList({ checks, hasFile, required }) {
  return (
    <aside>
      <div className="checks">
        <h4>What we'll verify</h4>
        <ul>
          {checks.map((c, i) => (
            <li key={i} className={hasFile && !c.ok ? 'warn' : ''}>{c.text}</li>
          ))}
        </ul>
      </div>
      <div className="right-card" style={{ marginTop: 12 }}>
        <h4>Why this matters</h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {required
            ? 'This is one of the documents IRCC checks first. A missing or unclear file here can stall your application by weeks.'
            : 'Optional, but strengthens your file. Skip if it doesn\'t apply to you.'}
        </p>
      </div>
    </aside>
  )
}
