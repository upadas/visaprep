/* V3 — Editorial / Magazine
   Treats the page like a long-form magazine feature. Big imagery slots,
   pull quotes, opinion-leaning copy, expert byline. Targets readers who want
   depth + trust over speed. */

const V3Editorial = ({ page, modules, density, annotate }) => {
  const p = window.PAGES[page];
  const pad = density === "compact" ? "20px 26px 28px" : density === "spacious" ? "36px 40px 44px" : "28px 30px 36px";
  return (
    <div className="wf" style={{ width: 980 }}>
      <span className="page-tag">V3 · Editorial / Magazine</span>
      <BrowserBar url={`visaprep.example.com/${page}/tourist-visa-checklist`} />
      <div className="wf-inner" style={{padding: pad, position:"relative"}}>
        <Nav/>

        {/* Big editorial header */}
        <div className="strip" style={{marginTop:0}}>
          <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.1em"}}>The Visa Library · Issue №47</div>
          <h1 style={{fontSize:54, lineHeight:1, marginTop:6, maxWidth:780}}>
            Everything you need for a <span className="squig">{p.country}</span> tourist visa, in one honest list.
          </h1>
          <p style={{marginTop:14, maxWidth:640, fontSize:15}}>{p.blurb}</p>
          <div className="between" style={{marginTop:14}}>
            <div style={{display:"flex", gap:10, alignItems:"center"}}>
              <div className="ico" style={{width:34, height:34, borderRadius:"50%"}}>RM</div>
              <div className="small">By <b>R. Mehta</b>, Regulated Canadian Immigration Consultant<br/>10 min read · Updated Jan 12, 2026</div>
            </div>
            <div style={{display:"flex", gap:8}}>
              <span className="btn">↗ Share</span>
              <span className="btn accent">🔖 Save</span>
            </div>
          </div>
        </div>

        {/* Hero image placeholder + caption */}
        <div className="box dashed" style={{height:230, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--pencil)", marginTop:18, background:"var(--paper-2)"}}>
          <div className="center">
            <div style={{fontFamily:"Caveat", fontSize:28}}>[ photo · queue at Canadian VAC, Mumbai ]</div>
            <div className="small">16:9, 1600×900, ALT text required</div>
          </div>
        </div>
        <div className="small" style={{marginTop:6, fontStyle:"italic"}}>Photo: Anna L. for VisaPrep · A Saturday morning at the visa application centre in Andheri.</div>

        {/* drop cap intro */}
        <div style={{marginTop:22, columnCount:2, columnGap:30}}>
          <p style={{fontSize:14}}>
            <span style={{fontFamily:"Caveat", fontSize:48, float:"left", lineHeight:.85, marginRight:8, marginTop:4}}>T</span>
            here's a moment between buying flights and getting visa-stamped that almost every traveller dreads. The forms ask the same questions in three different ways, the bank wants stamps it doesn't normally hand out, and the embassy website hasn't been redesigned since 2008.
          </p>
          <p style={{fontSize:14}}>This guide is what we wish we'd had — a single, honest list of what {p.country}'s immigration officers are actually checking for, written by someone who has filed hundreds of these.</p>
        </div>

        {/* pull quote */}
        <blockquote style={{margin:"24px 0", paddingLeft:18, borderLeft:"3px solid var(--ink)", fontFamily:"Caveat", fontSize:30, lineHeight:1.1, maxWidth:680}}>
          "Half the refusals I see come from missing one boring document. The exciting parts of the application matter less than the boring ones."
          <div className="small" style={{marginTop:8, fontFamily:"Kalam"}}>— R. Mehta, RCIC #R51234</div>
        </blockquote>

        {/* Checklist as numbered editorial list */}
        {modules.checklist && (
          <section style={{marginTop:14}}>
            <h2>The list itself</h2>
            <p>Numbered in the order to prepare them, with the boring footnotes that matter.</p>
            <div className="stack" style={{marginTop:14}}>
              {p.items.slice(0, 6).map((it, i) => (
                <div key={i} style={{display:"grid", gridTemplateColumns:"60px 1fr", gap:18, paddingBottom:14, borderBottom:"1.5px solid var(--rule)"}}>
                  <div style={{fontFamily:"Caveat", fontSize:54, lineHeight:.9, color:"var(--accent-2)"}}>{String(i+1).padStart(2,"0")}</div>
                  <div>
                    <h3>{it.t}</h3>
                    <p style={{marginTop:4}}>{it.m}.</p>
                    <Lines count={1} widths={["long"]}/>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sidebar-style callout */}
        <div className="box hi" style={{marginTop:20, padding:18}}>
          <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.1em"}}>Insider tip</div>
          <h3 style={{marginTop:4}}>Apply on a Tuesday morning, not a Monday.</h3>
          <p style={{marginTop:6}}>VAC queues are roughly 40% shorter mid-week. The biometrics machines are also more likely to be working.</p>
        </div>

        {modules.ad && <div style={{marginTop:18}}><Ad label="Native ad / sponsored insurance recommendation"/></div>}

        {modules.faq && (
          <section style={{marginTop:22}}>
            <h2>Reader questions</h2>
            <div style={{marginTop:8}}>
              {window.FAQ.slice(0,4).map((f, i) => <FaqRow key={i} q={f.q} open={i===0}/>)}
            </div>
          </section>
        )}

        {/* End-of-article subscribe */}
        <div className="strip dark" style={{marginTop:22, textAlign:"center"}}>
          <h2>Get the next visa guide in your inbox</h2>
          <p style={{maxWidth:480, margin:"6px auto 12px"}}>One country a week. Written by consultants. No spam.</p>
          <div style={{display:"flex", gap:8, justifyContent:"center"}}>
            <div className="box" style={{background:"var(--paper)", color:"var(--ink)", padding:"4px 10px", minWidth:240, fontSize:13}}>your@email.com</div>
            <span className="btn accent">Subscribe</span>
          </div>
        </div>

        <Footer/>

        {annotate && <>
          <Anno top={120} right={10}>Editorial framing → premium ad rates, longer dwell</Anno>
          <Anno top={460} left={-12} flip>Pull quote breaks the wall of text</Anno>
          <Anno top={780} right={10}>Newsletter capture = compounding asset</Anno>
        </>}
      </div>
    </div>
  );
};

window.V3Editorial = V3Editorial;
