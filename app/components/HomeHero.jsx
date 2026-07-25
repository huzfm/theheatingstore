'use client';

/**
 * HomeHero, the home page's static, premium hero.
 *
 * Replaces the scroll-driven WebGL cutaway (`app/hero/*`) with a single
 * art-directed plate and a left-set copy column. No Three.js, no scroll
 * runway: it paints once, animates its copy in on load, and idles with a
 * couple of very cheap ambient loops (plate drift, copper bloom) that all
 * respect prefers-reduced-motion via HomeHero.css.
 *
 * The plate is the already-optimised `public/images/hero/plate-*` asset the
 * old hero shipped as its fallback, served responsively through next/image.
 */

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import './HomeHero.css';
import LeadPopup from './LeadPopup.jsx';

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

const STATS = [
  { num: '2011', label: 'Trusted Since' },
  { num: '5,000+', label: 'Installations' },
  { num: '25+', label: 'Global Brands' },
  { num: <>5<span>yr</span></>, label: 'Warranty' },
];

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

export default function HomeHero() {
  return (
    <>
      <section className="hhero" aria-label="Underfloor heating and electric hamam systems">
        <div className="hhero__plate">
          <Image
            src="/images/hero/home-hero-lounge.webp"
            alt="Luxury indoor–outdoor living space at dusk with a warm timber floor, fireplace and designer furniture, the kind of home kept comfortable by underfloor heating"
            fill
            priority
            sizes="100vw"
            quality={95}
          />
        </div>

        <div className="hhero__scrim" />
        <div className="hhero__glow" />
        <div className="hhero__grain" />

        <div className="hhero__inner">
          <motion.div
            className="hhero__copy"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.span className="hhero__eyebrow" variants={item}>
              <span className="hhero__eyebrow-dot" aria-hidden="true" />
              India&apos;s Largest Underfloor Heating Seller Since 2011
            </motion.span>

            <motion.h1 className="hhero__title" variants={item}>
              Underfloor Heating &amp;<br />
              Electric Hamam Systems.
              <br />
              <span className="accent">Installed Across India.</span>
            </motion.h1>

            <motion.p className="hhero__lede" variants={item}>
              From custom design and consultation to certified installation 
              advanced electric heating trusted by homeowners, architects, and
              builders across the country.
            </motion.p>

            <motion.p className="hhero__climate" variants={item}>
              Proven performance down to <strong>&minus;25&deg;C</strong> across
              Ladakh, Dras, Kargil &amp; Kashmir
            </motion.p>

            <motion.div className="hhero__ctas" variants={item}>
              <Link href="/contact" className="hhero__btn hhero__btn--primary">
                Talk to an Expert
                <ArrowIcon />
              </Link>
              <Link href="/SpaceVerification" className="hhero__btn hhero__btn--ghost">
                Book a Free Site Visit
              </Link>
            </motion.div>

            <motion.div className="hhero__stats" variants={item}>
              {STATS.map((s) => (
                <div className="hhero__stat" key={s.label}>
                  <span className="hhero__stat-num">{s.num}</span>
                  <span className="hhero__stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="hhero__chip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.8 }}
        >
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
        </motion.div>

        <div className="hhero__cue" aria-hidden="true">
          <span className="hhero__cue-track" />
          Scroll
        </div>
      </section>

      <LeadPopup />
    </>
  );
}
