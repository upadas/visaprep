/* Sample content for the wireframes — visa checklist page */
const PAGES = {
  canada: {
    country: "Canada",
    visa: "Tourist Visa (TRV)",
    flag: "🇨🇦",
    duration: "Up to 6 months",
    fee: "CAD $100",
    processing: "29 days avg.",
    blurb: "Visitor visa for citizens of countries that aren't visa-exempt. Required for most South Asian, African, and parts of Eastern European passports.",
    items: [
      { t: "Valid passport", m: "6+ months validity, 2 blank pages", done: true },
      { t: "Completed IMM 5257 form", m: "Application for temporary resident visa", done: true },
      { t: "Recent photographs", m: "2x 35mm × 45mm, white background, last 6 months" },
      { t: "Proof of funds", m: "Bank statements, last 4 months, ~CAD $100/day of stay" },
      { t: "Travel itinerary", m: "Flight bookings (no need to pay yet), hotel reservations" },
      { t: "Letter of invitation", m: "If staying with family/friends — required notarized" },
      { t: "Employment letter", m: "Job title, salary, leave approval, return commitment" },
      { t: "Travel history", m: "Old passports, prior visas, entry/exit stamps" },
      { t: "Biometrics receipt", m: "CAD $85, completed at VAC within 30 days" },
      { t: "Cover letter", m: "Purpose of visit, ties to home country, return plan" },
    ]
  },
  usa: {
    country: "United States",
    visa: "B1/B2 Visitor Visa",
    flag: "🇺🇸",
    duration: "Up to 6 months/visit",
    fee: "USD $185",
    processing: "8–12 weeks",
    blurb: "Combined business/tourism visa requiring an in-person interview at a US embassy or consulate.",
    items: [
      { t: "Valid passport", m: "6+ months beyond stay" },
      { t: "DS-160 confirmation page", m: "Online non-immigrant application" },
      { t: "MRV fee receipt", m: "USD $185, paid before scheduling" },
      { t: "Visa interview appointment", m: "Scheduled at nearest US consulate" },
      { t: "Recent photograph", m: "5cm × 5cm, white background" },
      { t: "Proof of strong ties", m: "Property, family, employment in home country" },
      { t: "Bank statements", m: "Last 6 months, demonstrating funds" },
      { t: "Tax returns", m: "Last 2–3 years" },
      { t: "Travel itinerary", m: "Tentative — no bookings required" },
      { t: "Invitation letter", m: "If applicable, from US-based host" },
    ]
  },
  schengen: {
    country: "Schengen (EU)",
    visa: "Type C Short-Stay",
    flag: "🇪🇺",
    duration: "90 days in 180",
    fee: "EUR €90",
    processing: "15 days avg.",
    blurb: "Single visa for 27 European countries. Apply at the consulate of your main destination.",
    items: [
      { t: "Schengen application form", m: "Signed, two copies" },
      { t: "Passport", m: "3+ months validity beyond return, issued < 10 yrs" },
      { t: "Travel insurance", m: "€30,000+ medical coverage, all Schengen states" },
      { t: "Flight reservation", m: "Round-trip, dummy bookings accepted" },
      { t: "Hotel booking", m: "Or invitation letter from host" },
      { t: "Bank statements", m: "Last 3 months, ~€60/day proof" },
      { t: "Cover letter", m: "Itinerary day-by-day, purpose, return commitment" },
      { t: "Photos", m: "2x biometric, 35×45mm" },
      { t: "Employment proof", m: "NOC letter, contract, leave approval" },
    ]
  }
};

const FAQ = [
  { q: "How long does the Canada tourist visa take?", a: "29 days on average; varies by country of residence." },
  { q: "Do I need to book flights before applying?", a: "No — itinerary/reservations are enough. Don't pay yet." },
  { q: "What's the success rate for first-time applicants?", a: "Roughly 67% globally; higher with strong ties and history." },
  { q: "Can I extend my stay once in Canada?", a: "Yes, apply 30 days before your status expires." },
  { q: "Is biometrics required every time?", a: "Once every 10 years for most applicants." },
  { q: "What if I'm refused?", a: "You can reapply with new info; refusal letters spell out the reason." },
];

const RELATED = [
  "Canada Super Visa for parents",
  "Canada Study Permit checklist",
  "Canada Work Permit (LMIA & open)",
  "USA B1/B2 vs Canada Tourist",
  "Schengen visa for Indians",
];

window.PAGES = PAGES;
window.FAQ = FAQ;
window.RELATED = RELATED;
