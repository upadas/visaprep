/* Reusable wireframe pieces */

const Anno = ({ children, top, left, right, bottom, flip, color="var(--accent)" }) => (
  <div className={"anno" + (flip ? " flip" : "")} style={{ top, left, right, bottom, color }}>{children}</div>
);

const Lines = ({ count = 3, widths }) => {
  const ws = widths || Array.from({ length: count }, (_, i) =>
    i === count - 1 ? "short" : (i % 2 ? "med" : "long"));
  return (
    <div className="lines">
      {ws.map((w, i) => <div key={i} className={"line " + w} />)}
    </div>
  );
};

const BrowserBar = ({ url = "visaprep.example.com/canada/tourist-visa-checklist" }) => (
  <div className="browser-bar">
    <div className="dots"><span/><span/><span/></div>
    <div className="url">🔒 {url}</div>
    <div style={{fontSize:11, color:"var(--pencil)"}}>⋯</div>
  </div>
);

const Nav = ({ active = "Visas" }) => (
  <div className="nav">
    <div style={{display:"flex", alignItems:"center", gap:14}}>
      <div className="logo">VisaPrep</div>
      <ul>
        {["Visas","Tools","Guides","Pricing"].map(n => (
          <li key={n} style={{textDecoration: n===active ? "underline wavy" : "none", textUnderlineOffset:4}}>{n}</li>
        ))}
      </ul>
    </div>
    <div style={{display:"flex", gap:10, alignItems:"center"}}>
      <span className="small">Sign in</span>
      <span className="cta">Start application →</span>
    </div>
  </div>
);

const Crumbs = ({ trail = ["Home","Visas","Canada","Tourist Visa Checklist"] }) => (
  <div className="crumbs">
    {trail.map((c, i) => (
      <React.Fragment key={i}>
        <span>{c}</span>
        {i < trail.length - 1 && <span style={{margin:"0 6px", textDecoration:"none"}}>›</span>}
      </React.Fragment>
    ))}
  </div>
);

const ChecklistItem = ({ item, showMeta = true }) => (
  <div className="check">
    <div className={"cb" + (item.done ? " done" : "")} />
    <div className="body-txt">
      <div style={{fontFamily:"Caveat", fontSize:18, lineHeight:1.1}}>{item.t}</div>
      {showMeta && <div className="meta">{item.m}</div>}
    </div>
    <div style={{fontSize:11, color:"var(--pencil)", whiteSpace:"nowrap"}}>info ⓘ</div>
  </div>
);

const Footer = () => (
  <div style={{marginTop:24, paddingTop:14, borderTop:"1.5px solid var(--rule)", display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--pencil)"}}>
    <div>VisaPrep © 2025 · Not affiliated with any government</div>
    <div style={{display:"flex", gap:14}}><span>About</span><span>Privacy</span><span>Sources</span><span>Contact</span></div>
  </div>
);

const TrustBar = () => (
  <div style={{display:"flex", gap:14, alignItems:"center", flexWrap:"wrap", padding:"10px 0", borderTop:"1.5px dashed var(--rule)", borderBottom:"1.5px dashed var(--rule)", fontSize:12, color:"var(--pencil)"}}>
    <span>✎ Last updated: Jan 12, 2026</span>
    <span>·</span>
    <span>Reviewed by R. Mehta, RCIC #R51234</span>
    <span>·</span>
    <span>Sources: IRCC.gc.ca, official VAC</span>
  </div>
);

const Ad = ({ label = "Ad slot · 728×90 leaderboard" }) => (
  <div className="ad">{label}</div>
);

const FaqRow = ({ q, open = false }) => (
  <div className="faq-row">
    <div className="q">{q}</div>
    <div className="x">{open ? "−" : "+"}</div>
  </div>
);

const Hero = ({ p, variant = "classic" }) => (
  <div>
    <Crumbs trail={["Home","Visas",p.country,"Tourist Visa Checklist"]} />
    <div className="between" style={{alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:6}}>
          <span className="badge">{p.country}</span>
          <span className="badge">{p.visa}</span>
          <span className="badge" style={{background:"#fff4d3"}}>2026 Edition</span>
        </div>
        <h1>
          <span className="squig">{p.country} Tourist Visa</span><br/>
          Document Checklist
        </h1>
        <p style={{marginTop:10, maxWidth:460}}>{p.blurb}</p>
      </div>
      {variant === "classic" && (
        <div className="box shadow" style={{width:200, padding:12}}>
          <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.06em"}}>At a glance</div>
          <hr className="rule" style={{margin:"6px 0"}}/>
          <div style={{fontSize:12, lineHeight:1.5}}>
            <div className="between"><span>Stay</span><b>{p.duration}</b></div>
            <div className="between"><span>Fee</span><b>{p.fee}</b></div>
            <div className="between"><span>Processing</span><b>{p.processing}</b></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

window.Anno = Anno;
window.Lines = Lines;
window.BrowserBar = BrowserBar;
window.Nav = Nav;
window.Crumbs = Crumbs;
window.ChecklistItem = ChecklistItem;
window.Footer = Footer;
window.TrustBar = TrustBar;
window.Ad = Ad;
window.FaqRow = FaqRow;
window.Hero = Hero;
