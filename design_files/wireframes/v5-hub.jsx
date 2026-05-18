/* V5 — Hub & Spoke (Topic Cluster)
   Page is positioned as the central hub of the {Country} visa topic cluster.
   The checklist is one of several tabs; massive internal linking, comparison
   tools, country switcher. Aimed at maximum topical authority. */

const V5Hub = ({ page, modules, density, annotate }) => {
  const p = window.PAGES[page];
  const pad = density === "compact" ? "20px 26px 28px" : density === "spacious" ? "36px 40px 44px" : "28px 30px 36px";
  const otherCountries = Object.values(window.PAGES).filter(x => x.country !== p.country);
  return (
    <div className="wf" style={{ width: 980 }}>
      <span className="page-tag">V5 · Topic Cluster Hub</span>
      <BrowserBar url={`visaprep.example.com/${page}/`} />
      <div className="wf-inner" style={{padding: pad, position:"relative"}}>
        <Nav/>

        {/* Country header */}
        <div className="strip" style={{marginTop:0, display:"flex", gap:18, alignItems:"center"}}>
          <div className="box" style={{width:88, height:88, display:"flex", alignItems:"center", justifyContent:"center", fontSize:46, background:"#fdeee9"}}>{p.flag}</div>
          <div style={{flex:1}}>
            <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.1em"}}>Country guide</div>
            <h1 style={{fontSize:42}}>{p.country} <span style={{color:"var(--pencil)"}}>visas</span></h1>
            <p style={{marginTop:6}}>Everything you need across tourism, business, study, work, and PR — in one place.</p>
          </div>
          <div className="box shadow" style={{padding:10, fontSize:12, minWidth:160}}>
            <div className="between"><span>Capital</span><b>Ottawa</b></div>
            <div className="between"><span>Currency</span><b>CAD</b></div>
            <div className="between"><span>Visa-free?</span><b>~50 countries</b></div>
          </div>
        </div>

        {/* Visa type switcher */}
        <div style={{marginTop:18}}>
          <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.1em"}}>Pick the visa you need</div>
          <div className="grid-4" style={{marginTop:8}}>
            {[["Tourist","TRV","Most common", true],
              ["Study","Study Permit","For courses 6+ months"],
              ["Work","LMIA / Open","With job offer"],
              ["Super Visa","Parents/grandparents","10-yr multiple entry"],
              ["Business","Business Visitor","Conferences, meetings"],
              ["Express Entry","PR","Permanent residence"],
              ["Family","Sponsorship","Spouse / dependents"],
              ["Transit","Transit Visa","< 48h in airport"]].map(([t,sub,desc,active],i) => (
              <div key={t} className={"box" + (active ? " hi shadow" : "")}>
                <div className="small">{sub}</div>
                <h4>{t}</h4>
                <div className="small" style={{marginTop:2}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs: Tourist visa = active spoke */}
        <div className="tabs" style={{marginTop:24}}>
          {["Overview","Checklist","Process","Cost","Eligibility","FAQ","Apply"].map((t,i) => (
            <div key={t} className={"tab" + (i===1 ? " active" : "")}>{t}</div>
          ))}
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 240px", gap:24}}>
          <div>
            {modules.checklist && (
              <section>
                <div className="between"><h2>Tourist visa checklist</h2><span className="small">Tab 2 of 7</span></div>
                <div className="box" style={{padding:"4px 14px"}}>
                  {p.items.slice(0,6).map((it,i)=> <ChecklistItem key={i} item={it}/>)}
                </div>
                <div className="small" style={{marginTop:6}}>+ {p.items.length - 6} more · keep reading or jump to a tab</div>
              </section>
            )}

            {modules.compare && (
              <section style={{marginTop:22}}>
                <h2>{p.country} vs other popular tourist visas</h2>
                <div className="box" style={{padding:0, marginTop:8}}>
                  <div className="row head" style={{padding:"6px 14px", gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr"}}>
                    <div>Country</div><div>Stay</div><div>Fee</div><div>Process</div><div>Required?</div>
                  </div>
                  {[p, ...otherCountries].map((c,i) => (
                    <div key={c.country} className="row" style={{padding:"8px 14px", gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr", alignItems:"center", background: i===0 ? "#fff4d3" : "transparent"}}>
                      <div style={{display:"flex", gap:8, alignItems:"center"}}><span>{c.flag}</span><b>{c.country}</b></div>
                      <div>{c.duration}</div>
                      <div>{c.fee}</div>
                      <div>{c.processing}</div>
                      <div>For most</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {modules.related && (
              <section style={{marginTop:22}}>
                <h2>Other {p.country} guides</h2>
                <div className="grid-2" style={{marginTop:8}}>
                  {window.RELATED.map((r,i) => (
                    <div key={i} className="box" style={{display:"flex", gap:10, alignItems:"center"}}>
                      <div className="ico">📄</div>
                      <div style={{flex:1, fontFamily:"Caveat", fontSize:17}}>{r}</div>
                      <span style={{fontSize:18}}>→</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {modules.faq && (
              <section style={{marginTop:22}}>
                <h2>Common questions</h2>
                {window.FAQ.slice(0,3).map((f,i) => <FaqRow key={i} q={f.q} open={i===0}/>)}
              </section>
            )}
          </div>

          {/* Right rail: country switcher + topical links */}
          <aside>
            <div className="sticky-card stack">
              <div className="box shadow">
                <h4>Compare countries</h4>
                <hr className="rule" style={{margin:"6px 0"}}/>
                <div className="stack-sm">
                  {Object.entries(window.PAGES).map(([k,c]) => (
                    <div key={k} className="rail-item" style={{display:"flex", justifyContent:"space-between", borderLeft: k===page ? "3px solid var(--ink)" : "3px solid transparent", background: k===page ? "#fff4d3":"transparent"}}>
                      <span>{c.flag} {c.country}</span>
                      <span className="small">{c.processing}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="box tinted">
                <h4>Not sure which visa?</h4>
                <p style={{fontSize:12, marginTop:4}}>Answer 5 questions, we'll match you.</p>
                <div className="btn primary" style={{marginTop:6}}>Take the quiz →</div>
              </div>
              {modules.trust && (
                <div className="box">
                  <div className="small" style={{textTransform:"uppercase"}}>Reviewed by</div>
                  <div style={{display:"flex", alignItems:"center", gap:8, marginTop:6}}>
                    <div className="ico" style={{width:30,height:30,borderRadius:"50%"}}>RM</div>
                    <div className="small">R. Mehta<br/>RCIC #R51234</div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <Footer/>

        {annotate && <>
          <Anno top={130} left={-12} flip>Topic header positions whole cluster</Anno>
          <Anno top={290} right={10}>8 visa types = internal link surface area</Anno>
          <Anno top={520} left={-12} flip>Tabs let one URL serve multiple intents</Anno>
          <Anno top={700} right={10}>Country switcher = entry to other clusters</Anno>
        </>}
      </div>
    </div>
  );
};

window.V5Hub = V5Hub;
