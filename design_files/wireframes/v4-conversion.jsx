/* V4 — Conversion-Optimised
   Aggressive lead-gen + affiliate layout. Sticky CTA bar, exit intent
   capture, comparison tables, "we'll do this for you" upsells. Looks like
   a high-performing affiliate site. */

const V4Conversion = ({ page, modules, density, annotate }) => {
  const p = window.PAGES[page];
  const pad = density === "compact" ? "20px 26px 28px" : density === "spacious" ? "36px 40px 44px" : "28px 30px 36px";
  return (
    <div className="wf" style={{ width: 980 }}>
      <span className="page-tag">V4 · Conversion-Optimised</span>
      <BrowserBar url={`visaprep.example.com/${page}/tourist-visa-checklist`} />
      <div className="wf-inner" style={{padding: pad, position:"relative"}}>
        <Nav active="Tools"/>

        {/* Sticky-style top bar */}
        <div className="box" style={{background:"var(--ink)", color:"var(--paper)", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 12px", borderRadius:0, margin:"-22px -30px 14px"}}>
          <div style={{fontFamily:"Caveat", fontSize:16}}>⚡ Limited: Get checklist + free expert review →</div>
          <div className="btn accent" style={{padding:"2px 10px"}}>Claim now</div>
        </div>

        <Crumbs trail={["Home",p.country,"Tourist Visa Checklist"]}/>

        {/* Hero with prominent lead form */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 320px", gap:24, marginTop:8}}>
          <div>
            <div style={{display:"flex", gap:6, marginBottom:6}}>
              <span className="badge" style={{background:"#fdeee9"}}>★ 4.8 · 12,400 reviews</span>
              <span className="badge">Updated today</span>
            </div>
            <h1 style={{fontSize:42}}><span className="squig">{p.country} Tourist Visa Checklist</span><br/>(2026, with free PDF)</h1>
            <p style={{marginTop:10, maxWidth:520}}>The only checklist that tells you what's <i>actually</i> required vs. what's "nice to have". Built from 5,000+ approved applications.</p>
            <div style={{display:"flex", gap:14, marginTop:14, flexWrap:"wrap"}}>
              {["✓ 10 required docs","✓ Real templates","✓ Visa-officer tested","✓ Free updates"].map(t => (
                <div key={t} style={{fontFamily:"Caveat", fontSize:17}}>{t}</div>
              ))}
            </div>
          </div>

          {/* Lead form card */}
          <div className="box shadow" style={{padding:16, background:"#fff4d3"}}>
            <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.08em"}}>Free download</div>
            <h3 style={{marginTop:4}}>Get the {p.country} checklist PDF</h3>
            <p style={{fontSize:12, marginTop:4}}>+ 7-day visa prep email course</p>
            <div className="stack-sm" style={{marginTop:10}}>
              <div className="box" style={{padding:"4px 10px", fontSize:12, background:"var(--paper)"}}>your name</div>
              <div className="box" style={{padding:"4px 10px", fontSize:12, background:"var(--paper)"}}>your@email.com</div>
              <div className="box" style={{padding:"4px 10px", fontSize:12, background:"var(--paper)", display:"flex", justifyContent:"space-between"}}><span>Travelling from: India</span><span>▾</span></div>
            </div>
            <div className="btn primary" style={{width:"100%", justifyContent:"center", marginTop:10}}>⤓ Send me the checklist</div>
            <div className="small center" style={{marginTop:6}}>No spam · unsubscribe anytime</div>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="strip" style={{display:"flex", justifyContent:"space-around", textAlign:"center"}}>
          {[["12,400+","approved last year"],["98%","first-try success rate"],["29 days","avg. processing"],["50,000+","newsletter readers"]].map(([n,l],i)=>(
            <div key={i}>
              <div style={{fontFamily:"Caveat", fontSize:32, lineHeight:1}}>{n}</div>
              <div className="small">{l}</div>
            </div>
          ))}
        </div>

        {/* Checklist preview */}
        {modules.checklist && (
          <section style={{marginTop:8}}>
            <div className="between"><h2>The checklist (preview)</h2><span className="small">First 4 of {p.items.length} shown · download for full</span></div>
            <div className="box">
              {p.items.slice(0,4).map((it, i) => <ChecklistItem key={i} item={it}/>)}
              <div className="box dashed" style={{marginTop:8, padding:10, textAlign:"center", background:"var(--paper-2)"}}>
                <div style={{fontFamily:"Caveat", fontSize:20}}>🔒 6 more documents below — get the full PDF</div>
                <div className="btn primary" style={{marginTop:6}}>Unlock full list →</div>
              </div>
            </div>
          </section>
        )}

        {/* Affiliate comparison */}
        {modules.affiliate && (
          <section style={{marginTop:22}}>
            <h2>Get help with your application</h2>
            <p>Compared and ranked by our team. We may earn a commission.</p>
            <div className="box" style={{padding:0, marginTop:8}}>
              <div className="row head" style={{padding:"6px 14px", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr"}}>
                <div>Service</div><div>Price</div><div>Speed</div><div>Rating</div><div></div>
              </div>
              {[["VisaHQ","$149","3 days","★ 4.7","Best overall"],
                ["iVisa","$129","5 days","★ 4.5","Cheapest"],
                ["Cardinal Mobility","$249","2 days","★ 4.9","Premium"]].map((r,i) => (
                <div className="row" key={i} style={{padding:"10px 14px", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", alignItems:"center"}}>
                  <div style={{fontFamily:"Caveat", fontSize:20}}>{r[0]}</div>
                  <div>{r[1]}</div>
                  <div>{r[2]}</div>
                  <div>{r[3]}</div>
                  <div><span className="btn accent" style={{padding:"3px 10px", fontSize:14}}>Visit ↗</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cross-sell */}
        <div className="grid-3" style={{marginTop:22}}>
          {[["Travel insurance","From $12/trip","Required for visa"],
            ["Flight bookings","Refundable holds","Used by 4,200 applicants"],
            ["Visa expert review","$49 flat","Reviewed in 24h"]].map(([t,p2,sub],i)=>(
            <div key={i} className="box shadow">
              <div className="small" style={{textTransform:"uppercase"}}>Recommended</div>
              <h4 style={{marginTop:4}}>{t}</h4>
              <div style={{fontFamily:"Caveat", fontSize:22, marginTop:4}}>{p2}</div>
              <div className="small">{sub}</div>
              <div className="btn" style={{marginTop:10}}>See offer →</div>
            </div>
          ))}
        </div>

        {/* Sticky bottom bar */}
        <div className="box" style={{background:"var(--ink)", color:"var(--paper)", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 14px", marginTop:22}}>
          <div style={{fontFamily:"Caveat", fontSize:18}}>Ready? Download the {p.country} checklist now</div>
          <div className="btn accent">⤓ Free PDF</div>
        </div>

        <Footer/>

        {annotate && <>
          <Anno top={70} right={10}>Sticky promo bar = always visible CTA</Anno>
          <Anno top={220} left={-12} flip>Email capture above the fold</Anno>
          <Anno top={420} right={10}>Gating list = strong lead gen, weaker SEO</Anno>
          <Anno top={680} left={-12} flip>Affiliate table = revenue per visit</Anno>
        </>}
      </div>
    </div>
  );
};

window.V4Conversion = V4Conversion;
