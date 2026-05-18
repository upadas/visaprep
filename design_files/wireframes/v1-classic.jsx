/* V1 — Classic SEO content layout
   Long-form article structure with sticky table of contents on the right.
   The "by-the-book" baseline that ranks well for informational queries. */

const V1Classic = ({ page, modules, density, annotate }) => {
  const p = window.PAGES[page];
  const pad = density === "compact" ? "20px 26px 28px" : density === "spacious" ? "36px 40px 44px" : "28px 30px 36px";
  return (
    <div className="wf" style={{ width: 980 }}>
      <span className="page-tag">V1 · Classic SEO Article</span>
      <BrowserBar url={`visaprep.example.com/${page}/tourist-visa-checklist`} />
      <div className="wf-inner" style={{padding: pad, position:"relative"}}>
        <Nav />
        <Hero p={p} variant="classic" />

        {modules.trust && <div style={{marginTop:14}}><TrustBar/></div>}

        <div style={{display:"grid", gridTemplateColumns:"1fr 220px", gap:28, marginTop:22}}>
          <div className="stack-lg">
            {/* Eligibility */}
            {modules.eligibility && (
              <section>
                <h2>Who needs this visa?</h2>
                <Lines count={3} />
                <div className="grid-2" style={{marginTop:10}}>
                  <div className="box dashed">
                    <h4>You DO need it if…</h4>
                    <Lines count={3} widths={["long","med","short"]}/>
                  </div>
                  <div className="box dashed">
                    <h4>You DON'T if…</h4>
                    <Lines count={3} widths={["long","med","short"]}/>
                  </div>
                </div>
              </section>
            )}

            {/* The checklist */}
            {modules.checklist && (
              <section>
                <div className="between">
                  <h2>The complete document checklist</h2>
                  <span className="btn accent">⤓ Download PDF</span>
                </div>
                <p>Every document IRCC asks for, in the order you should prepare them.</p>
                <div className="box" style={{marginTop:10, padding:"4px 14px"}}>
                  {p.items.slice(0, 8).map((it, i) => (
                    <ChecklistItem key={i} item={it} />
                  ))}
                </div>
              </section>
            )}

            {/* Process */}
            {modules.process && (
              <section>
                <h2>Step-by-step process</h2>
                <div className="stack" style={{marginTop:10}}>
                  {["Gather documents","Pay fees online","Submit + biometrics","Wait & track","Decision"].map((s, i) => (
                    <div className="box" key={i} style={{display:"flex", gap:14, alignItems:"center"}}>
                      <div style={{width:32, height:32, border:"1.8px solid var(--rule)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Caveat", fontSize:18, background:"#fff4d3"}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"Caveat", fontSize:18}}>{s}</div>
                        <Lines count={1} widths={["med"]}/>
                      </div>
                      <div className="small">~ 2 days</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {modules.ad && <Ad label="Ad · in-content rectangle 300×250 (visible after 1st scroll)"/>}

            {/* Cost */}
            {modules.cost && (
              <section>
                <h2>What it actually costs</h2>
                <div className="box" style={{padding:0}}>
                  <div className="row head" style={{padding:"6px 14px"}}>
                    <div>Item</div><div>Fee</div><div>Paid to</div><div>Refundable?</div>
                  </div>
                  {[["Visa fee", p.fee, "IRCC", "No"],
                    ["Biometrics", "CAD $85", "VAC", "No"],
                    ["VAC service", "CAD $25", "VFS Global", "No"],
                    ["Photos", "~$15", "Studio", "—"]].map((r, i) => (
                    <div className="row" key={i} style={{padding:"8px 14px"}}>{r.map((c, j) => <div key={j}>{c}</div>)}</div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {modules.faq && (
              <section>
                <h2>Frequently asked</h2>
                <div style={{marginTop:6}}>
                  {window.FAQ.slice(0, 5).map((f, i) => <FaqRow key={i} q={f.q} open={i===0}/>)}
                </div>
              </section>
            )}

            {/* Related */}
            {modules.related && (
              <section>
                <h2>Related guides</h2>
                <div className="grid-2" style={{marginTop:8}}>
                  {window.RELATED.slice(0,4).map((r, i) => (
                    <div className="box" key={i} style={{display:"flex", gap:10, alignItems:"center"}}>
                      <div className="ico">📄</div>
                      <div style={{flex:1, fontFamily:"Caveat", fontSize:17}}>{r}</div>
                      <span style={{fontSize:18}}>→</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky right rail */}
          <aside>
            <div className="sticky-card stack">
              <div className="box shadow">
                <div className="small" style={{textTransform:"uppercase", letterSpacing:"0.06em"}}>On this page</div>
                <hr className="rule" style={{margin:"6px 0"}}/>
                <div>
                  {["Who needs it","Checklist","Process","Costs","FAQ","Related"].map((n, i) => (
                    <div key={n} className={"rail-item" + (i===1 ? " active" : "")}>{n}</div>
                  ))}
                </div>
              </div>
              {modules.tool && (
                <div className="box tinted">
                  <h4>Try our visa tool</h4>
                  <p style={{fontSize:12, marginTop:4}}>Personalize this checklist to your case in 2 min.</p>
                  <div className="btn primary" style={{marginTop:8}}>Start free →</div>
                </div>
              )}
              {modules.ad && <Ad label="Sidebar 300×600"/>}
            </div>
          </aside>
        </div>

        <Footer/>

        {annotate && <>
          <Anno top={92} right={16}>Trust signals: author, sources, last updated</Anno>
          <Anno top={300} left={-12} flip>Sticky TOC = lower bounce, more dwell time</Anno>
          <Anno top={620} right={16}>Internal linking → keeps users on site, helps SEO</Anno>
        </>}
      </div>
    </div>
  );
};

window.V1Classic = V1Classic;
