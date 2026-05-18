/* Document data for the wizard */

const DOCS = [
  {
    id: "passport",
    title: "Valid passport",
    summary: "6+ months validity, with at least 2 blank pages.",
    required: true,
    fileTypes: "PDF · JPG · PNG",
    checks: [
      { ok: true,  text: "6+ months validity beyond return" },
      { ok: true,  text: "At least 2 blank pages" },
      { ok: true,  text: "Photo page legible, not cropped" },
      { ok: false, text: "Signature page included (we'll prompt if missing)" },
    ],
    tips: [
      "Scan in colour at 300 DPI minimum.",
      "Don't cover the machine-readable strip.",
      "If renewed recently, include the old passport too.",
    ],
  },
  {
    id: "form",
    title: "Application form (IMM 5257)",
    summary: "The standard temporary resident visa form, filled and signed.",
    required: true,
    fileTypes: "PDF",
    checks: [
      { ok: true,  text: "Form opens in Adobe Reader" },
      { ok: true,  text: "All required fields complete" },
      { ok: true,  text: "Validated barcode visible on last page" },
      { ok: false, text: "Signature in section 11 (manually verify)" },
    ],
    tips: ["Use Adobe Reader, not browser preview, or barcodes won't generate."],
  },
  {
    id: "photos",
    title: "Recent photographs",
    summary: "Two photos, 35×45mm, white background, taken in the last 6 months.",
    required: true,
    fileTypes: "JPG · PNG",
    checks: [
      { ok: true,  text: "White / off-white background" },
      { ok: true,  text: "Neutral expression, mouth closed" },
      { ok: false, text: "No glasses or headwear (unless religious)" },
      { ok: true,  text: "Taken within 6 months" },
    ],
    tips: ["Studio prints on matte paper hold up better in heat & humidity."],
  },
  {
    id: "funds",
    title: "Proof of funds",
    summary: "Bank statements covering the last 4 months, ~CAD $100/day of stay.",
    required: true,
    fileTypes: "PDF",
    checks: [
      { ok: true,  text: "Covers last 4 months continuously" },
      { ok: true,  text: "Bank stamp / signature visible" },
      { ok: false, text: "Closing balance ≥ trip cost" },
      { ok: true,  text: "Name matches passport exactly" },
      { ok: false, text: "All pages present, none missing" },
    ],
    tips: [
      "Net banking PDFs work — make sure they're not screenshot images.",
      "Add a sponsor letter if balance is borderline.",
    ],
  },
  {
    id: "itinerary",
    title: "Travel itinerary",
    summary: "Tentative bookings — flights and hotels. No need to pay yet.",
    required: true,
    fileTypes: "PDF · JPG",
    checks: [
      { ok: true, text: "Round-trip dates within stated travel period" },
      { ok: true, text: "Hotel reservations cover full stay" },
      { ok: true, text: "Names match all applicants on this file" },
    ],
    tips: ["Use refundable bookings or hold-only fares — IRCC accepts reservations."],
  },
  {
    id: "invitation",
    title: "Letter of invitation",
    summary: "If staying with family or friends in Canada — notarized.",
    required: false,
    fileTypes: "PDF",
    checks: [
      { ok: true,  text: "Host's status (citizen / PR) declared" },
      { ok: true,  text: "Relationship described" },
      { ok: false, text: "Notarization stamp visible" },
    ],
    tips: ["Skip if you're staying in hotels."],
  },
  {
    id: "employment",
    title: "Employment letter",
    summary: "Job title, salary, leave approval, and return commitment.",
    required: true,
    fileTypes: "PDF",
    checks: [
      { ok: true,  text: "On company letterhead" },
      { ok: true,  text: "States approved leave dates" },
      { ok: true,  text: "Confirms position held on return" },
      { ok: false, text: "Signed by HR or manager" },
    ],
    tips: ["Self-employed? Substitute with business registration + GST returns."],
  },
  {
    id: "history",
    title: "Travel history",
    summary: "Old passports and prior visa pages.",
    required: false,
    fileTypes: "PDF · JPG · PNG",
    checks: [
      { ok: true, text: "Last 10 years covered" },
      { ok: true, text: "Pages with stamps & visas included" },
    ],
    tips: ["Strong history of compliant travel improves approval odds significantly."],
  },
  {
    id: "biometrics",
    title: "Biometrics receipt",
    summary: "CAD $85 fee, taken at a VAC within 30 days of application.",
    required: true,
    fileTypes: "PDF",
    checks: [
      { ok: true, text: "Receipt dated within 30 days" },
      { ok: true, text: "Biometric Instruction Letter (BIL) attached" },
    ],
    tips: ["Book biometrics same day as fee payment to avoid expiry."],
  },
  {
    id: "cover",
    title: "Cover letter",
    summary: "Purpose of visit, ties to home country, and return plan.",
    required: true,
    fileTypes: "PDF",
    checks: [
      { ok: true,  text: "Purpose clearly stated in first paragraph" },
      { ok: true,  text: "Strong ties listed (job, family, property)" },
      { ok: false, text: "Return commitment in closing paragraph" },
    ],
    tips: ["Keep it to one page. Visa officers spend < 2 minutes per file."],
  },
];

const COUNTRIES = {
  canada:   { flag: "🇨🇦", name: "Canada",        visa: "Tourist Visa (TRV)",  fee: "CAD $100", proc: "29 days avg.", blurb: "For citizens of countries that aren't visa-exempt." },
  usa:      { flag: "🇺🇸", name: "United States", visa: "B1/B2 Visitor",       fee: "USD $185", proc: "8–12 weeks",   blurb: "Combined business/tourism, in-person interview required." },
  schengen: { flag: "🇪🇺", name: "Schengen",      visa: "Type C Short-Stay",    fee: "EUR €90",  proc: "15 days avg.", blurb: "One visa, 27 European countries, max 90 days in 180." },
};

window.DOCS = DOCS;
window.COUNTRIES = COUNTRIES;
