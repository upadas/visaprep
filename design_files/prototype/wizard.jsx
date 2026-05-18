/* Wizard view — one document at a time */

const Wizard = ({ docs, statuses, current, setCurrent, setStatus, files, setFiles }) => {
  const total = docs.length;
  const doc = docs[current];
  const status = statuses[doc.id] || "todo";
  const file = files[doc.id];
  const [over, setOver] = React.useState(false);

  const goto = (i) => setCurrent(Math.max(0, Math.min(total - 1, i)));
  const onUpload = () => {
    setFiles({ ...files, [doc.id]: { name: doc.id + ".pdf", size: "1.4 MB · 8 pages", at: "just now" } });
  };
  const onRemove = () => {
    const f = { ...files }; delete f[doc.id]; setFiles(f);
  };
  const markDone = () => {
    setStatus(doc.id, "done");
    if (current < total - 1) setCurrent(current + 1);
  };
  const skip = () => {
    setStatus(doc.id, "skipped");
    if (current < total - 1) setCurrent(current + 1);
  };

  return (
    <section className="wizard fade" key={doc.id}>
      <div className="stepper">
        {docs.map((d, i) => {
          const s = statuses[d.id];
          const cls = i === current ? "stp cur" : (s === "done" ? "stp done" : "stp");
          return <div key={d.id} className={cls} onClick={()=>goto(i)} title={d.title} />;
        })}
      </div>

      <div className="wiz-head">
        <div>
          <div className="step-of">Step {current+1} of {total}</div>
          <h2>{doc.title}</h2>
          <p className="desc">{doc.summary}</p>
        </div>
        <div style={{display:"flex", gap:6}}>
          <span className={"badge " + (doc.required ? "req" : "rec")}>
            {doc.required ? "Required" : "Recommended"}
          </span>
          <span className="badge">{doc.fileTypes}</span>
        </div>
      </div>

      <div className="wiz-body">
        <div>
          {!file ? (
            <div
              className={"drop" + (over ? " over" : "")}
              onClick={onUpload}
              onDragOver={(e)=>{e.preventDefault(); setOver(true);}}
              onDragLeave={()=>setOver(false)}
              onDrop={(e)=>{e.preventDefault(); setOver(false); onUpload();}}
            >
              <div className="icon">↑</div>
              <h4>Drop your file here, or click to browse</h4>
              <p>{doc.fileTypes} · max 10 MB · stays on your device</p>
              <button className="btn">Choose file</button>
            </div>
          ) : (
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
              <div style={{marginTop:14, fontSize:13, color:"var(--muted)"}}>
                <b style={{color:"var(--ink)"}}>{doc.checks.filter(c=>c.ok).length} of {doc.checks.length}</b> automatic checks pass.
              </div>
            </div>
          )}

          {doc.tips && doc.tips.length > 0 && (
            <div className="checks" style={{marginTop:14, background:"var(--brand-soft)"}}>
              <h4 style={{color:"var(--brand-2)"}}>Tips from immigration consultants</h4>
              <ul>
                {doc.tips.map((t, i) => (
                  <li key={i} style={{paddingLeft:0}} dangerouslySetInnerHTML={{__html: "💡 " + t}}/>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside>
          <div className="checks">
            <h4>What we'll verify</h4>
            <ul>
              {doc.checks.map((c, i) => (
                <li key={i} className={!file ? "" : (c.ok ? "" : "warn")}>{c.text}</li>
              ))}
            </ul>
          </div>

          <div className="right-card" style={{marginTop:12}}>
            <h4>Why this matters</h4>
            <p style={{margin:0, fontSize:13, color:"var(--ink-2)", lineHeight:1.5}}>
              {doc.required
                ? "This is one of the documents IRCC checks first. A missing or unclear file here can stall your application by weeks."
                : "Optional, but strengthens your file. Skip if it doesn't apply to you."}
            </p>
          </div>
        </aside>
      </div>

      <div className="wiz-foot">
        <div className="left">
          <button className="btn" disabled={current===0} onClick={()=>goto(current-1)}>← Back</button>
          <span style={{fontSize:12, color:"var(--muted)"}}>
            <span className="kbd">←</span> <span className="kbd">→</span> to navigate
          </span>
        </div>
        <div className="right">
          {!doc.required && <button className="btn ghost" onClick={skip}>Skip — doesn't apply</button>}
          <button className="btn" onClick={()=>{ setStatus(doc.id, "todo"); goto(current+1); }}>Save for later</button>
          <button className="btn primary" onClick={markDone}>
            {current === total-1 ? "Finish ✓" : "Mark done & continue →"}
          </button>
        </div>
      </div>
    </section>
  );
};

window.Wizard = Wizard;
