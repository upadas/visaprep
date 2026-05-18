/* V2 Detail — develops V2 Tool-First into a full flow:
   - 3 sub-variants of the tool itself (compact list, kanban, wizard)
   - 5 states (empty, mid-progress, complete, returning, post-signup)
   - Mobile layout
   - Document upload / verification screen
   - Sharing & collaboration screen
*/

/* ---------- shared bits used across V2 detail ---------- */

const ToolFrame = ({ children, w = 720, h, title, sub, header }) => (
  <div className="wf" style={{ width: w, ...(h ? { height: h } : {}) }}>
    {header}
    <div className="wf-inner" style={{ padding: "20px 24px 26px", position: "relative" }}>
      {title && (
        <div style={{ marginBottom: 14 }}>
          <div className="badge">{sub}</div>
          <h2 style={{ marginTop: 6 }}>{title}</h2>
        </div>
      )}
      {children}
    </div>
  </div>
);

const FilterRail = ({ compact }) => (
  <div style={{ padding: "14px 16px", borderRight: "1.5px solid var(--rule)", background: "var(--paper-2)", minWidth: compact ? 180 : 240 }}>
    <h4>Tell us about you</h4>
    <hr className="rule" style={{ margin: "6px 0" }} />
    <div className="stack-sm small">
      <div>
        <div className="small" style={{ textTransform: "uppercase" }}>Passport</div>
        <div className="box" style={{ padding: "3px 8px", marginTop: 3, display: "flex", justifyContent: "space-between" }}><span>India</span><span>▾</span></div>
      </div>
      <div>
        <div className="small" style={{ textTransform: "uppercase" }}>Purpose</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
          <span className="pill y">Tourism</span>
          <span className="pill">Family</span>
          {!compact && <span className="pill">Business</span>}
        </div>
      </div>
      <div>
        <div className="small" style={{ textTransform: "uppercase" }}>Stay</div>
        <div className="box" style={{ padding: "3px 8px", marginTop: 3 }}>14 days</div>
      </div>
      {!compact && (
        <div>
          <div className="small" style={{ textTransform: "uppercase" }}>Travelling with</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
            <span className="pill">Solo</span>
            <span className="pill y">Family</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ============ TOOL VARIANTS (sub-variations of V2's tool) ============ */

/* A — current list, refined */
const ToolA_List = ({ p }) => (
  <ToolFrame w={720} title="A · Linear list" sub="Default tool">
    <div className="box shadow" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        <FilterRail compact />
        <div style={{ padding: "14px 16px" }}>
          <div className="between">
            <div><h3>3 of {p.items.length} ready</h3><div className="small">Local progress · email to sync</div></div>
            <span className="btn">⤓ PDF</span>
          </div>
          <div className="progress" style={{ marginTop: 6 }}><i style={{ width: "30%" }} /></div>
          <div className="tabs" style={{ marginTop: 12 }}>
            <div className="tab active">Required</div>
            <div className="tab">Recommended</div>
            <div className="tab">Family</div>
          </div>
          {p.items.slice(0, 5).map((it, i) => <ChecklistItem key={i} item={it} />)}
        </div>
      </div>
    </div>
    <p style={{ marginTop: 10, fontSize: 12 }}>Strengths: scannable, familiar, fast. Trade: harder to see <i>structure</i> when there are 15+ items.</p>
  </ToolFrame>
);

/* B — kanban / status columns */
const ToolB_Kanban = ({ p }) => {
  const cols = [
    { t: "To do", items: p.items.slice(2, 6) },
    { t: "In progress", items: p.items.slice(6, 8) },
    { t: "Done", items: p.items.slice(0, 2) },
  ];
  return (
    <ToolFrame w={720} title="B · Status columns" sub="Project-tracker style">
      <div className="box shadow" style={{ padding: 14 }}>
        <div className="between" style={{ marginBottom: 10 }}>
          <h3>Application kanban</h3>
          <span className="btn">⤓ PDF</span>
        </div>
        <div className="grid-3">
          {cols.map((c) => (
            <div key={c.t} className="box fill" style={{ padding: 10 }}>
              <div className="between" style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: "Caveat", fontSize: 18 }}>{c.t}</div>
                <span className="pill">{c.items.length}</span>
              </div>
              <div className="stack-sm">
                {c.items.map((it, i) => (
                  <div key={i} className="box" style={{ padding: "6px 8px", background: "var(--paper)" }}>
                    <div style={{ fontFamily: "Caveat", fontSize: 16 }}>{it.t}</div>
                    <div className="small">{it.m}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ marginTop: 10, fontSize: 12 }}>Strengths: shows momentum at a glance, feels like work. Trade: less obvious "what's required" framing.</p>
    </ToolFrame>
  );
};

/* C — guided wizard, one doc at a time */
const ToolC_Wizard = ({ p }) => (
  <ToolFrame w={720} title="C · Guided wizard" sub="One document at a time">
    <div className="box shadow" style={{ padding: 14 }}>
      <div className="between">
        <div className="small">Step 3 of {p.items.length}</div>
        <span className="small">⏱ ~6 min remaining</span>
      </div>
      <div className="progress" style={{ marginTop: 6 }}><i style={{ width: "30%" }} /></div>
      <h2 style={{ marginTop: 14 }}>Recent photographs</h2>
      <p>2 copies, 35×45mm, white background, taken in the last 6 months.</p>

      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="box dashed" style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pencil)", fontFamily: "Caveat", fontSize: 18 }}>
          ⤴ Drop photo or upload
        </div>
        <div>
          <h4>Quick check</h4>
          <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            <li>White / off-white background</li>
            <li>No glasses or headwear (unless religious)</li>
            <li>Neutral expression, mouth closed</li>
            <li>Printed on matte paper</li>
          </ul>
        </div>
      </div>

      <div className="between" style={{ marginTop: 14, paddingTop: 12, borderTop: "1.5px dashed var(--rule)" }}>
        <span className="btn">← Back</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="btn">Skip</span>
          <span className="btn primary">Mark done →</span>
        </div>
      </div>
    </div>
    <p style={{ marginTop: 10, fontSize: 12 }}>Strengths: highest completion rate, lowest cognitive load. Trade: hides the full scope, harder to skim.</p>
  </ToolFrame>
);

/* ============ STATES ============ */

const StateEmpty = ({ p }) => (
  <ToolFrame w={720} title="First visit · empty" sub="State 1 of 5">
    <div className="box shadow" style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        <FilterRail compact />
        <div style={{ padding: 14 }}>
          <h3>Let's build your checklist</h3>
          <p style={{ fontSize: 13 }}>Tell us a bit about your trip — we'll tailor what you actually need.</p>
          <div className="box dashed" style={{ marginTop: 10, padding: 24, textAlign: "center", background: "var(--paper-2)" }}>
            <div style={{ fontFamily: "Caveat", fontSize: 28 }}>📋 Your list will appear here</div>
            <div className="small" style={{ marginTop: 4 }}>Set passport + purpose on the left to begin</div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <span className="btn primary">Use defaults & continue →</span>
            <span className="btn">See sample list</span>
          </div>
        </div>
      </div>
    </div>
  </ToolFrame>
);

const StateMid = ({ p }) => {
  const total = p.items.length;
  const done = 4;
  return (
    <ToolFrame w={720} title="Mid-progress" sub="State 2 of 5">
      <div className="box shadow" style={{ padding: 14 }}>
        <div className="between">
          <div><h3>{done} of {total} ready · keep going!</h3><div className="small">Last updated 12 min ago · auto-saved</div></div>
          <div style={{ display: "flex", gap: 6 }}><span className="btn">⤓ PDF</span><span className="btn">↗ Share</span></div>
        </div>
        <div className="progress" style={{ marginTop: 6 }}><i style={{ width: `${done / total * 100}%` }} /></div>

        <div className="box hi" style={{ marginTop: 12, padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <div className="ico" style={{ background: "#fff4d3" }}>💡</div>
          <div style={{ flex: 1, fontSize: 13 }}>Next up: <b>Proof of funds</b>. Most applicants spend 1 day on this — start with bank statements.</div>
          <span className="btn">Open</span>
        </div>

        <div style={{ marginTop: 10 }}>
          {p.items.slice(0, 6).map((it, i) => <ChecklistItem key={i} item={{ ...it, done: i < done }} />)}
        </div>
      </div>
    </ToolFrame>
  );
};

const StateComplete = ({ p }) => (
  <ToolFrame w={720} title="All checked · what next?" sub="State 3 of 5">
    <div className="box shadow" style={{ padding: 18, textAlign: "center", background: "#fff4d3" }}>
      <div style={{ fontFamily: "Caveat", fontSize: 50 }}>🎉</div>
      <h2>Your checklist is complete.</h2>
      <p style={{ maxWidth: 380, margin: "6px auto 0" }}>{p.items.length} of {p.items.length} documents marked ready. Time to assemble the application.</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
        <span className="btn primary">Review my packet →</span>
        <span className="btn">⤓ Download PDF</span>
        <span className="btn">Book a 15-min review · $49</span>
      </div>
    </div>
    <div className="grid-3" style={{ marginTop: 14 }}>
      {[["Travel insurance", "Required at port of entry"], ["Flight bookings", "Ready when you are"], ["Your trip", "Plan day-by-day"]].map(([t, s], i) => (
        <div key={i} className="box">
          <div className="small" style={{ textTransform: "uppercase" }}>Next up</div>
          <h4>{t}</h4>
          <div className="small" style={{ marginTop: 2 }}>{s}</div>
          <div className="btn" style={{ marginTop: 8 }}>See options</div>
        </div>
      ))}
    </div>
  </ToolFrame>
);

const StateReturning = ({ p }) => (
  <ToolFrame w={720} title="Returning user" sub="State 4 of 5">
    <div className="box" style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "#eef1ff", borderColor: "var(--accent)" }}>
      <div className="ico" style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--paper)" }}>P</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "Caveat", fontSize: 18 }}>Welcome back, Priya</div>
        <div className="small">Last visit 3 days ago · 7 of 10 ready</div>
      </div>
      <span className="btn">Sign out</span>
    </div>

    <div className="box shadow" style={{ marginTop: 10, padding: 14 }}>
      <div className="between"><h3>Pick up where you left off</h3><div className="small">⏱ Submission deadline: Feb 14</div></div>
      <div className="progress" style={{ marginTop: 6 }}><i style={{ width: "70%" }} /></div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="box hi">
          <h4>3 still to do</h4>
          <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
            <li>Letter of invitation</li>
            <li>Travel history pages</li>
            <li>Cover letter</li>
          </ul>
          <span className="btn primary" style={{ marginTop: 6 }}>Resume →</span>
        </div>
        <div className="box">
          <h4>Recent activity</h4>
          <ul className="small" style={{ paddingLeft: 18, lineHeight: 1.6 }}>
            <li>You uploaded passport.pdf · 3d ago</li>
            <li>Aman edited "Bank statements" · 2d ago</li>
            <li>System: biometrics receipt expires in 18 days</li>
          </ul>
        </div>
      </div>
    </div>
  </ToolFrame>
);

const StatePostSignup = ({ p }) => (
  <ToolFrame w={720} title="After email signup" sub="State 5 of 5">
    <div className="box shadow" style={{ padding: 14, background: "#eef1ff" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="ico" style={{ width: 36, height: 36, fontSize: 16, background: "var(--paper)" }}>✓</div>
        <div style={{ flex: 1 }}>
          <h3>You're synced.</h3>
          <p>We sent your checklist to <b>priya@example.com</b>. You'll get a 7-day mini-course on visa prep — one short email per day. Unsubscribe anytime.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            <span className="pill">Day 1 · Photos that pass</span>
            <span className="pill">Day 2 · Bank statements</span>
            <span className="pill">Day 3 · Cover letter template</span>
            <span className="pill">+4 more</span>
          </div>
        </div>
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: 12 }}>
      <div className="box">
        <h4>Continue your checklist</h4>
        <p className="small">Right where you left off.</p>
        <span className="btn primary" style={{ marginTop: 6 }}>Open checklist →</span>
      </div>
      <div className="box">
        <h4>Invite a co-applicant</h4>
        <p className="small">Sharing means both of you can edit and check off.</p>
        <span className="btn" style={{ marginTop: 6 }}>↗ Send invite</span>
      </div>
    </div>
  </ToolFrame>
);

/* ============ EXTRA SCREENS ============ */

const Mobile = ({ p }) => (
  <div className="wf" style={{ width: 360 }}>
    <div className="browser-bar" style={{ padding: "6px 10px" }}>
      <div className="dots"><span /><span /><span /></div>
      <div className="url" style={{ fontSize: 11 }}>visaprep.example.com/canada</div>
    </div>
    <div className="wf-inner" style={{ padding: 16 }}>
      <div className="badge">Mobile · 360w</div>
      <h2 style={{ marginTop: 6 }}><span className="squig">Canada checklist</span></h2>
      <div className="between" style={{ marginTop: 8 }}>
        <div className="small">3 of 10 ready</div>
        <div className="small">Auto-saved</div>
      </div>
      <div className="progress" style={{ marginTop: 4 }}><i style={{ width: "30%" }} /></div>

      <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto" }}>
        <span className="pill y">India</span>
        <span className="pill">Tourism</span>
        <span className="pill">14d</span>
        <span className="pill">Family</span>
      </div>

      <div className="tabs" style={{ marginTop: 12, fontSize: 13 }}>
        <div className="tab active" style={{ padding: "4px 10px" }}>Required</div>
        <div className="tab" style={{ padding: "4px 10px" }}>Rec.</div>
        <div className="tab" style={{ padding: "4px 10px" }}>Family</div>
      </div>

      <div className="box" style={{ padding: "0 10px", marginTop: 8 }}>
        {p.items.slice(0, 4).map((it, i) => <ChecklistItem key={i} item={it} />)}
      </div>

      <div className="box hi" style={{ marginTop: 10, padding: 8, fontSize: 12 }}>
        💡 Tap any item for sample templates and a yes/no checker.
      </div>

      {/* sticky bottom action */}
      <div className="box" style={{ marginTop: 14, padding: "10px 12px", display: "flex", gap: 8, justifyContent: "space-between", background: "var(--ink)", color: "var(--paper)" }}>
        <span style={{ fontFamily: "Caveat", fontSize: 16 }}>Save my progress</span>
        <span style={{ fontFamily: "Caveat", fontSize: 16 }}>✉ →</span>
      </div>
      <div className="small" style={{ textAlign: "center", marginTop: 8 }}>↑ Sticky bottom CTA — always reachable with thumb</div>
    </div>
  </div>
);

const Upload = ({ p }) => (
  <ToolFrame w={720} title="Document upload & verification" sub="Detail screen">
    <p style={{ marginTop: -6 }}>Tap an item from the checklist → users can upload and get instant feedback before submitting.</p>

    <div className="box shadow" style={{ marginTop: 10 }}>
      <div className="between">
        <div>
          <div className="small">Document 4 of 10</div>
          <h3>Bank statements</h3>
        </div>
        <div className="badge" style={{ background: "#fdeee9" }}>Required</div>
      </div>

      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="box dashed" style={{ minHeight: 180, padding: 14, background: "var(--paper-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: "Caveat", fontSize: 30 }}>⤴</div>
          <div style={{ fontFamily: "Caveat", fontSize: 18 }}>Drop PDF, or browse</div>
          <div className="small" style={{ marginTop: 4 }}>Max 10MB · PDF, JPG, PNG</div>
          <div className="btn" style={{ marginTop: 10 }}>Choose file</div>
        </div>

        <div>
          <h4>What we'll check for you</h4>
          <ul style={{ paddingLeft: 16, fontSize: 13, lineHeight: 1.6 }}>
            <li>✓ Covers last 4 months</li>
            <li>✓ Bank stamp / signature visible</li>
            <li>✓ Closing balance ≥ trip cost</li>
            <li>✓ Same name as passport</li>
            <li>✓ All pages, no gaps</li>
          </ul>
          <div className="small" style={{ marginTop: 6 }}>Files stay on your device until you choose to share.</div>
        </div>
      </div>
    </div>

    {/* example with verification result */}
    <div className="box shadow" style={{ marginTop: 14, padding: 14, background: "#eef1ff" }}>
      <div className="between" style={{ alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="ico">📄</div>
          <div>
            <div style={{ fontFamily: "Caveat", fontSize: 18 }}>HDFC_statement.pdf</div>
            <div className="small">8 pages · uploaded just now</div>
          </div>
        </div>
        <span className="badge" style={{ background: "#fff4d3" }}>3 of 5 checks pass</span>
      </div>
      <div className="stack-sm" style={{ marginTop: 10 }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13 }}>✓ <span>Covers last 4 months</span></div>
        <div style={{ display: "flex", gap: 8, fontSize: 13 }}>✓ <span>Bank stamp visible</span></div>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--accent-2)" }}>✕ <span>Closing balance below ~CAD $1,400 — consider adding a sponsor letter</span></div>
        <div style={{ display: "flex", gap: 8, fontSize: 13 }}>✓ <span>Name matches passport</span></div>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--accent-2)" }}>✕ <span>Page 4 missing — re-export with all pages</span></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <span className="btn primary">Re-upload</span>
        <span className="btn">Mark done anyway</span>
      </div>
    </div>
  </ToolFrame>
);

const Sharing = ({ p }) => (
  <ToolFrame w={720} title="Sharing & collaboration" sub="Detail screen">
    <p style={{ marginTop: -6 }}>Couples and families often apply together. The list becomes a shared workspace.</p>

    <div className="box shadow" style={{ marginTop: 10 }}>
      <div className="between">
        <h3>Who's on this checklist</h3>
        <span className="btn">+ Invite</span>
      </div>
      <div className="stack-sm" style={{ marginTop: 8 }}>
        {[["Priya", "Owner", "priya@example.com", true], ["Aman", "Editor", "aman@example.com", false], ["Mom", "View only", "—", false]].map(([n, r, e, owner], i) => (
          <div key={n} className="box" style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px" }}>
            <div className="ico" style={{ width: 30, height: 30, borderRadius: "50%", background: owner ? "#fff4d3" : "var(--paper)" }}>{n[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Caveat", fontSize: 18 }}>{n}</div>
              <div className="small">{e}</div>
            </div>
            <span className="pill">{r}</span>
            <span className="small">⋯</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid-2" style={{ marginTop: 14 }}>
      <div className="box">
        <h4>Share link</h4>
        <p className="small">Anyone with this link can view (not edit).</p>
        <div className="box" style={{ marginTop: 8, padding: "4px 10px", fontFamily: "Caveat", fontSize: 14, background: "var(--paper-2)", display: "flex", justifyContent: "space-between" }}>
          <span>visaprep.example.com/c/8a4f…</span>
          <span>copy</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <span className="pill y">View only</span>
          <span className="pill">Can edit</span>
          <span className="pill">Disabled</span>
        </div>
      </div>

      <div className="box">
        <h4>Activity feed</h4>
        <ul className="small" style={{ paddingLeft: 18, lineHeight: 1.7 }}>
          <li><b>Aman</b> ticked off Travel itinerary · 2h ago</li>
          <li><b>Aman</b> uploaded HDFC_statement.pdf · 2h ago</li>
          <li><b>Priya</b> invited Mom · 1d ago</li>
          <li><b>System</b> reminded: biometrics expire 18d · 2d ago</li>
        </ul>
      </div>
    </div>

    <div className="box hi" style={{ marginTop: 14, padding: 12, fontSize: 13 }}>
      🛡 Privacy: shared lists never include uploaded files unless you explicitly attach them. Files stay on the owner's device by default.
    </div>
  </ToolFrame>
);

window.V2_ToolA_List = ToolA_List;
window.V2_ToolB_Kanban = ToolB_Kanban;
window.V2_ToolC_Wizard = ToolC_Wizard;
window.V2_StateEmpty = StateEmpty;
window.V2_StateMid = StateMid;
window.V2_StateComplete = StateComplete;
window.V2_StateReturning = StateReturning;
window.V2_StatePostSignup = StatePostSignup;
window.V2_Mobile = Mobile;
window.V2_Upload = Upload;
window.V2_Sharing = Sharing;
