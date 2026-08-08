/**
 * Content for /certifications, "the standards these systems are held to".
 *
 * Every mark, number and registration below is carried verbatim from the
 * previous version of this page. Nothing here is new, it is the same claims
 * reorganised into groups, because the old page presented eleven certification
 * cards in four unrelated sections with no indication which applied to the
 * electric systems most customers are buying and which applied only to the
 * water-based ones.
 *
 * Two blocks did not survive, both deliberately:
 *   - "Project Intelligence", three cards describing features of this website
 *     (a cost calculator, on-site photography, "end-to-end guidance"). Not
 *     certifications, and not evidence of anything.
 *   - The partner-brands paragraph, whose four links pointed at #prowarm-pdf,
 *     #warmup-pdf, #thermosphere-pdf and #fastwarm-pdf. No such anchors exist
 *     on this page, so all four were dead links. The manufacturer documents
 *     live on /why-choose-us#global, which is where this now points.
 */

export const HERO = {
  eyebrow: 'Certifications · Standards & compliance',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'The paperwork behind a buried cable.',
  sub: 'Once a heating cable is under screed, nobody inspects it again. Every certification on this page exists because that is the only chance to get it right.',
  bgImage: '/images/elecr.png',
  facts: [
    { value: 'CE · UKCA', label: 'Electrical safety marks held' },
    { value: 'IEC 60335', label: 'International appliance standard' },
    { value: 'ISO 9001', label: 'Manufacturing quality system' },
  ],
};

/**
 * The marks, grouped by what they actually govern. `mark` is the short form
 * set in the display face; `chips` are the specific standard numbers.
 *
 * The `applies` line on each group is the thing the old page never said: which
 * of these are relevant to the electric systems most customers buy, and which
 * only matter if the system is water-based.
 */
export const GROUPS = [
  {
    id: 'electrical',
    eyebrow: 'Electrical & quality',
    title: 'What every system we sell is certified to.',
    applies: 'Applies to all electric underfloor heating systems.',
    items: [
      {
        mark: 'CE · UKCA',
        title: 'CE & UKCA certification',
        desc: 'All heating systems comply with international safety and performance standards, tested for Kashmir conditions including heat retention, power-cut resilience and humidity.',
        chips: ['EN 60335', 'UKCA 2025'],
      },
      {
        mark: 'IEC',
        title: 'IEC 60335 safety',
        desc: 'Meets the international safety standard for electrical appliances, with allowance made for humidity, altitude and power fluctuation.',
        chips: ['IEC 60335'],
      },
      {
        mark: 'ISO',
        title: 'ISO 9001:2015',
        desc: 'Quality-management certified manufacturing, which is what makes product testing consistent from one batch to the next rather than one factory visit.',
        chips: ['ISO 9001:2015'],
      },
      {
        mark: 'UL',
        title: 'Global approvals',
        desc: 'The additional national approvals these systems carry for other markets, which is how a manufacturer demonstrates the same product passes more than one regulator.',
        chips: ['UL / cUL', 'CSA', 'VDE', 'SEMKO'],
      },
    ],
  },
  {
    id: 'safety',
    eyebrow: 'Safety & installation',
    title: 'What protects the cable, and you.',
    applies: 'Applies to the cable itself and to how it is wired in.',
    items: [
      {
        mark: 'TWISTED',
        title: 'Advanced cable technology',
        desc: 'TwistedTwin™ dual-conductor architecture reduces cable stress and improves flexibility, which is what long-term durability under a floor actually comes down to.',
        chips: ['Dual conductor'],
      },
      {
        mark: 'EARTH',
        title: 'Continuous earth protection',
        desc: 'Full metallic shielding with a continuous earth braid the length of the cable, so a fault anywhere along it has somewhere to go.',
        chips: ['Full shield'],
      },
      {
        mark: '18th ED',
        title: 'Electrical compliance',
        desc: 'Installed to the IET Wiring Regulations, BS 7671 18th Edition, which governs how the circuit is protected and tested before it is signed off.',
        chips: ['BS 7671'],
      },
    ],
  },
  {
    id: 'hydronic',
    eyebrow: 'Water-based standards',
    title: 'Only relevant if your system is hydronic.',
    applies: 'Applies to water-based systems, not to electric ones.',
    items: [
      {
        mark: 'WRAS',
        title: 'WRAS approved components',
        desc: 'Pipes and fittings approved under the Water Supply Regulations and Scottish Byelaws, with manifold assemblies meeting hygienic standards.',
        chips: ['Reg. no. 2406012'],
      },
      {
        mark: 'EN ISO',
        title: 'EN ISO 21003 multilayer pipe',
        desc: 'PERT-AL-PERT multilayer pipe with an aluminium oxygen barrier and corrosion resistance, rated for fifty-year durability.',
        chips: ['EN ISO 21003-1'],
      },
    ],
  },
];

/** What the certification is worth once something goes wrong. */
export const WARRANTY = {
  eyebrow: 'What it is worth in practice',
  title: 'A certificate you can actually claim on.',
  intro:
    'Standards describe how a product was built. These are what happens if it still fails.',
  points: [
    {
      value: '100%',
      unit: 'Coverage',
      title: 'Installation protection',
      desc: 'Cables are replaced if they are damaged during installation, before the floor finish goes down.',
    },
    {
      value: '25–50',
      unit: 'Years',
      title: 'Pipe guarantee',
      desc: 'Manufacturer guarantees on multilayer pipework for hydronic systems.',
    },
    {
      value: '24/7',
      unit: 'Helpline',
      title: 'Technical support',
      desc: 'Our Kashmir-based technical team is on call for installers and owners alike.',
    },
  ],
  /* Building types these systems are installed in worldwide. */
  record: [
    '250,000+ residential homes',
    'Luxury apartments',
    'Hotels & resorts',
    'Commercial buildings',
    'Healthcare facilities',
  ],
};

export const CTA = {
  eyebrow: 'Next step',
  title: 'See which of these apply to your system.',
  sub: 'The site visit specifies the system, and the specification determines which of these marks you are actually buying. It is free, and it comes in writing.',
};
