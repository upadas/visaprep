/* App: wires wizard + kanban + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "blue",
  "density": "default",
  "defaultView": "wizard",
  "country": "canada"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = React.useState(() => {
    try { return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem("vp-tweaks") || "{}") }; }
    catch { return TWEAK_DEFAULTS; }
  });
  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    try { localStorage.setItem("vp-tweaks", JSON.stringify(next)); } catch {}
    try { window.parent.postMessage({type:"__edit_mode_set_keys", edits:{[k]: v}}, "*"); } catch {}
  };

  React.useEffect(() => {
    document.body.dataset.theme = tweaks.theme;
    document.body.dataset.density = tweaks.density;
  }, [tweaks.theme, tweaks.density]);

  const [country, setCountry] = React.useState(tweaks.country);
  React.useEffect(() => setCountry(tweaks.country), [tweaks.country]);

  const [view, setView] = React.useState(tweaks.defaultView);

  const [profile, setProfile] = React.useState({
    passport: "India", purpose: "Tourism", stay: "14 days", party: "Family", history: "No"
  });

  const docs = window.DOCS;

  const [statuses, setStatusesRaw] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("vp-status") || "{}"); }
    catch { return {}; }
  });
  const setStatus = (id, s) => {
    const n = { ...statuses, [id]: s };
    setStatusesRaw(n);
    try { localStorage.setItem("vp-status", JSON.stringify(n)); } catch {}
  };
  const setStatuses = (n) => {
    setStatusesRaw(n);
    try { localStorage.setItem("vp-status", JSON.stringify(n)); } catch {}
  };

  const [files, setFilesRaw] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("vp-files") || "{}"); }
    catch { return {}; }
  });
  const setFiles = (n) => {
    setFilesRaw(n);
    try { localStorage.setItem("vp-files", JSON.stringify(n)); } catch {}
  };

  const [current, setCurrent] = React.useState(0);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (view !== "wizard") return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") setCurrent(c => Math.min(docs.length-1, c+1));
      if (e.key === "ArrowLeft")  setCurrent(c => Math.max(0, c-1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, docs.length]);

  const c = window.COUNTRIES[country];
  const done = docs.filter(d => statuses[d.id] === "done").length;
  const total = docs.length;

  // toast
  const [toast, setToast] = React.useState({msg:"", show:false});
  const flash = (msg) => {
    setToast({msg, show:true});
    setTimeout(()=>setToast(t=>({...t, show:false})), 1800);
  };

  const reset = () => {
    setStatuses({}); setFilesRaw({}); setCurrent(0);
    try { localStorage.removeItem("vp-status"); localStorage.removeItem("vp-files"); } catch {}
    flash("Progress reset");
  };

  return (
    <div className="app">
      <Topbar country={country} onCountry={(v)=>{setCountry(v); setTweak("country", v); flash("Switched country");}}/>

      <div>
        <div className="page-head">
          <Crumbs country={country}/>
          <div className="page-title">
            <h1>{c.flag} <em>{c.name}</em> tourist visa<br/><span style={{color:"var(--muted)"}}>document checklist</span></h1>
            <div className="meta">
              <span>Fee · <b>{c.fee}</b></span>
              <span>Processing · <b>{c.proc}</b></span>
              <span>Updated · <b>May 2026</b></span>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="layout">
            <Rail profile={profile} setProfile={setProfile}/>

            <div className="main">
              <div className="progress-bar">
                <div className="row1">
                  <div className="left">
                    <span className="count">{done}</span>
                    <span className="of">of {total} documents ready</span>
                  </div>
                  <div className="actions">
                    <div className="tabs" role="tablist" aria-label="View">
                      <button role="tab" aria-selected={view==="wizard"} onClick={()=>setView("wizard")}>
                        <span>🧭</span> Wizard
                      </button>
                      <button role="tab" aria-selected={view==="kanban"} onClick={()=>setView("kanban")}>
                        <span>▦</span> Board
                      </button>
                    </div>
                    <button className="btn" onClick={()=>flash("PDF generated")}>⤓ PDF</button>
                    <button className="btn primary" onClick={()=>flash("Saved & emailed")}>Save my progress</button>
                  </div>
                </div>
                <div className="bar"><i style={{width: `${(done/total)*100}%`}}/></div>
              </div>

              {view === "wizard" ? (
                <Wizard
                  docs={docs}
                  statuses={statuses}
                  current={current}
                  setCurrent={setCurrent}
                  setStatus={setStatus}
                  files={files}
                  setFiles={setFiles}
                />
              ) : (
                <Kanban
                  docs={docs}
                  statuses={statuses}
                  setStatus={setStatus}
                  setCurrent={setCurrent}
                  setView={setView}
                />
              )}

              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6, fontSize:12, color:"var(--muted)"}}>
                <span>Auto-saved locally · sync across devices by saving with email.</span>
                <button className="btn ghost sm" onClick={reset}>Reset progress</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TweaksFloating tweaks={tweaks} setTweak={setTweak}/>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}

function TweaksFloating({ tweaks, setTweak }) {
  const [open, setOpen] = React.useState(false);
  const [available, setAvailable] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    setAvailable(true);
    try { window.parent.postMessage({type:"__edit_mode_available"}, "*"); } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!open) {
    return (
      <button className="tweaks-toggle" onClick={()=>setOpen(true)} title="Tweaks">
        ✦ Tweaks
      </button>
    );
  }

  return (
    <div className="tweaks">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h4 style={{margin:0}}>Tweaks</h4>
        <button className="btn ghost icon sm" onClick={()=>{
          setOpen(false);
          try { window.parent.postMessage({type:"__edit_mode_dismissed"}, "*"); } catch {}
        }}>✕</button>
      </div>

      <div className="row">
        <label>Theme</label>
        <div className="swatches">
          {[
            {id:"blue",  c:"#0F4C81"},
            {id:"green", c:"#1F6F4A"},
            {id:"mono",  c:"#0E1116"},
            {id:"dark",  c:"#5B9DD9", bg:"#0E1116"},
          ].map(s => (
            <button key={s.id} className="swatch" aria-pressed={tweaks.theme===s.id}
              style={{background: s.bg ? `linear-gradient(135deg, ${s.bg} 50%, ${s.c} 50%)` : s.c}}
              onClick={()=>setTweak("theme", s.id)} aria-label={s.id}/>
          ))}
        </div>
      </div>

      <div className="row">
        <label>Density</label>
        <div className="seg" style={{margin:0, width:160}}>
          {["compact","default","spacious"].map(d => (
            <button key={d} aria-pressed={tweaks.density===d} onClick={()=>setTweak("density", d)}>{d[0].toUpperCase()+d.slice(1,3)}</button>
          ))}
        </div>
      </div>

      <div className="row">
        <label>Default view</label>
        <div className="seg" style={{margin:0, width:160}}>
          {[["wizard","Wizard"],["kanban","Board"]].map(([v,l]) => (
            <button key={v} aria-pressed={tweaks.defaultView===v} onClick={()=>setTweak("defaultView", v)}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
