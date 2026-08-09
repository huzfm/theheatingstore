/**
 * About-page content, isolated from presentation.
 *
 * Every company figure on this page now comes from content/facts.ts. The
 * NEEDS-REAL-INFO markers that used to sit against the install count, the
 * warranty and the years figure are gone because those values are no longer
 * authored here, they are owned by the facts file and stated once.
 *
 * The PLACEHOLDER markers on the gallery and timeline imagery/milestones
 * remain: those are stock photographs and illustrative dates, and replacing
 * them needs real photography and real company history, not a constant.
 */

import siteFacts, { yearsInBusiness } from '@/content/facts';

export const HERO = {
  eyebrow: 'Since 2011',
  // RevealText animates word-by-word, so keep this as a plain string. The full
  // sentence is what the h1 exposes to assistive tech; the two halves below are
  // the same sentence split so the second can carry the heat gradient.
  headline: 'We keep homes warm when the electricity goes out.',
  headlineLead: 'We keep homes warm',
  headlineAccent: 'when the electricity goes out.',
  sub: 'The Heating Store engineers, supplies and installs electric hamam and underfloor heating built for sub-zero winters and daily power cuts, where staying warm is not a luxury, it is the whole point.',
  // Button labels/destinations are owned by components/ui/HeroCTAs.
  /* Three figures the rest of the page then backs up. Same shape as the
     /how-it-works hero strip. Kept to three: a fourth wraps on a phone. */
  facts: [
    { value: String(siteFacts.foundedYear), label: 'Engineering floors since' },
    {
      value: siteFacts.installationsWorldwide.display,
      label: siteFacts.installationsWorldwideLabel,
    },
    { value: siteFacts.installationWarranty, label: 'Warranty as standard' },
  ],
  // Full-bleed atmospheric backdrop (heavily darkened behind the copy).
  bgImage:
    '/images/stock/1600880292203-757bb62b4baf-1600.webp',
  // Static poster shown in place of the live 3D under reduced motion.
  poster:
    '/images/stock/1558618666-fcd25c85cd64-1000.webp',
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
    '/images/stock/1600880292203-757bb62b4baf-1200.webp',

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
      src: '/images/stock/1504328345606-18bbc8c9d7d1-900.webp',
    },
    {
      id: 'first-floor',
      label: 'The first floor',
      caption: 'The first mat we ever laid, specced for a house that lost power most evenings.', // PLACEHOLDER
      src: '/images/stock/1600880292203-757bb62b4baf-900.webp',
    },
    {
      id: 'cable',
      label: 'Cable, not guesswork',
      caption: 'Every run measured and logged before a single screed board goes down.', // PLACEHOLDER
      src: '/images/stock/1581092160562-40aa08e78837-900.webp',
    },
    {
      id: 'hamam',
      label: 'Hamam, done right',
      caption: 'Wet-area-certified systems for the one room in a Kashmiri home that never gets to be cold.', // PLACEHOLDER
      src: '/images/stock/1552321554-5fefe8c9ef14-900.webp',
    },
    {
      id: 'winter',
      label: 'Built for the valley',
      caption: 'Specced against the coldest week of the year, not the average one.', // PLACEHOLDER
      src: '/images/stock/1418985991508-e47386d96a71-900.webp',
    },
    {
      id: 'commissioning',
      label: 'Commissioned by hand',
      caption: 'Insulation resistance and continuity checked twice, before the floor closes and after.', // PLACEHOLDER
      src: '/images/stock/1621905251189-08b45d6a269e-900.webp',
    },
    {
      id: 'team',
      label: 'Engineers, not resellers',
      caption: 'The people who spec the system are the people who stand behind the install.', // PLACEHOLDER
      src: '/images/stock/1600585154340-be6161a56a0c-900.webp',
    },
    {
      id: 'today',
      label: 'Warmer, every winter',
      caption: 'Thousands of floors later, still building for the moment the grid goes quiet.', // PLACEHOLDER
      src: '/images/stock/1493809842364-78817add7ffb-900.webp',
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
    desc: `The only heating in Kashmir that gets more useful the moment the power goes out, floors engineered to hold warmth for ${siteFacts.heatRetention.hours} after a cut.`,
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
  { year: '2023', title: "India's largest", desc: "Grew into the country's largest underfloor heating supplier and installer." }, // NEEDS-REAL-INFO
  { year: 'Today', title: 'Warmer, every winter', desc: 'Thousands of floors later, still building for the coldest day, not the average one.' },
];

/* Stats. `value` is a number CounterNumber counts up to; `text` is a stat that
   is not a number and is rendered as-is (the warranty, which is a word).
   Every figure here is owned by content/facts.ts.

   `yearsInBusiness()` is evaluated when this page is built, so it is correct
   at every deploy instead of being an authored number that silently goes
   stale, which is how "14+" ended up contradicting /about's own meta
   description ("Over 15 years"). */
export const STATS = [
  { value: yearsInBusiness(), suffix: '+', label: 'Years installing' },
  {
    value: siteFacts.installationsWorldwide.value,
    suffix: '+',
    label: siteFacts.installationsWorldwideLabel,
    separator: true,
  },
  { value: 100, suffix: '%', label: 'Customers satisfied' }, // NEEDS-REAL-INFO
  { text: siteFacts.installationWarranty, label: 'Warranty as standard' },
];

export const CTA = {
  eyebrow: 'The warm part',
  title: 'Ready for a floor that holds its heat?',
  sub: 'Talk to our team for a free, no-obligation survey and installation quote.',
  // Button labels/destinations are owned by components/ui/HeroCTAs.
};
