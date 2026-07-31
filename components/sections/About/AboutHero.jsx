'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import MagneticButton from '@/components/ui/MagneticButton';
import ThermostatDial from '@/components/ui/ThermostatDial';
import HeatFloorAnimation from './HeatFloorAnimation';
import { HERO } from './data';

/**
 * Dark cinematic opener over a relevant, heavily-darkened backdrop. Left:
 * word-stagger headline + CTAs. Right: the thermostat dial, auto-cycling
 * through the states an installed system actually goes through, including
 * the power cut, where the dial goes dark but the stored-warmth arc keeps
 * depleting slowly. That last state is the headline beside it, restated as an
 * instrument reading.
 *
 * The dial is SVG, not WebGL: no three.js in this route's initial bundle, and
 * nothing here needs a render loop. The heating mat itself is the subject of
 * StoryRail further down the page, so the hero doesn't repeat it.
 *
 * HeatFloorAnimation (the CSS thermal wash that used to be the whole panel)
 * stays underneath at low opacity as the ambient glow behind the dial.
 */
export default function AboutHero() {
  const reduce = useReducedMotion();
  const [dialState, setDialState] = useState('off');

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-bone-100">
      {/* Full-bleed backdrop image */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/abo.png')` }}
      />
      {/* Legibility + mood: darken overall, darker still under the left copy */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.82) 42%, rgba(10,10,10,0.55) 100%), linear-gradient(180deg, rgba(10,10,10,0.4), rgba(10,10,10,0.85))',
        }}
      />
      {/* Ambient heat wash, slow breathing pulse, stilled under reduced motion */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(55vw 45vh at 74% 30%, rgba(255,138,61,0.16), transparent 62%), radial-gradient(45vw 40vh at 6% 92%, rgba(255,138,61,0.06), transparent 60%)',
        }}
      />
      {/* Fine grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      <div className="relative z-10 mx-auto grid min-h-[94vh] max-w-7xl items-center gap-10 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-36">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
              <span className="h-px w-8 bg-heat-500/60" />
              {HERO.eyebrow}
            </span>
          </Reveal>

          <RevealText
            as="h1"
            className="mt-6 max-w-[15ch] font-serif text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95] tracking-[0.005em] text-bone-100"
          >
            {HERO.headline}
          </RevealText>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-bone-300 sm:text-lg">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
              <MagneticButton as="a" href={HERO.primary.href} variant="solid" size="lg">
                {HERO.primary.label}
              </MagneticButton>
              <MagneticButton as="a" href={HERO.secondary.href} variant="outline" size="lg">
                {HERO.secondary.label}
                <span aria-hidden className="text-heat-400">→</span>
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* Thermostat panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative"
        >
          <div
            className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.10), transparent 55%), linear-gradient(180deg, #131211 0%, #0b0b0a 100%)',
            }}
          >
            {/* Ambient thermal wash behind the dial. Held low so it reads as
                the glow off a warm floor rather than a second animation
                competing with the instrument in front of it. */}
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-1000 ease-out"
              style={{
                opacity:
                  dialState === 'heating' ? 0.42 : dialState === 'holding' ? 0.3 : 0.14,
              }}
            >
              <HeatFloorAnimation />
            </div>

            <ThermostatDial onStateChange={setDialState} />

            {/* Instrument caption. Both readouts come from the dial's own state
                callback, so the labels physically cannot disagree with the ring
                in front of them. */}
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500"
                style={{ color: dialState === 'outage' ? '#8c857d' : '#ffb061' }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: dialState === 'outage' ? '#8c857d' : '#ffb061',
                    boxShadow:
                      dialState === 'outage' ? 'none' : '0 0 10px 2px rgba(255,138,61,0.8)',
                  }}
                />
                {dialState === 'outage' ? 'Grid · Out' : 'Grid · Live'}
              </span>
              {/* Device identity, not state, the dial's own readout already
                  carries the status line, and repeating it here would just be
                  the same sentence twice in one panel. */}
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-500/70">
                Electric Hamam
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Seam glow into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
      />
    </section>
  );
}
