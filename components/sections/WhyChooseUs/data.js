/**
 * Content for /why-choose-us.
 *
 * Carried from the previous version of this module, which was already split
 * into per-section components but on its own amber/coral design system: a
 * theme.js, an icons.jsx of hand-rolled SVGs, and ~1,800 lines of CSS across
 * nine stylesheets. The content survives, the system does not.
 *
 * Two changes of substance:
 *
 * 1. The old PROCESS list was five numbered "steps", but only two of them were
 *    steps (consultation, design). The other three were offers, service
 *    support, a price-match promise and a lifetime warranty, which are not
 *    stages in a sequence. /how-it-works owns the actual five-stage process,
 *    so this is reframed as OFFERS, what you get, and links there for the
 *    order things happen in.
 *
 * 2. AVATARS is gone. It was four Unsplash face photographs of strangers,
 *    rendered as a row of customer avatars beside the review count. Stock
 *    photos standing in for customers is fabricated social proof, and the
 *    testimonials below are attributed to named people at named firms, so the
 *    page does not need it.
 */

export const HERO = {
  eyebrow: 'Why choose us · Since 2011',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'The part that matters is what happens after.',
  sub: 'Anyone can sell you a heating cable. The question worth asking is who answers the phone in year six, and whether the system was specified properly in the first place.',
  bgImage: '/images/el.png',
};

export const STATS = {
  eyebrow: 'The numbers',
  title: 'What we have to show for it.',
  list: [
    {
      display: '300K+',
      label: 'Customers served',
      sub: 'Across India and nine countries',
      bullets: [
        'Residential and commercial projects',
        'Verified five-star reviews',
        '99% satisfaction rate',
      ],
    },
    {
      display: '2M+',
      label: 'Systems installed',
      sub: 'Globally since 2011',
      bullets: [
        '500,000+ installations in India',
        '0.01% fault rate across all systems',
        'Compatible with every floor type',
      ],
    },
    {
      display: '10–25+',
      label: 'Year warranty',
      sub: 'Depending on the system specified',
      bullets: [
        'Ten to twenty-five years of cover',
        'No-hassle claims process',
        'Parts and labour fully covered',
      ],
    },
    {
      display: '9',
      label: 'Countries',
      sub: 'Where these systems are installed',
      bullets: [
        'UK · Sweden · UAE · France',
        'Finland · Netherlands · Turkey',
        'Bhutan · India, and growing',
      ],
    },
  ],
};

export const RELIABILITY = {
  eyebrow: 'When something goes wrong',
  title: 'What you are actually buying.',
  intro:
    'Every one of these is a promise about a bad day, not a good one. That is the only kind worth comparing between suppliers.',
  list: [
    {
      title: 'Near-zero failure rate',
      desc: '0.01% fault rate across two million-plus global installations, engineered for extreme cold climates.',
    },
    {
      title: '24 hour replacement guarantee',
      desc: 'If a system fails, we replace it within twenty-four hours, anywhere in India.',
    },
    {
      title: '10 to 25+ year product warranty',
      desc: 'Every system ships with an industry-leading warranty. Fully transferable, valid across India.',
    },
    {
      title: 'Custom design, every project',
      desc: 'Heating layout plans, cable density maps and thermostat zone configurations drawn for your floor.',
    },
  ],
  /* ISO 3166-1 alpha-2 for react-world-flags. */
  countries: [
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Turkey', code: 'TR' },
    { name: 'UAE', code: 'AE' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'India', code: 'IN' },
  ],
};

/** Formerly PROCESS. See the note at the top of this file. */
export const OFFERS = {
  eyebrow: 'What you get',
  title: 'Included, not upsold.',
  intro:
    'These come with the job rather than appearing as lines on a quote later.',
  list: [
    {
      num: '01',
      title: 'Free consultation',
      desc: 'Our experts assess the space, the floor type and how you actually use the rooms, before anything is specified.',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
    {
      num: '02',
      title: 'Custom design and layout',
      desc: 'Engineers turn your floor plan into a heating layout, mapping cable density, wattage zones and thermostat placement room by room, before a single cable is ordered.',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    },
    {
      num: '03',
      title: 'Service support that answers',
      desc: 'From the first enquiry to aftercare years later. Technical questions, troubleshooting or a warranty claim, the same team handles all of it.',
      img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
    },
    {
      num: '04',
      title: 'Price match promise',
      desc: 'Found the same system cheaper from an authorised supplier? We match it. Same product, same warranty, same certified installation.',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    },
    {
      num: '05',
      title: 'Lifetime warranty options',
      desc: 'Many of the systems we carry come with lifetime manufacturer warranties, which is the strongest statement a maker can make about its own cable.',
      img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: 'From the trade',
  title: 'The people who specify it repeatedly.',
  list: [
    {
      initials: 'AA',
      name: 'Asif Ali',
      role: 'Principal Architect, Ali Associates, Srinagar',
      tag: 'Verified purchase',
      text: 'We have specified The Heating Store across six luxury residential and commercial projects. The installation quality is immaculate, zero callbacks, zero defects. The 0.01% fault rate they advertise is absolutely real. Nothing else comes close.',
    },
    {
      initials: 'KS',
      name: 'Kamran Siddiq',
      role: 'Senior Project Manager, Siddiq Builders, Jammu',
      tag: 'Trade account',
      text: 'The design consultation was outstanding. Custom heating zones mapped across a 5,000 sq ft penthouse, flawless installation from start to finish. Our clients were absolutely delighted with the result.',
    },
    {
      initials: 'SF',
      name: 'Syed Faizan',
      role: 'Head of Development, Faizan Developments, Kashmir',
      tag: 'Commercial project',
      text: 'Deployed across a 60-unit luxury residential complex. Every system performed perfectly from day one. The 25-year warranty gives our homebuyers genuine confidence, it is a real differentiator in the market.',
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
    'Free consultation',
    'Custom design',
    'Expert installation',
    '25+ year warranty',
    'Dedicated support team',
    '24h replacement',
  ],
};
