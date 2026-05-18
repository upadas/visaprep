/* V2 — Tool-First (interactive checklist as the hero)
   Reframes the page from "article" to "app". The checklist is a stateful,
   personalize-able tool above the fold. SEO content sits underneath. */

const V2ToolFirst = ({ page, modules, density, annotate }) => {
  const p = window.PAGES[page];
  const pad = density === "compact" ? "20px 26px 28px" : density === "spacious" ? "36px 40px 44px" : "28px 30px 36px";
  const completed = p.items.filter(i => i.done).length;
  const pct = Math.round(completed / p.items.length * 100);
  return (
    <div className="wf" style={{ width: 980 }}>
      <span className="page-tag">V2 · Tool-First</span>
      <BrowserBar url={`visaprep.example.com/${page}/tourist-visa-checklist`} />
      <div className="wf-inner" style={{padding: pad, position:"relative"}}>
        <Nav active="Tools"/>

        {/* compact intro row */}
        <Crumbs trail={["Home","Visas",p.country,"Tourist Visa Checklist"]}/>
        <div className="between">
          <div>
            <h1 style={{fontSize:32}}><span className="squig">Your {p.country} visa checklist</span></h1>
            <p style={{marginTop:6}}>Personalize, check off as you go, save your progress.</p>
          </div>
          <div style={{display:"flex", gap:8}}>
            <span className="badge">🇨🇦 {p.country}</span>
            <span className="badge">{p.visa}</span>
          </div>
        </div>

        {/* TOOL HERO */}
        <div className="box shadow" style={{marginTop:14, padding:0, overflow:"hidden", background:"var(--paper)"}}>
          <div style={{display:"grid", gridTemplateColumns:"260px 1fr", minHeight: 360}}>
            {/* Left: filters / personalization */}
            <div style={{padding:"16px 18px", borderRight:"1.5px solid var(--rule)", background:"var(--paper-2)"}}>
              <h4>Tell us about you</h4>
              <hr className="rule" style={{margin:"8px 0"}}/>
              <div className="stack-sm small">
                <div>
                  <div className="small" style={{textTransform:"uppercase"}}>Passport country</div>
                  <div className="box" style={{padding:"4px 8px", marginTop:4, display:"flex", justifyContent:"space-between"}}><span>India</span><span>▾</span></div>
                </div>
                <div>
                  <div className="small" style={{textTransform:"uppercase"}}>Purpose</div>
                  <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:4}}>
                    {["Tourism","Family","Business","Transit"].map((t, i) => (
                      <span key={t} className={"pill" + (i===0 ? " y" : "")}>{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="small" style={{textTransform:"uppercase"}}>Length of stay</div>
                  <div className="box" style={{padding:"4px 8px", marginTop:4, display:"flex", justifyContent:"space-between"}}><span>14 days</span><span>▾</span></div>
                </div>
                <div>
                  <div className="small" style={{textTransform:"uppercase"}}>Travelling with</div>
                  <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:4}}>
                    <span className="pill">Solo</span>
                    <span className="pill y">Family</span>
                    <span className="pill">Group</span>
                  </div>
                </div>
              </div>
              <hr className="rule"/>
              <div className="small">Adjusts your list automatically. Save with email →</div>
            </div>

            {/* Right: checklist + progress */}
            <div style={{padding:"16px 18px"}}>
              <div className="between">
                <div>
                  <h3>{completed} of {p.items.length} ready</h3>
                  <div className="small">Progress saved locally · sync with email</div>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <span className="btn">⤓ PDF</span>
                  <span className="btn">✉ Email me</span>
                </div>
              </div>
              <div className="progress" style={{marginTop:8}}><i style={{width:`${pct}%`}}/></div>

              <div className="tabs" style={{marginTop:14}}>
                <div className="tab active">Required ({p.items.length})</div>
                <div className="tab">Recommended (4)</div>
                <div className="tab">Family (2)</div>
              </div>
              <div style={{maxHeight:230, overflow:"hidden"}}>
                {p.items.slice(0, 6).map((it, i) => <ChecklistItem key={i} item={it}/>)}
                <div className="small" style={{textAlign:"center", padding:"6px 0"}}>+ {p.items.length - 6} more · scroll inside tool</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-modules sit beneath the tool */}
        <div style={{marginTop:22}}>
          {modules.process && (
            <section>
              <h2>What happens next</h2>
              <div className="grid-4" style={{marginTop:8}}>
                {["Submit","Biometrics","Wait","Decide"].map((s, i) => (
                  <div className="box" key={i}>
                    <div className="small">Step {i+1}</div>
                    <h4>{s}</h4>
                    <Lines count={2}/>
                  </div>
                ))}
              </div>
            </section>
          )}

          {modules.faq && (
            <section style={{marginTop:18}}>
              <div className="between"><h2>FAQ</h2><span className="small">All questions →</span></div>
              <div>
                {window.FAQ.slice(0,4).map((f, i) => <FaqRow key={i} q={f.q} open={i===0}/>)}
              </div>
            </section>
          )}

          {modules.trust && <div style={{marginTop:18}}><TrustBar/></div>}
        </div>

        <Footer/>

        {annotate && <>
          <Anno top={170} left={-14} flip>Tool above content = transactional intent</Anno>
          <Anno top={250} right={10}>Personalization filters → unique URLs/long-tail SEO</Anno>
          <Anno top={420} left={-14} flip>Save progress = email capture (lead gen)</Anno>
        </>}
      </div>
    </div>
  );
};

window.V2ToolFirst = V2ToolFirst;
