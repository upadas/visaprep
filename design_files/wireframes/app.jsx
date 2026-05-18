/* App: lays out 5 wireframe variants on a design canvas with tweaks. */

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "page": "canada",
  "density": "default",
  "annotate": true,
  "mod_eligibility": true,
  "mod_checklist": true,
  "mod_process": true,
  "mod_cost": true,
  "mod_faq": true,
  "mod_related": true,
  "mod_trust": true,
  "mod_tool": true,
  "mod_ad": false,
  "mod_affiliate": true,
  "mod_compare": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);

  const modules = {
    eligibility: t.mod_eligibility,
    checklist: t.mod_checklist,
    process: t.mod_process,
    cost: t.mod_cost,
    faq: t.mod_faq,
    related: t.mod_related,
    trust: t.mod_trust,
    tool: t.mod_tool,
    ad: t.mod_ad,
    affiliate: t.mod_affiliate,
    compare: t.mod_compare,
  };

  const common = { page: t.page, modules, density: t.density, annotate: t.annotate };

  return (
    <>
      <DesignCanvas title="Visa Checklist · Wireframes" subtitle="5 structural variations · low-fi · annotated">
        <DCSection id="overview" title="Overview" subtitle="What we're exploring and why">
          <DCArtboard id="brief" label="Brief & approach" width={760} height={620}>
            <Brief/>
          </DCArtboard>
          <DCArtboard id="matrix" label="Variants at a glance" width={760} height={620}>
            <Matrix/>
          </DCArtboard>
        </DCSection>

        <DCSection id="variants" title="Wireframes" subtitle="5 takes on the same page · click any to focus">
          <DCArtboard id="v1" label="V1 · Classic SEO Article" width={1040} height={1480}>
            <V1Classic {...common} />
          </DCArtboard>
          <DCArtboard id="v2" label="V2 · Tool-First" width={1040} height={1280}>
            <V2ToolFirst {...common} />
          </DCArtboard>
          <DCArtboard id="v3" label="V3 · Editorial / Magazine" width={1040} height={1820}>
            <V3Editorial {...common} />
          </DCArtboard>
          <DCArtboard id="v4" label="V4 · Conversion-Optimised" width={1040} height={1620}>
            <V4Conversion {...common} />
          </DCArtboard>
          <DCArtboard id="v5" label="V5 · Topic Cluster Hub" width={1040} height={1640}>
            <V5Hub {...common} />
          </DCArtboard>
        </DCSection>

        <DCSection id="v2-tools" title="V2 · Tool sub-variants" subtitle="Three takes on the tool itself">
          <DCArtboard id="v2-a" label="A · Linear list" width={760} height={620}>
            <V2_ToolA_List p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="v2-b" label="B · Status columns" width={760} height={520}>
            <V2_ToolB_Kanban p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="v2-c" label="C · Guided wizard" width={760} height={520}>
            <V2_ToolC_Wizard p={window.PAGES[t.page]} />
          </DCArtboard>
        </DCSection>

        <DCSection id="v2-states" title="V2 · States" subtitle="Five points along the user journey">
          <DCArtboard id="s1" label="1 · First visit (empty)" width={760} height={460}>
            <V2_StateEmpty p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="s2" label="2 · Mid-progress" width={760} height={620}>
            <V2_StateMid p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="s3" label="3 · All checked" width={760} height={520}>
            <V2_StateComplete p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="s4" label="4 · Returning user" width={760} height={520}>
            <V2_StateReturning p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="s5" label="5 · After email signup" width={760} height={460}>
            <V2_StatePostSignup p={window.PAGES[t.page]} />
          </DCArtboard>
        </DCSection>

        <DCSection id="v2-extras" title="V2 · Detail screens" subtitle="Mobile, upload, sharing">
          <DCArtboard id="mob" label="Mobile" width={400} height={760}>
            <V2_Mobile p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="upload" label="Document upload" width={760} height={780}>
            <V2_Upload p={window.PAGES[t.page]} />
          </DCArtboard>
          <DCArtboard id="share" label="Sharing & collaboration" width={760} height={760}>
            <V2_Sharing p={window.PAGES[t.page]} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="View">
          <TweakSelect
            label="Page (template flex)"
            value={t.page}
            onChange={(v) => setTweak("page", v)}
            options={[
              { value: "canada", label: "🇨🇦 Canada Tourist Visa" },
              { value: "usa", label: "🇺🇸 USA B1/B2" },
              { value: "schengen", label: "🇪🇺 Schengen Type C" },
            ]}
          />
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "default", label: "Default" },
              { value: "spacious", label: "Spacious" },
            ]}
          />
          <TweakToggle label="Show annotations" value={t.annotate} onChange={(v) => setTweak("annotate", v)} />
        </TweakSection>

        <TweakSection title="Content modules">
          <TweakToggle label="Eligibility" value={t.mod_eligibility} onChange={(v) => setTweak("mod_eligibility", v)} />
          <TweakToggle label="The checklist" value={t.mod_checklist} onChange={(v) => setTweak("mod_checklist", v)} />
          <TweakToggle label="Step-by-step process" value={t.mod_process} onChange={(v) => setTweak("mod_process", v)} />
          <TweakToggle label="Cost breakdown" value={t.mod_cost} onChange={(v) => setTweak("mod_cost", v)} />
          <TweakToggle label="FAQ" value={t.mod_faq} onChange={(v) => setTweak("mod_faq", v)} />
          <TweakToggle label="Related guides" value={t.mod_related} onChange={(v) => setTweak("mod_related", v)} />
          <TweakToggle label="Trust signals" value={t.mod_trust} onChange={(v) => setTweak("mod_trust", v)} />
          <TweakToggle label="Tool / calculator promo" value={t.mod_tool} onChange={(v) => setTweak("mod_tool", v)} />
          <TweakToggle label="Comparison table" value={t.mod_compare} onChange={(v) => setTweak("mod_compare", v)} />
          <TweakToggle label="Affiliate offers" value={t.mod_affiliate} onChange={(v) => setTweak("mod_affiliate", v)} />
          <TweakToggle label="Ad slots" value={t.mod_ad} onChange={(v) => setTweak("mod_ad", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

/* ---------- Overview cards ---------- */

function Brief() {
  return (
    <div className="wf" style={{width:760, height:620, boxShadow:"none", border:"none", background:"transparent"}}>
      <div className="wf-inner" style={{padding:"24px 30px"}}>
        <div className="badge">Brief</div>
        <h1 style={{marginTop:8}}>Wireframing the <span className="squig">visa checklist page</span></h1>
        <p style={{marginTop:24, maxWidth:560}}>
          The current page reads as a long block of links and copy. We're exploring 5 structural directions
          before locking visual design — each makes a different bet about <i>what the page is for</i>.
        </p>

        <div className="grid-2" style={{marginTop:18}}>
          <div className="box">
            <h4>Assumptions</h4>
            <ul style={{paddingLeft:18, marginTop:6, fontSize:13, lineHeight:1.6}}>
              <li>Most traffic is informational ("what do I need…")</li>
              <li>A meaningful slice is transactional (ready to apply)</li>
              <li>Both lead-gen and affiliate revenue are on the table</li>
              <li>The checklist is replicated across 30+ countries</li>
            </ul>
          </div>
          <div className="box">
            <h4>Key questions these wireframes ask</h4>
            <ul style={{paddingLeft:18, marginTop:6, fontSize:13, lineHeight:1.6}}>
              <li>Article-shaped or app-shaped?</li>
              <li>Gate the list, or give it away?</li>
              <li>One-page or hub of sub-tabs?</li>
              <li>Trust through editorial, or social proof?</li>
            </ul>
          </div>
        </div>

        <h3 style={{marginTop:18}}>How to read these</h3>
        <p style={{maxWidth:560}}>
          All 5 use the same content. Use the <b>Tweaks</b> panel (toggle on the toolbar) to swap country,
          turn modules on/off, change density, and hide annotations. Click any artboard to enter focus mode.
        </p>
      </div>
    </div>
  );
}

function Matrix() {
  const rows = [
    ["V1 · Classic", "Long-form article + sticky TOC", "Informational searchers", "AdSense / display", "Lowest risk · safe SEO baseline"],
    ["V2 · Tool-first", "Interactive checklist as the hero", "Transactional users", "Email capture · tool upsell", "Highest engagement · weaker if JS fails"],
    ["V3 · Editorial", "Magazine feature with byline", "Trust-seeking readers", "Newsletter · premium ads", "Best for brand · highest production cost"],
    ["V4 · Conversion", "Lead form above fold + affiliate table", "Ready-to-buy users", "Email · affiliate · upsells", "Highest revenue · gating risks SEO"],
    ["V5 · Hub", "Topic cluster, checklist is one tab", "Multi-intent / repeat", "Cross-sell across visa types", "Strongest topical authority"],
  ];
  return (
    <div className="wf" style={{width:760, height:620, boxShadow:"none", border:"none", background:"transparent"}}>
      <div className="wf-inner" style={{padding:"24px 30px"}}>
        <div className="badge">Compare</div>
        <h1 style={{marginTop:8}}>5 variants <span className="squig">at a glance</span></h1>
        <div className="box" style={{marginTop:24, padding:0}}>
          <div className="row head" style={{padding:"8px 12px", gridTemplateColumns:"1.2fr 1.6fr 1.4fr 1.4fr 1.6fr"}}>
            <div>Variant</div><div>Approach</div><div>Best for</div><div>Revenue model</div><div>Trade-off</div>
          </div>
          {rows.map((r,i) => (
            <div key={i} className="row" style={{padding:"10px 12px", gridTemplateColumns:"1.2fr 1.6fr 1.4fr 1.4fr 1.6fr", alignItems:"flex-start"}}>
              <div style={{fontFamily:"Caveat", fontSize:18}}>{r[0]}</div>
              <div>{r[1]}</div>
              <div>{r[2]}</div>
              <div>{r[3]}</div>
              <div>{r[4]}</div>
            </div>
          ))}
        </div>
        <p style={{marginTop:18, maxWidth:560}}>
          These aren't mutually exclusive — V1 is a great default; V2's tool can live <i>inside</i> a V5 hub;
          V4's conversion modules drop into anything. Pick the spine, then mix.
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
