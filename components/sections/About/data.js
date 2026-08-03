/**
 * About-page content, isolated from presentation.
 *
 * Figures marked NEEDS-REAL-INFO in comments are carried over from the two
 * previous About implementations and have NOT been independently verified 
 * confirm or correct before launch. Nothing here is a newly invented number.
 */

export const HERO = {
  brand: 'The Heating Store',
  location: 'Kashmir · Est. 2011',
  coords: ['34.0837° N', '74.7978° E', 'Srinagar'],
  headline: 'Built for winter. Engineered for Kashmir.',
  sub: "The Heating Store engineers, supplies and installs electric hamam and underfloor heating systems built for sub-zero winters, heavy snow and the realities of Kashmir's power cuts.",
  primary: { label: 'Talk to an Expert', href: '/SpaceVerification' },
  secondary: { label: 'Explore our approach', href: '/how-it-works' },
  instrument: {
    metric: 'Floor Temperature',
    value: '24.0°C',
    status: 'Holding',
  },
  footerLeft: 'Electric Hamam — Thermal Systems — Kashmir · India',
  footerRight: 'Est. 2011 — Winter Systems — 01 / About',
};

/* Origin story, narrative, not bullets. Founding year carried from prior copy. */
export const ORIGIN = {
  eyebrow: 'Our Origin',
  title: 'Started by heating engineers, not resellers.',
  paragraphs: [
    'The Heating Store began in 2011, when a small team of heating engineers grew tired of watching imported systems fail in the one place they were needed most, a Kashmiri winter. Radiators that idled during load-shedding. Systems specced for climates that never froze.', // NEEDS-REAL-INFO: founding year & story
    'So they built for the conditions that actually exist here: floors that hold heat for hours after the power cuts out, wiring certified for wet hamam areas, and warranties that assume a hard winter rather than an easy one. Every layer is chosen for the moment the grid goes quiet.',
  ],
  image:
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',

  /**
   * Circular gallery items, PLACEHOLDER IMAGERY.
   *
   * Every `src` below is a stock photograph standing in for a real one. None of
   * them show our own work, our own team, or Kashmir. Replace all eight with
   * genuine job-site photography before launch, the copy on each card is
   * written to be true of us, the picture underneath it currently is not.
   *
   * Portrait crops (roughly 3:4) read best, the cards are taller than they are
   * wide. The shader cover-fits anything, but a landscape source loses its
   * sides.
   */
  gallery: [
    {
      id: 'workshop',
      label: 'The first workshop',
      caption: 'Srinagar, 2011. Four engineers, a rented unit, and one bad winter for imported radiators.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'first-floor',
      label: 'The first floor',
      caption: 'The first mat we ever laid, specced for a house that lost power most evenings.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'cable',
      label: 'Cable, not guesswork',
      caption: 'Every run measured and logged before a single screed board goes down.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'hamam',
      label: 'Hamam, done right',
      caption: 'Wet-area-certified systems for the one room in a Kashmiri home that never gets to be cold.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'winter',
      label: 'Built for the valley',
      caption: 'Specced against the coldest week of the year, not the average one.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'commissioning',
      label: 'Commissioned by hand',
      caption: 'Insulation resistance and continuity checked twice, before the floor closes and after.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'team',
      label: 'Engineers, not resellers',
      caption: 'The people who spec the system are the people who stand behind the install.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'today',
      label: 'Warmer, every winter',
      caption: 'Thousands of floors later, still building for the moment the grid goes quiet.', // PLACEHOLDER
      src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop',
    },
  ],
};

/* Three principles, rendered as distinct glow cards, not an icon grid. */
export const PRINCIPLES = [
  {
    num: '01',
    title: 'Experts of the Trade',
    desc: 'Certified heating engineers, not box-shifters. We survey the space, spec the system, and stand behind the install from first wire to final commissioning.',
  },
  {
    num: '02',
    title: 'Built for the Blackout',
    desc: 'The only heating in Kashmir that gets more useful the moment the power goes out, floors engineered to hold warmth for 8–10 hours after a cut.', // NEEDS-REAL-INFO: 8–10h retention claim
  },
  {
    num: '03',
    title: 'Customers, Then Sales',
    desc: 'We would rather lose a sale than fit the wrong system. Honest advice, right-sized quotes, and a team that answers long after the invoice is paid.',
  },
];

/* Timeline, PLACEHOLDER milestones. Dates other than 2011 are illustrative
   and must be replaced with real company moments before launch. */
export const MILESTONES = [
  { year: '2011', title: 'The first floor', desc: 'Founded by heating engineers in Srinagar, chasing a warmth that survives load-shedding.' }, // NEEDS-REAL-INFO
  { year: '2015', title: 'Hamam, done right', desc: 'Introduced wet-area-certified electric hamam systems for the Kashmiri home.' }, // PLACEHOLDER
  { year: '2019', title: 'Beyond the valley', desc: 'Extended supply and installation to homes and projects across the region.' }, // PLACEHOLDER
  { year: '2023', title: "Kashmir's largest", desc: 'Grew into the valley’s largest underfloor heating supplier and installer.' }, // NEEDS-REAL-INFO
  { year: 'Today', title: 'Warmer, every winter', desc: 'Thousands of floors later, still building for the coldest day, not the average one.' },
];

/* Stats, CounterNumber animates the numeric part; `value` is the number and
   `suffix`/`prefix` frame it. Figures carried from prior copy, verify. */
export const STATS = [
  { value: 14, suffix: '+', label: 'Years installing' },          // NEEDS-REAL-INFO
  { value: 6000, suffix: '+', label: 'Systems supplied', separator: true }, // NEEDS-REAL-INFO
  { value: 100, suffix: '%', label: 'Customers satisfied' },        // NEEDS-REAL-INFO
  { value: 25, suffix: ' yr', label: 'Warranty as standard' },
];

export const CTA = {
  eyebrow: 'The warm part',
  title: 'Ready for a floor that holds its heat?',
  sub: 'Talk to our team for a free, no-obligation survey and installation quote.',
  primary: { label: 'Book a Survey', href: '/contact' },
  secondary: { label: 'Browse Systems', href: '/product' },
};
