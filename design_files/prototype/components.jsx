/* Reusable UI bits */

const { useState, useEffect, useRef, useCallback } = React;

/* topbar */
const Topbar = ({ country, onCountry }) => {
  const c = window.COUNTRIES[country];
  return (
    <header className="topbar">
      <div style={{display:"flex", alignItems:"center", gap:24}}>
        <div className="brand">
          <div className="brand-mark">V</div>
          VisaPrep
        </div>
        <nav>
          <a href="#" className="active">Application</a>
          <a href="#">Guides</a>
          <a href="#">Documents</a>
          <a href="#">Help</a>
        </nav>
      </div>
      <div className="right">
        <select className="select" style={{width:180, padding:"6px 10px"}} value={country} onChange={(e)=>onCountry(e.target.value)}>
          {Object.entries(window.COUNTRIES).map(([k,v]) => (
            <option key={k} value={k}>{v.flag} {v.name} · {v.visa}</option>
          ))}
        </select>
        <button className="btn ghost icon" aria-label="Help">?</button>
        <button className="btn">Sign in</button>
      </div>
    </header>
  );
};

const Crumbs = ({ country }) => {
  const c = window.COUNTRIES[country];
  return (
    <div className="crumbs">
      <a href="#">Home</a><span>›</span>
      <a href="#">Visas</a><span>›</span>
      <a href="#">{c.name}</a><span>›</span>
      <span style={{color:"var(--ink)"}}>Tourist visa application</span>
    </div>
  );
};

/* Filter rail (personalization) */
const Rail = ({ profile, setProfile }) => {
  const set = (k, v) => setProfile({...profile, [k]: v});
  return (
    <aside className="rail">
      <h3>Personalize</h3>
      <div className="sub">Your list adapts as you change these.</div>

      <div className="field">
        <label>Passport country</label>
        <select className="select" value={profile.passport} onChange={(e)=>set("passport", e.target.value)}>
          <option>India</option><option>Nigeria</option><option>Philippines</option>
          <option>Brazil</option><option>Vietnam</option><option>Ukraine</option>
        </select>
      </div>

      <div className="field">
        <label>Purpose</label>
        <div className="pillrow">
          {["Tourism","Family","Business","Transit"].map(p => (
            <button key={p} aria-pressed={profile.purpose===p} onClick={()=>set("purpose", p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Length of stay</label>
        <input className="input" value={profile.stay} onChange={(e)=>set("stay", e.target.value)} />
      </div>

      <div className="field">
        <label>Travelling with</label>
        <div className="seg">
          {["Solo","Family","Group"].map(p => (
            <button key={p} aria-pressed={profile.party===p} onClick={()=>set("party", p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Have you applied before?</label>
        <div className="seg">
          {["No","Yes — approved","Yes — refused"].map(p => (
            <button key={p} aria-pressed={profile.history===p} onClick={()=>set("history", p)}>{p.split(" ")[0]}{p.includes("approved")?" ✓":p.includes("refused")?" ✕":""}</button>
          ))}
        </div>
      </div>

      <div className="footer">
        <span>Auto-saved</span>
        <span className="kbd">⌘ S</span>
      </div>
    </aside>
  );
};

const Toast = ({ msg, show }) => (
  <div className={"toast" + (show ? " show" : "")}>{msg}</div>
);

window.Topbar = Topbar;
window.Crumbs = Crumbs;
window.Rail = Rail;
window.Toast = Toast;
