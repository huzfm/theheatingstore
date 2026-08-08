'use client';

/**
 * HomeHero, the home page's static, premium hero.
 *
 * Replaces the scroll-driven WebGL cutaway (`app/hero/*`) with a left-set copy
 * column beside an asymmetric 2x2 visual grid. No Three.js, no scroll runway:
 * it paints once, animates copy and grid in on load, and idles with a couple of
 * very cheap ambient loops (plate drift, copper bloom) that all respect
 * prefers-reduced-motion via HomeHero.css.
 *
 * The grid's large cell keeps the full cinematic plate treatment (scrim, copper
 * bloom, grain, slow drift), just reframed from full-bleed into that cell. The
 * three smaller cells are stat cards on the same dark-glass surface the rest of
 * the site uses (the `.whc-card` recipe from WhyChooseUsClient).
 */

import Image from 'next/image';
import { motion } from 'framer-motion';

import './HomeHero.css';
import LeadPopup from './LeadPopup.jsx';
import HeroCTAs from '@/components/ui/HeroCTAs';

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7L12 2z" />
  </svg>
);

/* Each stat carries its own plate. The card images are veiled in ink and washed
   with copper by HomeHero.css, so mixed-temperature source photography still
   resolves to the one warm palette the rest of the site uses. */
const STATS = [
  { num: '2011', label: 'Trusted Since' },
  {
    num: '5,000+',
    label: 'Installations',
    img: '/landing/land3.png',
    alt: 'Underfloor heating pipework laid out across a full open-plan kitchen floor before screeding',
  },
  {
    num: '25+',
    label: 'Global Brands',
    img: '/resons/reason2.jpg',
    alt: 'A branded electric underfloor heating mat part-rolled over a tiled floor beside stacked porcelain tiles',
  },
  {
    num: <>5<span>yr</span></>,
    label: 'Warranty',
    img: '/landing/land1.png',
    alt: 'A warm timber-lined living room with a rug, throws and low lamplight',
  },
];

/* Three of the four stats become grid cards; "Trusted Since 2011" reads better
   as a badge on the photo cell than as a fourth card, so it is pulled out here
   and rendered over the plate instead. `5,000+ Installations` carries the
   copper-tinted "hero stat" treatment. */
const [BADGE_STAT, ...CARD_STATS] = STATS;

/* Staggered fade-up for the copy column. */
const ease = [0.16, 1, 0.3, 1];
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/* The visual grid enters after the copy: photo cell first, then the three stat
   cards 0.1s apart, on the same ease curve as `item`. */
const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};
const photoCell = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease } },
};
const cardCell = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function HomeHero() {
  return (
    <>
      <section className="hhero" aria-label="Underfloor heating and electric hamam systems">
        <div className="hhero__inner">
          <motion.div
            className="hhero__copy"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* The claim, set as a maker's line.
                ──────────────────────────────────
                Three equal segments divided by copper diamonds and closed by a
                hairline that fades out to the right - the provenance line a
                house puts under its name, not a UI chip. Words unchanged.

                Everything is one size and one tracking; the only hierarchy is
                colour, so "India's Largest" leads on copper and the rest sits
                back in ivory. That is what lets it stay a single quiet line
                under type this large: an eyebrow that competes on size with
                the headline beneath it has already lost. */}
            <motion.span className="hhero__eyebrow" variants={item}>
              <span className="hhero__eyebrow-key">India&apos;s Largest</span>
              <span className="hhero__eyebrow-sep" aria-hidden="true" />
              <span className="hhero__eyebrow-sub">Underfloor Heating Seller</span>
              <span
                className="hhero__eyebrow-sep hhero__eyebrow-sep--date"
                aria-hidden="true"
              />
              <span className="hhero__eyebrow-year">Since 2011</span>
            </motion.span>

            <motion.h1 className="hhero__title" variants={item}>
              Underfloor Heating &amp;<br />
              Electric Hamam Systems.
              <br />
              <span className="accent">Installed Across India.</span>
            </motion.h1>

            {/* <motion.p className="hhero__lede" variants={item}>
              From custom design and consultation to certified installation 
              advanced electric heating trusted by homeowners, architects, and
              builders across the country.
            </motion.p> */}

            {/* <motion.p className="hhero__climate" variants={item}>
              Proven performance down to <strong>&minus;25&deg;C</strong> across
              Ladakh, Dras, Kargil &amp; Kashmir
            </motion.p> */}

            <motion.div className="hhero__ctas" variants={item}>
              <HeroCTAs />
            </motion.div>
          </motion.div>

          <motion.div
            className="hhero__grid"
            variants={gridContainer}
            initial="hidden"
            animate="show"
          >
            {/* Cell A — the cinematic plate, full original treatment, reframed. */}
            <motion.div className="hhero__cell hhero__cell--photo" variants={photoCell}>
              <div className="hhero__plate">
                <Image
                  src="/images/hero/home-hero-lounge.png"
                  alt="Luxury indoor–outdoor living space at dusk with a warm timber floor, fireplace and designer furniture, the kind of home kept comfortable by underfloor heating"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 45vw"
                  quality={95}
                />
              </div>

              <div className="hhero__scrim" />
              <div className="hhero__glow" />
              <div className="hhero__grain" />

              <div className="hhero__badge">
                <span className="hhero__badge-num">{BADGE_STAT.num}</span>
                <span className="hhero__badge-label">{BADGE_STAT.label}</span>
              </div>

              <div className="hhero__chip">
                <span className="hhero__chip-ring">
                  <ShieldIcon />
                </span>
                <span className="hhero__chip-text">
                  <span className="hhero__chip-stars" aria-hidden="true">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </span>
                  <span className="hhero__chip-top">Certified Installers</span>
                  <span className="hhero__chip-sub">Rated 4.9/5 by homeowners</span>
                </span>
              </div>
            </motion.div>

            {/* Cells B/C/D — dark-glass stat cards, B carries the copper accent. */}
            {CARD_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className={`hhero__cell hhero__card${i === 0 ? ' hhero__card--accent' : ''}`}
                variants={cardCell}
              >
                <div className="hhero__card-plate">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 22vw"
                    quality={80}
                  />
                </div>
                <div className="hhero__card-veil" />

                <span className="hhero__stat-num">{s.num}</span>
                <span className="hhero__stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

    
      </section>

      <LeadPopup />
    </>
  );
}
