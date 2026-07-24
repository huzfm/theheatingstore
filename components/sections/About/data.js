/**
 * About-page content, isolated from presentation.
 *
 * Figures marked NEEDS-REAL-INFO in comments are carried over from the two
 * previous About implementations and have NOT been independently verified —
 * confirm or correct before launch. Nothing here is a newly invented number.
 */

export const HERO = {
  eyebrow: 'Since 2011 · Kashmir',
  // RevealText animates word-by-word, so keep this as a plain string.
  headline: 'We keep Kashmir warm when the power goes out.',
  sub: 'The Heating Store engineers, supplies and installs electric hamam and underfloor heating built for sub-zero winters and daily power cuts — where staying warm is not a luxury, it is the whole point.',
  primary: { label: 'Talk to an Expert', href: '/SpaceVerification' },
  secondary: { label: 'See the Process', href: '/how-it-works' },
  // Full-bleed atmospheric backdrop (heavily darkened behind the copy).
  bgImage:
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop',
  // Static poster shown in place of the live 3D under reduced motion.
  poster:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80&auto=format&fit=crop',
};

/* Origin story — narrative, not bullets. Founding year carried from prior copy. */
export const ORIGIN = {
  eyebrow: 'Our Origin',
  title: 'Started by heating engineers, not resellers.',
  paragraphs: [
    'The Heating Store began in 2011, when a small team of heating engineers grew tired of watching imported systems fail in the one place they were needed most — a Kashmiri winter. Radiators that idled during load-shedding. Systems specced for climates that never froze.', // NEEDS-REAL-INFO: founding year & story
    'So they built for the conditions that actually exist here: floors that hold heat for hours after the power cuts out, wiring certified for wet hamam areas, and warranties that assume a hard winter rather than an easy one. Every layer is chosen for the moment the grid goes quiet.',
  ],
  image:
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
};

/* Three principles — rendered as distinct glow cards, not an icon grid. */
export const PRINCIPLES = [
  {
    num: '01',
    title: 'Experts of the Trade',
    desc: 'Certified heating engineers, not box-shifters. We survey the space, spec the system, and stand behind the install from first wire to final commissioning.',
  },
  {
    num: '02',
    title: 'Built for the Blackout',
    desc: 'The only heating in Kashmir that gets more useful the moment the power goes out — floors engineered to hold warmth for 8–10 hours after a cut.', // NEEDS-REAL-INFO: 8–10h retention claim
  },
  {
    num: '03',
    title: 'Customers, Then Sales',
    desc: 'We would rather lose a sale than fit the wrong system. Honest advice, right-sized quotes, and a team that answers long after the invoice is paid.',
  },
];

/* Timeline — PLACEHOLDER milestones. Dates other than 2011 are illustrative
   and must be replaced with real company moments before launch. */
export const MILESTONES = [
  { year: '2011', title: 'The first floor', desc: 'Founded by heating engineers in Srinagar, chasing a warmth that survives load-shedding.' }, // NEEDS-REAL-INFO
  { year: '2015', title: 'Hamam, done right', desc: 'Introduced wet-area-certified electric hamam systems for the Kashmiri home.' }, // PLACEHOLDER
  { year: '2019', title: 'Beyond the valley', desc: 'Extended supply and installation to homes and projects across the region.' }, // PLACEHOLDER
  { year: '2023', title: "Kashmir's largest", desc: 'Grew into the valley’s largest underfloor heating supplier and installer.' }, // NEEDS-REAL-INFO
  { year: 'Today', title: 'Warmer, every winter', desc: 'Thousands of floors later, still building for the coldest day, not the average one.' },
];

/* Stats — CounterNumber animates the numeric part; `value` is the number and
   `suffix`/`prefix` frame it. Figures carried from prior copy — verify. */
export const STATS = [
  { value: 14, suffix: '+', label: 'Years installing' },          // NEEDS-REAL-INFO
  { value: 6000, suffix: '+', label: 'Systems supplied', separator: true }, // NEEDS-REAL-INFO
  { value: 98, suffix: '%', label: 'Customers satisfied' },        // NEEDS-REAL-INFO
  { value: 5, suffix: ' yr', label: 'Warranty as standard' },
];

export const CTA = {
  eyebrow: 'The warm part',
  title: 'Ready for a floor that holds its heat?',
  sub: 'Talk to our team for a free, no-obligation survey and installation quote.',
  primary: { label: 'Book a Survey', href: '/contact' },
  secondary: { label: 'Browse Systems', href: '/product' },
};
