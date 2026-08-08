/**
 * Content for /why-choose-us.
 *
 * This file is the merge of three routes that were competing for the same
 * query and the same visitor:
 *
 *   /why-choose-us     the guarantees, the figures, the testimonials
 *   /local-experience  the Srinagar team, the towns, the brands
 *   /global-experience the countries, the standards, the manuals
 *
 * All three answered "why should I buy this from you", split three ways, so
 * each one was too thin to rank and the visitor had to read all three to get
 * the argument. They are now one page with one argument in three movements:
 * what we promise, who we are here, what we import from elsewhere. The other
 * two URLs 301 to this one (see next.config.mjs).
 *
 * What was cut in the merge, and why:
 *
 *   - Two of the three heroes and two of the three closing CTA panels. One
 *     page needs one opener and one ask.
 *   - The five-card "what you get" photo grid. Five Unsplash stock photographs
 *     carrying four lines of copy each. The four items that were genuinely
 *     distinct survive as INCLUDED, a hairline list under the guarantees.
 *   - The six-card "what we heat" building-type grid, another six Unsplash
 *     images. Building types are a product/installation argument, not a
 *     credibility one, and /product already covers them.
 *   - The flag row that used to sit at the foot of the guarantees section. It
 *     was the same nine countries COUNTRIES renders below.
 *
 * One factual contradiction had to be resolved. /why-choose-us said nine
 * countries, /global-experience said eight: the same list, one counting India
 * and one not. Side by side on one page that reads as a mistake. It is nine
 * throughout now, with India marked as the home market in COUNTRIES so the
 * count is self-evidently right.
 *
 * Figures are carried from the pages being merged, not newly invented, and
 * agree with app/components/FaqSection.jsx and lib/floor-timeline.js.
 */

export const HERO = {
  eyebrow: 'Why choose us · Since 2011',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Proven in nine countries. Answered from Srinagar.',
  sub: 'Two million systems installed, a 0.01% fault rate, and a team you can actually reach in the Valley. The heating we fit here is engineered for winters colder than ours, and it is warrantied by people who live through this one.',
  bgImage: '/images/el.png',
  /* Three claims the page then proves, in the order it proves them. */
  facts: [
    { value: '2M+', label: 'Systems installed worldwide' },
    { value: '0.01%', label: 'Fault rate across all of them' },
    { value: '2011', label: 'Installing in Kashmir since' },
  ],
};

/**
 * The jump bar under the hero. Three chapters, three anchors — the same three
 * ids the retired URLs redirect into, so an old /local-experience link lands
 * on the local movement of this page rather than at the top of it.
 */
export const CHAPTERS = [
  { id: 'promise', num: '01', label: 'What we promise' },
  { id: 'local', num: '02', label: 'Here in Kashmir' },
  { id: 'global', num: '03', label: 'The global standard' },
];

export const STATS = {
  eyebrow: 'The numbers',
  title: 'What we have to show for it.',
  /* Four figures, four distinct arguments: scale, reliability, cover, reach.
     The previous set opened with two scale figures (300K+ customers, 2M+
     systems) that made the same point twice. */
  list: [
    {
      display: '2M+',
      label: 'Systems installed',
      sub: 'Worldwide since 2011',
      bullets: [
        '500,000+ of them across India',
        'Homes, hotels, offices and prayer halls',
      ],
    },
    {
      display: '0.01%',
      label: 'Fault rate',
      sub: 'Across every system supplied',
      bullets: [
        'Engineered for extreme-cold climates',
        '24-hour replacement if one does fail',
      ],
    },
    {
      display: '10–25+',
      label: 'Year warranty',
      sub: 'Depending on the system specified',
      bullets: [
        'Parts and labour, fully transferable',
        'Valid anywhere in India',
      ],
    },
    {
      display: '17',
      label: 'Towns served directly',
      sub: 'Across five regions, from a Srinagar base',
      bullets: [
        'Survey, install and aftercare by one team',
        'Shortest response times in the Valley',
      ],
    },
  ],
};

export const GUARANTEES = {
  eyebrow: 'What we promise',
  title: 'What you are actually buying.',
  intro:
    'Every one of these is a promise about a bad day, not a good one. That is the only kind worth comparing between suppliers.',
  list: [
    {
      title: 'Near-zero failure rate',
      desc: '0.01% across two million-plus installations, on cable engineered for extreme cold.',
    },
    {
      title: '24-hour replacement',
      desc: 'If a system fails, we replace it within twenty-four hours, anywhere in India.',
    },
    {
      title: '10 to 25+ year warranty',
      desc: 'Fully transferable, valid across India, parts and labour both covered.',
    },
    {
      title: 'A design for your floor',
      desc: 'Layout plans, cable density maps and thermostat zoning drawn for your rooms, not a catalogue spec.',
    },
  ],
};

