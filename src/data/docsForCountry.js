const BASE_DOCS = [
  {
    id: 'passport',
    title: 'Valid passport',
    summary: '6+ months validity, with at least 2 blank pages.',
    required: true,
    fileTypes: 'PDF · JPG · PNG',
    checks: [
      { ok: true,  text: '6+ months validity beyond return' },
      { ok: true,  text: 'At least 2 blank pages' },
      { ok: true,  text: 'Photo page legible, not cropped' },
      { ok: false, text: "Signature page included (we'll prompt if missing)" },
    ],
    tips: [
      'Scan in colour at 300 DPI minimum.',
      "Don't cover the machine-readable strip.",
      'If renewed recently, include the old passport too.',
    ],
  },
  {
    id: 'form',
    title: 'Application form (IMM 5257)',
    summary: 'The standard temporary resident visa form, filled and signed.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Form opens in Adobe Reader' },
      { ok: true,  text: 'All required fields complete' },
      { ok: true,  text: 'Validated barcode visible on last page' },
      { ok: false, text: 'Signature in section 11 (manually verify)' },
    ],
    tips: ["Use Adobe Reader, not browser preview, or barcodes won't generate."],
  },
  {
    id: 'photos',
    title: 'Recent photographs',
    summary: 'Two photos, 35×45mm, white background, taken in the last 6 months.',
    required: true,
    fileTypes: 'JPG · PNG',
    checks: [
      { ok: true,  text: 'White / off-white background' },
      { ok: true,  text: 'Neutral expression, mouth closed' },
      { ok: false, text: 'No glasses or headwear (unless religious)' },
      { ok: true,  text: 'Taken within 6 months' },
    ],
    tips: ['Studio prints on matte paper hold up better in heat & humidity.'],
  },
  {
    id: 'funds',
    title: 'Proof of funds',
    summary: 'Bank statements covering the last 4 months, ~CAD $100/day of stay.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Covers last 4 months continuously' },
      { ok: true,  text: 'Bank stamp / signature visible' },
      { ok: false, text: 'Closing balance ≥ trip cost' },
      { ok: true,  text: 'Name matches passport exactly' },
      { ok: false, text: 'All pages present, none missing' },
    ],
    tips: [
      "Net banking PDFs work — make sure they're not screenshot images.",
      'Add a sponsor letter if balance is borderline.',
    ],
  },
  {
    id: 'itinerary',
    title: 'Travel itinerary',
    summary: 'Tentative bookings — flights and hotels. No need to pay yet.',
    required: true,
    fileTypes: 'PDF · JPG',
    checks: [
      { ok: true, text: 'Round-trip dates within stated travel period' },
      { ok: true, text: 'Hotel reservations cover full stay' },
      { ok: true, text: 'Names match all applicants on this file' },
    ],
    tips: ['Use refundable bookings or hold-only fares — the visa office accepts reservations.'],
  },
  {
    id: 'invitation',
    title: 'Letter of invitation',
    summary: 'If staying with family or friends — notarized.',
    required: false,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: "Host's status declared" },
      { ok: true,  text: 'Relationship described' },
      { ok: false, text: 'Notarization stamp visible' },
    ],
    tips: ["Skip if you're staying in hotels."],
  },
  {
    id: 'employment',
    title: 'Employment letter',
    summary: 'Job title, salary, leave approval, and return commitment.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'On company letterhead' },
      { ok: true,  text: 'States approved leave dates' },
      { ok: true,  text: 'Confirms position held on return' },
      { ok: false, text: 'Signed by HR or manager' },
    ],
    tips: ['Self-employed? Substitute with business registration + tax returns.'],
  },
  {
    id: 'history',
    title: 'Travel history',
    summary: 'Old passports and prior visa pages.',
    required: false,
    fileTypes: 'PDF · JPG · PNG',
    checks: [
      { ok: true, text: 'Last 10 years covered' },
      { ok: true, text: 'Pages with stamps & visas included' },
    ],
    tips: ['Strong history of compliant travel improves approval odds significantly.'],
  },
  {
    id: 'biometrics',
    title: 'Biometrics receipt',
    summary: 'Fee paid and fingerprints taken at an authorised centre.',
    required: false,
    fileTypes: 'PDF',
    checks: [
      { ok: true, text: 'Receipt dated within 30 days' },
      { ok: true, text: 'Instruction letter attached' },
    ],
    tips: ['Book biometrics same day as fee payment to avoid expiry.'],
  },
  {
    id: 'cover',
    title: 'Cover letter',
    summary: 'Purpose of visit, ties to home country, and return plan.',
    required: true,
    fileTypes: 'PDF',
    checks: [
      { ok: true,  text: 'Purpose clearly stated in first paragraph' },
      { ok: true,  text: 'Strong ties listed (job, family, property)' },
      { ok: false, text: 'Return commitment in closing paragraph' },
    ],
    tips: ['Keep it to one page. Visa officers spend < 2 minutes per file.'],
  },
]

