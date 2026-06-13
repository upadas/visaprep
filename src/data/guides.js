export const GUIDES = {
  canada: [
    {
      id: 'form',
      title: 'How to complete IMM 5257',
      blurb: 'Step-by-step walkthrough of the IRCC Temporary Resident Visa form — from personal details to the validation barcode.',
      sections: [
        {
          heading: 'What this form is',
          body: 'IMM 5257 is the Temporary Resident Visa (TRV) application form issued by Immigration, Refugees and Citizenship Canada (IRCC). It collects your personal details, travel history, and purpose of visit so an officer can assess your application.',
        },
        {
          heading: 'Use Adobe Acrobat Reader — not a browser',
          body: 'Always open IMM 5257 in Adobe Acrobat Reader, not in a browser PDF viewer. Only Acrobat can generate the 2D barcode on the last page, which encodes all your answers and is required for processing. If the barcode is missing, your application may be returned.',
        },
        {
          heading: 'Completing section 11 — signature',
          body: 'Section 11 is the declaration and signature. You must sign and date it before submitting. Unsigned forms are immediately rejected. If you are applying on behalf of someone else, also complete the representative details in the relevant section.',
        },
        {
          heading: 'Common mistakes to avoid',
          body: 'Leave no field blank — write "N/A" where a question does not apply. Use the exact name shown in your passport, including all given names. List all international travel in the last 10 years; omitting trips is a common cause of refusal.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. IRCC: https://www.canada.ca/en/immigration-refugees-citizenship.html',
          link: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
        },
      ],
    },
    {
      id: 'funds',
      title: 'Proof of funds explained',
      blurb: 'Understand exactly how much money to show, which documents count, and how to strengthen a borderline bank statement.',
      sections: [
        {
          heading: 'How much do you need?',
          body: 'Canada does not publish a fixed minimum, but officers use a rule of thumb of roughly CAD $100 per day of your planned stay. For a two-week trip that means showing at least CAD $1,400 comfortably available, though a higher closing balance gives a stronger impression.',
        },
        {
          heading: 'Which statements to include',
          body: 'Provide bank statements covering the last 4 months showing transaction history and an end balance. A single statement showing only the closing balance is not enough — officers want to see consistent activity, not a last-minute transfer.',
        },
        {
          heading: 'Sponsor or invitation letters',
          body: 'If a Canadian resident is hosting or sponsoring you, include their signed invitation letter, a copy of their status document, and their recent bank statements. This can significantly strengthen an application where your own balance is borderline.',
        },
        {
          heading: 'Other accepted proof',
          body: 'Fixed deposits, property ownership documents, and employment letters showing salary are all helpful supporting evidence. They demonstrate financial stability even if your liquid account balance is modest.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. IRCC: https://www.canada.ca/en/immigration-refugees-citizenship.html',
          link: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
        },
      ],
    },
    {
      id: 'biometrics',
      title: 'Biometrics guide',
      blurb: 'Who needs biometrics, how to book, what to bring, and how the Biometric Instruction Letter fits into your application.',
      sections: [
        {
          heading: 'Does Canada require biometrics?',
          body: 'Yes — Canada requires biometrics (fingerprints and a digital photo) from most visitors. The fee is CAD $85 per person or CAD $170 for a family applying together. Canadian citizens and permanent residents are exempt.',
        },
        {
          heading: 'The Biometric Instruction Letter (BIL)',
          body: 'After you pay your application and biometrics fees online, IRCC sends a Biometric Instruction Letter (BIL). This letter contains a unique code and tells you exactly where and how long you have to give your biometrics — typically 30 days.',
        },
        {
          heading: 'Booking your appointment',
          body: 'Take your BIL to a designated Visa Application Centre (VAC) to give your biometrics. Book the appointment the same day you receive the BIL — slots can fill up, and letting the window expire means paying again.',
        },
        {
          heading: 'What to bring',
          body: 'Bring your BIL, your valid passport, and the appointment confirmation. Biometrics are collected at VAC service points, not at the Canadian embassy itself. Your biometrics remain valid for 10 years or until your passport expires, whichever comes first.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. IRCC: https://www.canada.ca/en/immigration-refugees-citizenship.html',
          link: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
        },
      ],
    },
  ],

  usa: [
    {
      id: 'form',
      title: 'How to complete the DS-160',
      blurb: 'Navigate the CEAC online portal, avoid common errors, and print the confirmation barcode you need for your interview.',
      sections: [
        {
          heading: 'What the DS-160 is',
          body: 'The DS-160 is the U.S. Department of State\'s Online Nonimmigrant Visa Application form, submitted through the Consular Electronic Application Center (CEAC) portal. It replaces all paper forms and must be completed online before your embassy interview.',
        },
        {
          heading: 'Save your application ID immediately',
          body: 'After starting the form, the system gives you a unique Application ID. Save it — you need it to retrieve your application if your session times out. The form auto-saves periodically, but logging back in requires this ID.',
        },
        {
          heading: 'Photo requirements',
          body: 'Upload a square, color photo taken within the last 6 months against a plain white background, with a neutral expression and no glasses. The CEAC tool will flag a non-compliant photo but some issues (slight head tilt, background shadows) may only be caught at the interview.',
        },
        {
          heading: 'Print the confirmation page',
          body: 'After submitting, print the DS-160 confirmation page — it contains a barcode that embassy staff scan at check-in. You cannot attend your interview without this page. Keep a copy separate from your application packet.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. U.S. Department of State CEAC: https://ceac.state.gov/genniv',
          link: 'https://ceac.state.gov/genniv',
        },
      ],
    },
    {
      id: 'funds',
      title: 'Proof of funds explained',
      blurb: 'What bank statements to prepare, how much to show, and why strong ties matter more than a single big balance.',
      sections: [
        {
          heading: 'How much to show',
          body: 'There is no fixed U.S. requirement, but a reasonable benchmark is USD $100 per day of planned stay. For a two-week trip, show at least USD $1,400 available, with enough headroom to cover flights and accommodation already budgeted.',
        },
        {
          heading: 'Which statements to include',
          body: 'Provide bank statements for the last 3 months showing regular activity. Officers look for consistent balances, not a single large deposit that appeared just before applying — sudden large transfers raise questions about the authenticity of the funds.',
        },
        {
          heading: 'Ties to your home country',
          body: 'The B1/B2 visa requires you to demonstrate strong ties to your home country — employment letter, property ownership, family dependants, or return-trip bookings. Strong ties can outweigh a modest bank balance in an officer\'s assessment.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. U.S. Department of State: https://travel.state.gov',
          link: 'https://travel.state.gov',
        },
      ],
    },
    {
      id: 'interview',
      title: 'The visa interview & biometrics',
      blurb: 'Pay the MRV fee, book early, and know what to expect on interview day — from fingerprints to the officer\'s questions.',
      sections: [
        {
          heading: 'Pay the MRV fee first',
          body: 'The USD $185 Machine-Readable Visa (MRV) fee is paid before you schedule your interview. Payment methods vary by country (bank deposit, online, or in person). Keep the receipt — it links to your application and interview slot.',
        },
        {
          heading: 'Book early — slots fill fast',
          body: 'After paying, log in to the embassy scheduling system to book your interview. Wait times vary from a few days to several months depending on the consulate and time of year. Book as soon as your application is ready rather than waiting for a more convenient date.',
        },
        {
          heading: 'Biometrics on interview day',
          body: 'Fingerprints (all 10 fingers) are collected at the embassy or consulate on the same day as your interview. Arrive early enough for this step — it happens before you meet the officer. No separate biometrics appointment is needed.',
        },
        {
          heading: 'What to bring',
          body: 'Bring your DS-160 confirmation page (with barcode), MRV fee receipt, appointment confirmation, valid passport, one passport-style photo, your financial documents, and any supporting ties evidence. Original documents are preferred over photocopies.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. U.S. Department of State: https://travel.state.gov',
          link: 'https://travel.state.gov',
        },
      ],
    },
  ],

  uk: [
    {
      id: 'form',
      title: 'Completing the online VAF',
      blurb: 'Submit the Standard Visitor application on the UKVI website, pay the fee, and prepare for your biometrics appointment.',
      sections: [
        {
          heading: 'Where to apply',
          body: 'The UK Standard Visitor Visa is applied for entirely online through the UKVI (UK Visas and Immigration) website. There is no paper form — everything, including supporting documents, is uploaded digitally.',
        },
        {
          heading: 'Pay before booking biometrics',
          body: 'The GBP £115 visa fee must be paid as part of the online application before you can book your biometrics appointment. Keep the payment confirmation and application reference number — you will need them at the service point.',
        },
        {
          heading: 'Documents to upload',
          body: 'Upload a clear scan of your current passport, a recent passport-style photo, bank statements for the past 3–6 months, and evidence of accommodation and return travel. Supporting letters from employers or family sponsors strengthen borderline applications.',
        },
        {
          heading: 'Checking your application status',
          body: 'After submitting and attending biometrics, track your application in the UKVI online portal. Processing typically takes around 3 weeks, but complex cases or peak periods can take longer. Do not book non-refundable travel until your visa is granted.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. UK Government: https://www.gov.uk/standard-visitor',
          link: 'https://www.gov.uk/standard-visitor',
        },
      ],
    },
    {
      id: 'funds',
      title: 'Proof of funds explained',
      blurb: 'How much to show, which statements satisfy UKVI, and why demonstrating self-sufficiency matters most.',
      sections: [
        {
          heading: 'How much do you need?',
          body: 'A commonly cited benchmark is roughly GBP £50 per day for your UK visit. For a two-week stay that means showing at least £700 comfortably available, but the key test is whether you can support yourself throughout the trip without working.',
        },
        {
          heading: 'Which statements to include',
          body: 'Provide bank statements covering the last 3 to 6 months showing consistent transaction history. UKVI officers are experienced at spotting one-off large deposits — a regular salary and steady balance are more persuasive than a sudden transfer before applying.',
        },
        {
          heading: 'No recourse to public funds',
          body: 'Standard Visitor Visa holders cannot access UK public funds (benefits, NHS treatment in most cases, etc.). Your statements must demonstrate you can fully fund the trip privately. If a UK host is funding your visit, include their invitation letter and their own bank statements.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. UK Government: https://www.gov.uk/standard-visitor',
          link: 'https://www.gov.uk/standard-visitor',
        },
      ],
    },
    {
      id: 'biometrics',
      title: 'Biometrics at UKVCAS',
      blurb: 'Book your UKVCAS appointment after paying online, know the service fee, and learn what to bring on the day.',
      sections: [
        {
          heading: 'What UKVCAS is',
          body: 'UKVCAS (UK Visa and Citizenship Application Services) is the network of service points where you submit your biometrics (fingerprints and photo) for a UK visa. After completing your online application, you must book a UKVCAS appointment to proceed.',
        },
        {
          heading: 'The service point fee',
          body: 'Attending a UKVCAS Standard service point costs around GBP £19.20 and is separate from the visa application fee. Enhanced and Premium service point slots cost more but offer shorter wait times and additional conveniences such as out-of-hours appointments.',
        },
        {
          heading: 'What to bring',
          body: 'Bring your valid passport, your UKVI application reference number, and the UKVCAS appointment confirmation. Some service points also accept digital document upload before your appointment — check the confirmation email for instructions.',
        },
        {
          heading: 'After biometrics',
          body: 'Your passport and biometrics are sent to UKVI for processing. You can track the status online. Avoid booking flights or accommodation until you receive a decision — the service point cannot tell you the outcome.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. UK Government: https://www.gov.uk/standard-visitor',
          link: 'https://www.gov.uk/standard-visitor',
        },
      ],
    },
  ],

  india: [
    {
      id: 'form',
      title: 'Applying for the e-Tourist Visa',
      blurb: 'Complete the end-to-end online process, choose the right validity option, and upload the required documents.',
      sections: [
        {
          heading: 'Fully online — no embassy visit',
          body: 'India\'s e-Tourist Visa (eTV) is applied for entirely at the official portal indianvisaonline.gov.in. You do not need to visit an embassy — the visa is approved digitally and emailed to you as a PDF to print and carry.',
        },
        {
          heading: 'Choosing the right validity',
          body: 'The e-Tourist Visa comes in three options: 30 days (double entry), 1 year (multiple entry), and 5 years (multiple entry). The 30-day visa is ideal for a single short visit; the 1-year and 5-year options suit frequent travelers. Note that the 30-day and 1-year options allow double entry only.',
        },
        {
          heading: 'Documents to upload',
          body: 'You need a clear scan of your passport bio page, a recent square passport-style photo, a return flight booking, and proof of sufficient funds. All uploads must be in JPEG or PDF format and within the size limits shown on the portal — oversized files are a common submission error.',
        },
        {
          heading: 'Processing time',
          body: 'Processing is typically 3 business days, though it can be faster. Apply at least 4 days before your travel date to be safe. The approved ETA (Electronic Travel Authorization) is sent by email — print it and carry it alongside your passport.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. Government of India: https://indianvisaonline.gov.in',
          link: 'https://indianvisaonline.gov.in',
        },
      ],
    },
    {
      id: 'funds',
      title: 'Proof of funds explained',
      blurb: 'What financial evidence to prepare for an Indian e-Tourist Visa and how much is typically expected.',
      sections: [
        {
          heading: 'How much to show',
          body: 'While India does not publish a strict minimum, a common benchmark is USD $25 per day or roughly USD $500 for the trip — whichever is higher. This covers accommodation, food, transport, and activities at a modest level.',
        },
        {
          heading: 'Accepted documents',
          body: 'Bank statements for the past 3 months are the standard evidence. A healthy average balance with regular activity is more convincing than a last-minute deposit. Credit card statements or a letter from your employer confirming salary can supplement bank statements.',
        },
        {
          heading: 'At the port of entry',
          body: 'Immigration officers at Indian airports may ask you to show funds on arrival. Carry a printed copy of your bank statements or have mobile banking ready. Officers have discretion to ask for more evidence if they are not satisfied.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. Government of India: https://indianvisaonline.gov.in',
          link: 'https://indianvisaonline.gov.in',
        },
      ],
    },
    {
      id: 'photo',
      title: 'Photo & passport scan requirements',
      blurb: 'Avoid the most common e-Visa rejection reason: non-compliant photos and blurry passport scans.',
      sections: [
        {
          heading: 'Photo specifications',
          body: 'Upload a square, color passport-style photo taken against a plain light (white or off-white) background. The face must be centered, fully visible, with eyes open and looking directly at the camera, and no glasses. The photo must have been taken within the last 6 months.',
        },
        {
          heading: 'Passport scan specifications',
          body: 'The passport bio-page scan must be in color, clearly legible, and capture all four corners of the page without cropping. The file must be in JPEG or PDF format within the size limit specified on the portal. Blurry, dark, or partial scans are automatically rejected.',
        },
        {
          heading: 'Most common rejection reason',
          body: 'Non-compliant photo and passport scan uploads are the single most common reason for e-Visa rejection or delay. Check your files carefully before submitting — zoom in to confirm all text is readable and the photo background is truly plain.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. Government of India: https://indianvisaonline.gov.in',
          link: 'https://indianvisaonline.gov.in',
        },
      ],
    },
  ],

  schengen: [
    {
      id: 'form',
      title: 'Completing the Schengen application (Annex I)',
      blurb: 'Fill the uniform Schengen Annex I form and submit to the right embassy — the one covering your main destination.',
      sections: [
        {
          heading: 'What Annex I is',
          body: 'The Schengen visa application form is known as Annex I — a standardised form accepted by all Schengen member states. Regardless of which country\'s consulate you apply to, you use the same form. Download it from the consulate\'s official website or the European Commission portal.',
        },
        {
          heading: 'Which embassy to apply to',
          body: 'Submit to the embassy or consulate of your MAIN destination — the Schengen country where you will spend the most nights. If your itinerary is evenly split, apply at the country of your first entry. Applying to the wrong consulate will result in your application being redirected or returned.',
        },
        {
          heading: 'Filling in the form',
          body: 'Complete every field in block capitals or using a typewriter/computer. Sign and date section 37 — an unsigned form is void. Attach a passport photo meeting Schengen photo standards (35mm × 45mm, plain light background, neutral expression, taken within the last 6 months).',
        },
        {
          heading: 'Supporting documents to attach',
          body: 'Submit the form alongside your passport (valid for at least 3 months beyond your intended stay), return tickets, hotel bookings or an invitation letter, travel medical insurance (minimum €30,000 coverage), and proof of funds. All documents may need certified translation.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. European Commission: https://home-affairs.ec.europa.eu',
          link: 'https://home-affairs.ec.europa.eu',
        },
      ],
    },
    {
      id: 'funds',
      title: 'Proof of funds & insurance',
      blurb: 'Meet the daily funds benchmark and the mandatory €30,000 travel insurance requirement.',
      sections: [
        {
          heading: 'Funds: how much to show',
          body: 'The commonly applied Schengen benchmark is roughly €100 per day of your stay, with a minimum of about €500 for the trip. For a two-week stay that means showing at least €1,400 comfortably available. Some consulates publish their own figures — check the specific embassy\'s requirements.',
        },
        {
          heading: 'Bank statements',
          body: 'Provide statements for the last 3 to 6 months showing regular salary credits and a healthy average balance. If a sponsor is funding your trip, include their invitation letter (sometimes called a "commitment letter" or Verpflichtungserklärung in Germany), their ID, and their bank statements.',
        },
        {
          heading: 'Travel medical insurance — mandatory',
          body: 'You must have travel medical insurance covering a minimum of €30,000, valid for all Schengen countries, covering the entire duration of your trip including the entry and exit dates. Policies that cover only specific countries or have sub-limits below €30,000 do not meet the requirement.',
        },
        {
          heading: 'Choosing an insurance policy',
          body: 'Check that the policy explicitly states "Schengen-compliant" or lists all Schengen countries. Emergency medical evacuation and repatriation should be included. Print or save the insurance certificate to carry with you — officers at the border may ask to see it.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. European Commission: https://home-affairs.ec.europa.eu',
          link: 'https://home-affairs.ec.europa.eu',
        },
      ],
    },
    {
      id: 'biometrics',
      title: 'Biometrics for Schengen',
      blurb: 'Understand how fingerprints are collected, the reuse window, and what to expect at the consulate or VAC.',
      sections: [
        {
          heading: 'Who needs biometrics?',
          body: 'Most non-EU, non-EEA applicants must provide biometrics for a Schengen visa. The collection includes fingerprints of all 10 fingers and a digital facial scan. Biometrics are collected at the consulate or an authorised Visa Application Centre (VAC) and are included in the visa fee — there is no separate biometrics fee.',
        },
        {
          heading: 'The 59-month reuse window',
          body: 'If you gave Schengen biometrics within the last 59 months (just under 5 years), they can be reused for a new application without a new scan. This can speed up processing and means you may not need to visit the VAC in person if documents can be submitted by post or online.',
        },
        {
          heading: 'What to bring to the appointment',
          body: 'Bring your valid passport, the completed Annex I form, your fee payment confirmation, all supporting documents, and one passport-style photo. Arrive on time — VAC appointments are often strictly time-slotted and late arrivals may need to rebook.',
        },
        {
          heading: 'After your appointment',
          body: 'Your passport and biometrics are forwarded to the relevant consulate for a decision. Processing takes up to 15 calendar days in normal cases, and up to 45 days in exceptional circumstances. You will be notified when the decision is ready and your passport can be collected or posted back.',
        },
        {
          heading: 'Official source',
          body: 'Visa rules change — always confirm on the official government site before applying. European Commission: https://home-affairs.ec.europa.eu',
          link: 'https://home-affairs.ec.europa.eu',
        },
      ],
    },
  ],
}