/**
 * Formerly the five-card OFFERS grid. Two of those five were steps in the
 * installation sequence (/how-it-works owns that) and one restated the
 * warranty above, so this is the four that are genuinely offers, set as a list
 * rather than five stock photographs.
 */
export const INCLUDED = {
  label: 'Included as standard, not quoted for later',
  list: [
    {
      title: 'Free site survey',
      desc: 'The space, the floor build-up and how you actually use the rooms, assessed before anything is specified.',
    },
    {
      title: 'Custom heat design',
      desc: 'Cable density, wattage zones and thermostat placement, drawn room by room before a cable is ordered.',
    },
    {
      title: 'Price match',
      desc: 'Found the same system cheaper from an authorised supplier? We match it, on the same warranty and the same certified install.',
    },
    {
      title: 'Aftercare that answers',
      desc: 'The team that specified it is the team that picks up in year six.',
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: 'From the trade',
  title: 'The people who specify it repeatedly.',
  /* Trimmed from the four-to-five sentence originals. All three are named
     people at named firms; the row of Unsplash "customer avatars" that used to
     sit beside them was cut in an earlier pass and is not coming back. */
  list: [
    {
      initials: 'AA',
      name: 'Asif Ali',
      role: 'Principal Architect, Ali Associates, Srinagar',
      tag: 'Verified purchase',
      text: 'Specified across six luxury residential and commercial projects. Zero callbacks, zero defects. The 0.01% fault rate they advertise is real.',
    },
    {
      initials: 'KS',
      name: 'Kamran Siddiq',
      role: 'Senior Project Manager, Siddiq Builders, Jammu',
      tag: 'Trade account',
      text: 'Custom heating zones mapped across a 5,000 sq ft penthouse, then installed exactly as drawn. The design consultation is what sets them apart.',
    },
    {
      initials: 'SF',
      name: 'Syed Faizan',
      role: 'Head of Development, Faizan Developments, Kashmir',
      tag: 'Commercial project',
      text: 'Sixty units, every system right from day one. The 25-year warranty is a genuine differentiator when we sell the homes.',
    },
  ],
};

/* ── Movement two: here ─────────────────────────────────────────────────── */

export const LOCAL_STORY = {
  id: 'local',
  eyebrow: 'Here in Kashmir',
  title: 'A Kashmir winter is a different brief.',
  paragraphs: [
    'Most heating is specified for a climate that dips. Ours is specified for one that sits below freezing for months, in houses built long before anyone designed them around insulation, on a grid that goes down when you need it most.',
    'That changes what you install. Thermal mass matters more than raw wattage, because a floor that holds its heat is worth more here than one that reaches temperature quickly and loses it just as fast. It is not knowledge you can ship in with a catalogue.',
  ],
  image: '/resons/reason1.jpg',
  imageAlt: 'A warm floor being used at home during a Kashmir winter',
  flip: true,
};

export const NETWORK = {
  eyebrow: 'Where we work',
  title: 'The towns we actually reach.',
  intro:
    'Jammu & Kashmir is where the team is based and where response times are shortest. Everywhere else is served by the same team travelling out.',
  regions: [
    {
      region: 'Jammu & Kashmir',
      note: 'Home ground. Survey, install and aftercare handled directly by the Srinagar team.',
      places: [
        'Srinagar',
        'Anantnag',
        'Kupwara',
        'Baramulla',
        'Pulwama',
        'Budgam',
        'Sopore',
      ],
    },
    {
      region: 'North India',
      note: 'The other cold-winter market, and the one closest to our own conditions.',
      places: ['Delhi', 'Shimla', 'Manali'],
    },
    {
      region: 'West India',
      note: 'Mostly bathroom and spa work, where a warm floor matters more than a warm room.',
      places: ['Mumbai', 'Ahmedabad', 'Surat'],
    },
    {
      region: 'Central India',
      note: 'Served on scheduled trips, planned around the install rather than the enquiry.',
      places: ['Bhopal', 'Indore'],
    },
    {
      region: 'East India',
      note: 'Hill-station work in particular, where the winter case is closest to Kashmir’s.',
      places: ['Kolkata', 'Darjeeling'],
    },
  ],
};

/**
 * The brand list itself is deliberately NOT here. It lives in
 * app/lib/brandsData.js, which /brands/[slug] and /product also read, so this
 * page cannot drift from the brand pages it links to.
 */
export const BRAND_INTRO = {
  eyebrow: 'What we carry',
  title: 'Six brands, chosen for cold.',
  intro:
    'We are an authorised distributor for each of these, which is the part that matters after the invoice: a fault here is our callout, not a claim form posted to another country.',
};

/* ── Movement three: elsewhere ──────────────────────────────────────────── */

export const GLOBAL_STORY = {
  id: 'global',
  eyebrow: 'The global standard',
  title: 'Certification is not a sticker.',
  paragraphs: [
    'A heating cable spends its whole life buried in screed, under a floor nobody intends to lift again. There is no servicing it, no inspecting it and no second chance at the insulation. Everything that decides whether it lasts twenty-five years is decided before it goes in.',
    'That is what the international standards are for. Fluoropolymer cable construction, multi-layer conductive cores, waterproof insulation and IEC compliance are the specific reasons a cable survives a screed pour, a wet bathroom and three decades of thermal cycling. We import to those standards rather than to a price, because the failure mode here is a floor coming up.',
  ],
  image: '/images/floor2.webp',
  imageAlt: 'Electric heating cable beneath a floor build-up',
  flip: false,
};

/**
 * Countries these systems are installed and proven in. `code` is an ISO 3166-1
 * alpha-2 for react-world-flags, already a dependency.
 *
 * India leads and is flagged `home`. The two source pages disagreed on the
 * count for exactly this reason — one list included India, one did not — so
 * the home market is now shown rather than assumed.
 */
export const COUNTRIES = {
  eyebrow: 'Where these systems run',
  title: 'Nine countries, most of them colder than here.',
  intro:
    'Northern Europe has been solving this problem for longer than we have. The systems we carry are the ones that hold up there, and the ones we have been fitting here since 2011.',
  list: [
    { name: 'India', code: 'IN', home: true },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Turkey', code: 'TR' },
    { name: 'UAE', code: 'AE' },
    { name: 'Bhutan', code: 'BT' },
  ],
};

/**
 * Manufacturer documentation — the most genuinely useful thing on the page and
 * the reason it earns links.
 *
 * `logo` is optional on purpose: Danfoss has a PDF but no logo file in
 * public/brandimages, and DocumentLibrary falls back to a wordmark set in the
 * display face when it is absent.
 */
export const DOCS = {
  eyebrow: 'Documentation',
  title: 'Every manual, straight from the manufacturer.',
  intro:
    'The same documents our installers work from. No sign-up, no email capture, just the PDFs.',
  list: [
    {
      name: 'ProWarm',
      logo: '/brandimages/prowarm.webp',
      pdf: '/PDFs/prowarm.pdf',
      docTitle: 'Installation Brochure',
      docType: 'Brochure',
      pages: '24 pages',
    },
    {
      name: 'Warmup',
      logo: '/brandimages/warmup.webp',
      pdf: '/PDFs/Warmup-OM-Tempo-V1.3.pdf',
      docTitle: 'Tempo Owner Manual',
      docType: 'Manual',
      pages: '32 pages',
    },
    {
      name: 'Danfoss',
      logo: null,
      pdf: '/PDFs/Danfoss.pdf',
      docTitle: 'Hydronic Floor Heating Guide',
      docType: 'Handbook',
      pages: '12 pages',
    },
    {
      name: 'ThermoSphere',
      logo: '/brandimages/thermosphere.webp',
      // Filename contains a space; the href is encoded at render.
      pdf: '/PDFs/ThermoSphere Ultimate_Instructions.pdf',
      docTitle: 'Ultimate Cable Instructions',
      docType: 'Instructions',
      pages: '31 pages',
    },
    {
      name: 'FastWarm',
      logo: '/brandimages/fastwarm.webp',
      pdf: '/PDFs/fastwarm.pdf',
      docTitle: 'Mat System Manual',
      docType: 'Manual',
      pages: '15 pages',
    },
    {
      name: 'AmberHeat',
      logo: '/brandimages/amberheat.webp',
      pdf: '/PDFs/Amber-Installation-Guide.pdf',
      docTitle: 'AmberMat Installation Guide',
      docType: 'Guide',
      pages: '12 pages',
    },
    {
      name: 'nVent',
      logo: '/brandimages/nvent.png',
      pdf: '/PDFs/nvent.pdf',
      docTitle: 'nVent Installation Guide',
      docType: 'Guide',
      pages: '12 pages',
    },
  ],
};

/** Certification strip. Same claims as /certifications, stated briefly. */
export const MARQUEE = [
  'Kashmir installation warranty',
  '25–50 year pipe guarantees',
  'CE & UKCA certified',
  'IEC 60335 safety compliant',
  'ISO 9001:2015 quality management',
  'WRAS approved components',
  '18th Edition electrical compliance',
  'Global electrical approvals',
];

export const CTA = {
  eyebrow: 'Start here',
  title: 'Find out what it costs for your floor.',
  sub: 'A free site visit, a heat design and one written price. Nothing on this page means anything until it is applied to your own rooms.',
  included: [
    'Free site survey',
    'Custom heat design',
    'Certified installation',
    '25+ year warranty',
    '24h replacement',
    'Price match',
  ],
};
