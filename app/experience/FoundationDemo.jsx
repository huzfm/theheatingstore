'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import GlowCard from '@/components/ui/GlowCard';
import CounterNumber from '@/components/ui/CounterNumber';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { useParallax } from '@/hooks/useScrollProgress';
import { scrollToTarget } from '@/hooks/useLenis';

const EASE = [0.16, 1, 0.3, 1];

const CHECKS = [
  {
    n: '01',
    title: 'Lenis × ScrollTrigger',
    body: 'One clock, one scroll source. GSAP drives Lenis’ RAF; Lenis drives ScrollTrigger.update. Pinned sections in Phase 3 cannot drift.',
  },
  {
    n: '02',
    title: 'Scoped dark theme',
    body: 'Near-black ground, one warm accent. Applied via a flag on <html> that is removed on unmount — the other 40 pages stay exactly as they were.',
  },
  {
    n: '03',
    title: 'Custom cursor',
    body: 'Dot tracks 1:1, ring lags and blooms warm over anything clickable. Event delegation, so it works on elements that do not exist yet.',
  },
  {
    n: '04',
    title: 'Type system',
    body: 'Sora for display at a fluid clamp() scale, Hanken Grotesk for body. Tight tracking up top, generous line-height below.',
  },
];

export default function FoundationDemo() {
  const parallaxRef = useRef(null);
  useParallax(parallaxRef, 120);

  return (
    <div className="relative">
      {/* ── Ambient warmth: a fixed radial bloom behind everything ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80vw 60vh at 50% -10%, rgba(255,138,61,0.13), transparent 65%), radial-gradient(50vw 50vh at 85% 110%, rgba(255,138,61,0.07), transparent 60%)',
        }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-16 lg:px-24">
        <motion.p
          className="exp-eyebrow mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          Phase 1 — Foundation
        </motion.p>

        {/* Load-in stagger: each word rises out of its own mask line. */}
        <motion.h1
          className="exp-display max-w-[16ch] text-balance"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
          }}
        >
          {['Warmth,', 'engineered', 'beneath', 'your', 'feet.'].map((word, i) => (
            <span
              key={word}
              className="inline-block overflow-hidden align-bottom"
              style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: '110%' },
                  visible: { y: '0%', transition: { duration: 1, ease: EASE } },
                }}
              >
                {/* Final word carries the accent — the one warm note up here. */}
                <span className={i === 4 ? 'text-heat-500' : undefined}>{word}</span>
                {i < 4 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-10 max-w-[46ch] text-lg text-bone-300 md:text-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          The foundation layer is live. Move your cursor, scroll the page, hover
          the cards below — every primitive the next seven phases build on is
          already running here.
        </motion.p>

        <motion.div
          className="mt-14 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
        >
          <MagneticButton
            size="lg"
            cursorLabel="Scroll"
            onClick={() => scrollToTarget('#checks', { offset: -40 })}
          >
            See the primitives
          </MagneticButton>
          <MagneticButton variant="outline" size="lg" as="a" href="/">
            Back to the live site
          </MagneticButton>
        </motion.div>

        {/* Scroll cue — a line that draws downward on a loop */}
        <motion.div
          className="absolute bottom-10 left-6 flex items-center gap-4 md:left-16 lg:left-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <div className="relative h-16 w-px overflow-hidden bg-white/12">
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-heat-500"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="exp-eyebrow">Scroll</span>
        </motion.div>
      </section>

      {/* ═══ PRIMITIVE CHECKS ═══ */}
      <section
        id="checks"
        className="exp-spotlight relative px-6 py-32 md:px-16 lg:px-24"
        onPointerMove={(e) => {
          // Feeds the cursor-following wash defined by .exp-spotlight.
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
        }}
      >
        <RevealText as="h2" className="exp-h2 max-w-[14ch]">
          Everything downstream leans on this.
        </RevealText>

        <RevealGroup className="mt-20 grid gap-5 sm:grid-cols-2">
          {CHECKS.map((c) => (
            <RevealItem key={c.n}>
              <GlowCard className="h-full p-9">
                <span className="font-display text-xs tracking-[0.3em] text-heat-500">
                  {c.n}
                </span>
                <h3 className="mt-6 text-2xl">{c.title}</h3>
                <p className="mt-4 text-[15px] text-bone-500">{c.body}</p>
              </GlowCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ═══ COUNTERS + PARALLAX ═══ */}
      <section className="relative overflow-hidden px-6 py-32 md:px-16 lg:px-24">
        <div
          ref={parallaxRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 flex justify-center"
        >
          <span className="select-none font-display text-[22vw] font-extrabold leading-none text-white/[0.022]">
            22°C
          </span>
        </div>

        <Reveal>
          <p className="exp-eyebrow">Counters — every stat animates from zero</p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-12 sm:grid-cols-3">
          {[
            { v: 10, suffix: ' yr', label: 'Warranty coverage' },
            { v: 1400, suffix: '+', label: 'Rooms heated' },
            { v: 5, suffix: ' mm', label: 'Profile height', decimals: 0 },
          ].map((s) => (
            <RevealItem key={s.label}>
              <CounterNumber
                value={s.v}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
                className="block font-display text-6xl font-bold tracking-tight text-bone-100 md:text-7xl"
              />
              <span className="mt-4 block text-sm text-bone-500">{s.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ═══ HANDOFF ═══ */}
      <section className="px-6 pb-40 pt-10 md:px-16 lg:px-24">
        <GlowCard interactive={false} className="p-10 md:p-14">
          <p className="exp-eyebrow">Next up</p>
          <h3 className="mt-5 max-w-[22ch] text-3xl md:text-4xl">
            Phase 2 — the hero, with its 3D floor scene.
          </h3>
          <p className="mt-5 max-w-[52ch] text-bone-500">
            React Three Fiber gets lazy-loaded behind a dynamic import so it
            never blocks this page&apos;s first paint.
          </p>
        </GlowCard>
      </section>
    </div>
  );
}