const BIOMETRIC_COUNTRIES = new Set(['canada', 'uk', 'usa', 'schengen', 'australia'])

const OVERRIDES = {
  canada: {
    form:  { title: 'Application form (IMM 5257)', summary: 'The standard temporary resident visa form, filled and signed.' },
    funds: { summary: 'Bank statements covering the last 4 months, ~CAD $100/day of stay.' },
    biometrics: { summary: 'CAD $85 fee, taken at a VAC within 30 days of application.', tips: ['Book biometrics same day as fee payment to avoid expiry.'] },
  },
  usa: {
    form:  { title: 'Application form (DS-160)', summary: 'The Online Nonimmigrant Visa Application DS-160, submitted via CEAC portal.' },
    funds: { summary: 'Bank statements for last 3 months showing ~USD $100/day of planned stay.' },
    biometrics: { summary: 'USD $85 MRV fee paid; fingerprints at US Embassy/Consulate on interview day.', tips: ['Schedule your visa interview early — slots fill weeks in advance.'] },
  },
  uk: {
    form:  { title: 'Online application (VAF — UK Visas)', summary: 'Complete the Standard Visitor VAF form online via UKVI and pay before booking biometrics.' },
    funds: { summary: 'Bank statements showing at least £50/day for the duration of your visit.' },
    biometrics: { summary: 'GBP £19.20 fee, fingerprints at a UKVCAS service point.', tips: ['Book biometrics appointment immediately after submitting the online form.'] },
  },
  schengen: {
    form:  { title: 'Schengen Application Form (Annex I)', summary: 'Uniform Schengen Visa Application Form, signed and dated, submitted to the embassy of the main destination.' },
    funds: { summary: 'Bank statements showing €100/day (minimum €500 for the whole trip).' },
    biometrics: { summary: 'EUR €0 (included in visa fee); fingerprints at the consulate or authorised VAC.', tips: ['Biometrics may be waived if collected within the last 59 months — check with the consulate.'] },
  },
  australia: {
    form:  { title: 'Online application (Form 1419 — subclass 600)', summary: 'Tourist Visa subclass 600 application lodged online via ImmiAccount.' },
    funds: { summary: 'Bank statements showing AUD $5,000+ or AUD $1,000/month for the duration.' },
    biometrics: { summary: 'AUD $0 (no separate fee); health exam and biometrics collected at a panel clinic if requested.', tips: ['You may be asked for biometrics after lodging — respond to the request within the given timeframe.'] },
  },
  japan: {
    form:  { title: 'Visa Application Form (Ministry of Foreign Affairs)', summary: 'Japan tourist visa application form, signed, with recent photo affixed.' },
    funds: { summary: 'Bank statements for last 3 months — typically JPY ¥10,000/day (approx. USD $70/day).' },
  },
  southkorea: {
    form:  { title: 'Visa Application Form (Form No. 17)', summary: 'Korean visa application form submitted at the Korean Embassy or Consulate.' },
    funds: { summary: 'Bank statements for last 3–6 months with a minimum balance of USD $3,000 or equivalent.' },
  },
  uae: {
    form:  { title: 'Online Visa Application (ICA Portal)', summary: 'UAE tourist visa applied through the ICA (Federal Authority for Identity) online portal.' },
    funds: { summary: 'Bank statements showing AED 4,000+ or USD $1,000+ for the trip duration.' },
  },
  singapore: {
    form:  { title: 'SAVE Application (ICA e-Service)', summary: 'Short-Term Visit Pass application submitted online via the Singapore ICA SAVE portal.' },
    funds: { summary: 'Bank statements showing SGD $1,000+ or USD $750+ for the stay.' },
  },
  newzealand: {
    form:  { title: 'Visitor Visa Application (INZ 1017)', summary: 'New Zealand Visitor Visa application form lodged online via Immigration New Zealand.' },
    funds: { summary: 'Evidence of NZD $1,000/month of stay or NZD $400 if accommodation is prepaid.' },
  },
  china: {
    form:  { title: 'Visa Application Form (Form V.2013)', summary: 'China L-category tourist visa application, completed online and printed for submission at the consulate.' },
    funds: { summary: 'Bank statements for last 3 months showing CNY ¥500/day (approx. USD $70/day).' },
  },
  thailand: {
    form:  { title: 'Thailand e-Visa Application (TR)', summary: 'Thailand TR tourist visa applied online via the Thailand e-Visa portal.' },
    funds: { summary: 'Bank statements showing THB 20,000+ per person for the trip.' },
  },
  malaysia: {
    form:  { title: 'eNTRI / Visa Application (eVISA Malaysia)', summary: 'Malaysia eNTRI note or single-entry visa applied online via the eVISA Malaysia portal.' },
    funds: { summary: 'Bank statements showing MYR 1,000+ or USD $250+ for the stay.' },
  },
  indonesia: {
    form:  { title: 'e-VOA Application (Molina Portal)', summary: 'Indonesia e-Visa on Arrival (e-VOA) applied online before travel via the Molina portal.' },
    funds: { summary: 'Bank statements showing IDR 5,000,000+ or USD $350+ for the trip.' },
  },
  india: {
    form:  { title: 'India e-Tourist Visa Application (indianvisaonline.gov.in)', summary: 'e-Tourist Visa applied online; two entries allowed in 30/90/365-day options.' },
    funds: { summary: 'Bank statements showing USD $25/day or USD $500 for the trip (whichever is higher).' },
  },
  brazil: {
    form:  { title: 'Brazil Tourist Visa Application (VITEM II)', summary: 'Brazilian VITEM II tourist visa submitted at the Brazilian Consulate.' },
    funds: { summary: 'Bank statements for last 3 months showing BRL 1,500+ or USD $300+ for the trip.' },
  },
  mexico: {
    form:  { title: 'Forma Migratoria Múltiple (FMM)', summary: 'Mexico FMM tourist card — can be filled online or on arrival at the port of entry.' },
    funds: { summary: 'Bank statements showing USD $200 per person for the trip or credit card proof of funds.' },
  },
  turkey: {
    form:  { title: 'Turkey e-Visa Application (evisa.gov.tr)', summary: 'Turkish e-Visa applied online at the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the stay.' },
  },
  egypt: {
    form:  { title: 'Egypt e-Visa Application (visa2egypt.gov.eg)', summary: 'Egypt tourist visa applied online via the official Egyptian e-Visa portal.' },
    funds: { summary: 'Bank statements showing USD $30/day or USD $300 minimum for the trip.' },
  },
  morocco: {
    form:  { title: 'Entry Declaration Form', summary: 'Morocco entry stamp on arrival — no advance visa required. Complete the entry form at the border.' },
    funds: { summary: 'Bank statements or cash equivalent of MAD 1,000+ (approx. USD $100) per week.' },
  },
  southafrica: {
    form:  { title: "South Africa Visitor's Visa Application (BI-84)", summary: "South Africa visitor's visa using form BI-84 submitted at the nearest South African embassy." },
    funds: { summary: 'Bank statements for last 3 months showing ZAR 10,000+ or USD $550+ for the stay.' },
  },
  vietnam: {
    form:  { title: 'Vietnam e-Visa Application (evisa.xuatnhapcanh.gov.vn)', summary: 'Vietnam e-Visa applied online via the official government portal — single or multiple entry.' },
    funds: { summary: 'Bank statements showing USD $25/day or USD $300 minimum for the trip.' },
  },
  philippines: {
    form:  { title: 'Philippines Visa Application (9a)', summary: 'Tourist visa (9a) application submitted at the Philippine Embassy or Consulate.' },
    funds: { summary: 'Bank statements showing PHP 10,000+ or USD $180+ for the duration of stay.' },
  },
  srilanka: {
    form:  { title: 'Sri Lanka ETA Application (eta.gov.lk)', summary: 'Sri Lanka Electronic Travel Authorisation (ETA) applied online before travel.' },
    funds: { summary: 'Bank statements showing USD $30/day or USD $250 minimum for the trip.' },
  },
  nepal: {
    form:  { title: 'Nepal Tourist Visa Application (online or on arrival)', summary: 'Nepal tourist visa applied online via the Nepal immigration portal or on arrival at Tribhuvan Airport.' },
    funds: { summary: 'Bank statements or cash of USD $25/day — USD $30/day average recommended.' },
  },
  kenya: {
    form:  { title: 'Kenya e-Visa Application (evisa.go.ke)', summary: 'Kenya e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the trip.' },
  },
  tanzania: {
    form:  { title: 'Tanzania e-Visa Application (eservices.immigration.go.tz)', summary: 'Tanzania tourist e-Visa applied online — also available on arrival at Kilimanjaro and Julius Nyerere airports.' },
    funds: { summary: 'Bank statements showing USD $50/day or USD $500 minimum for the trip.' },
  },
  qatar: {
    form:  { title: 'Qatar e-Visa Application (Hayya platform)', summary: 'Qatar tourist e-Visa applied online via the Hayya platform or on arrival for eligible nationalities.' },
    funds: { summary: 'Bank statements showing USD $30/day or QAR 500+ for the duration.' },
  },
  saudi: {
    form:  { title: 'Saudi Arabia e-Visa Application (visa.visitsaudi.com)', summary: 'Saudi Arabia tourist e-Visa applied online at the official Visit Saudi portal.' },
    funds: { summary: 'Bank statements showing SAR 200/day or USD $55/day for the trip.' },
  },
  oman: {
    form:  { title: 'Oman e-Visa Application (evisa.rop.gov.om)', summary: 'Oman e-Visa applied online via the Royal Oman Police portal.' },
    funds: { summary: 'Bank statements showing OMR 25/day or USD $65/day for the stay.' },
  },
  jordan: {
    form:  { title: 'Jordan Visa Application (jordan.gov.jo)', summary: 'Jordan visitor visa applied online or on arrival at most ports of entry.' },
    funds: { summary: 'Bank statements showing JOD 40+ for the trip or credit card with USD $200 limit.' },
  },
  georgia: {
    form:  { title: 'Georgia e-Visa Application (evisa.gov.ge)', summary: 'Georgia e-Visa applied online — many nationalities are visa-free for up to 365 days.' },
    funds: { summary: 'Bank statements showing GEL 50/day or USD $20/day for the stay.' },
  },
  armenia: {
    form:  { title: 'Armenia e-Visa Application (evisa.mfa.am)', summary: 'Armenia e-Visa applied online via the Ministry of Foreign Affairs portal.' },
    funds: { summary: 'Bank statements showing AMD 10,000/day or USD $25/day for the trip.' },
  },
  kazakh: {
    form:  { title: 'Kazakhstan e-Visa Application (evisa.mfa.kz)', summary: 'Kazakhstan e-Visa applied online via the Ministry of Foreign Affairs portal.' },
    funds: { summary: 'Bank statements showing USD $30/day or KZT 15,000/day for the stay.' },
  },
  azerbaijan: {
    form:  { title: 'Azerbaijan ASAN e-Visa Application (evisa.gov.az)', summary: 'Azerbaijan ASAN e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing AZN 30/day or USD $18/day for the trip.' },
  },
  bahrain: {
    form:  { title: 'Bahrain e-Visa Application (evisa.gov.bh)', summary: 'Bahrain e-Visa applied online via the government portal or on arrival at Bahrain International Airport.' },
    funds: { summary: 'Bank statements showing BHD 20/day or USD $55/day for the stay.' },
  },
  maldives: {
    form:  { title: 'Maldives Arrival Card', summary: 'Maldives issues a 30-day tourist visa free on arrival. Complete the arrival card before landing.' },
    funds: { summary: 'Bank statements showing USD $100/day or MVR 1,500/day — hotel bookings accepted as proof.' },
  },
  rwanda: {
    form:  { title: 'Rwanda e-Visa Application (irembo.gov.rw)', summary: 'Rwanda e-Visa applied online via the Irembo government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or RWF 60,000/day for the trip.' },
  },
  ethiopia: {
    form:  { title: 'Ethiopia e-Visa Application (evisa.gov.et)', summary: 'Ethiopia tourist e-Visa applied online via the official government portal.' },
    funds: { summary: 'Bank statements showing USD $50/day or ETB 5,000/day for the stay.' },
  },
  cambodia: {
    form:  { title: 'Cambodia e-Visa Application (evisa.gov.kh)', summary: 'Cambodia e-Visa (T) applied online — also available on arrival at major ports.' },
    funds: { summary: 'Bank statements showing USD $30/day or KHR 125,000/day for the trip.' },
  },
}

export function getDocsForCountry(countryKey) {
  const overrides = OVERRIDES[countryKey] ?? OVERRIDES.canada
  const requiresBiometrics = BIOMETRIC_COUNTRIES.has(countryKey)

  return BASE_DOCS.map((doc) => {
    const docOverride = overrides[doc.id]
    const base = { ...doc, checks: doc.checks.map((c) => ({ ...c })), tips: [...doc.tips] }

    if (doc.id === 'biometrics') {
      base.required = requiresBiometrics
    }

    if (docOverride) {
      return { ...base, ...docOverride }
    }

    return base
  })
}
