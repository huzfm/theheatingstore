'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
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
 *
 * The dial's state is lifted here rather than kept inside the dial because two
 * things outside the panel read it: the status chip above the headline and the
 * grid caption below it. Everything that claims the grid is live is therefore
 * driven by the same value the ring itself is drawn from.
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
      {/* Vignette, pulls the eye off the frame edges and onto the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 85% at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Fine grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* svh not vh: on mobile `100vh` is measured with the URL bar hidden, so
          it overflows by the height of the bar and pushes content under the
          fold.

          Everything below is sized so the whole opener, headline through dial,
          fits inside one phone screen. That is the constraint the mobile type
          scale, the tighter spacing, the 200px dial and the sm-gated fact strip
          are all answering: previously the column ran to roughly 1.5 screens,
          so the first view ended mid-paragraph with the top half of the
          thermostat below it. */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-5 px-5 pb-8 pt-20 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-36">
        {/* Copy */}
        <div>
          {/* Eyebrow as a chip rather than a bare line: it reads as a badge
              against a photographic backdrop, where a hairline + text alone
              gets lost in whatever is behind it. The dot is live-tied to the
              dial, so it goes grey with the panel during the outage state. */}
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-4 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-300 backdrop-blur-sm sm:text-[11px] sm:tracking-[0.28em]">
              <motion.span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: dialState === 'outage' ? '#8c857d' : '#ff8a3d',
                  boxShadow:
                    dialState === 'outage'
                      ? 'none'
                      : '0 0 10px 2px rgba(255,138,61,0.75)',
                }}
                animate={reduce || dialState === 'outage' ? undefined : { opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {HERO.eyebrow}
            </span>
          </Reveal>

          {/* Two blocks, not one: the second half carries the heat gradient,
              which is the whole point of the sentence. aria-label on the
              wrapper keeps the h1 a single readable string, and the halves are
              aria-hidden so a screen reader doesn't hear it twice.
              [&_span]:leading-[inherit]: RevealText wraps each word in a bare
              <span>, which globals.css gives line-height 1.75. Without this
              the headline's wrapped lines on a phone sit nearly twice as far
              apart as the clamp asks for. */}
          <h1
            aria-label={HERO.headline}
            className="mt-5 max-w-[17ch] font-serif tracking-[0.005em] sm:mt-6"
            // Inline, not a text-* utility: globals.css sizes `h1` outside any
            // cascade layer (clamp(2.5rem, 6vw, 5rem)), and unlayered rules beat
            // Tailwind utilities, so a class here is silently ignored. Inline
            // wins, and is the only way to give this headline its own scale.
            style={{ fontSize: 'clamp(1.95rem, 6.6vw, 4.5rem)', lineHeight: 1.03 }}
          >
            {/* style={{lineHeight:'inherit'}} on both halves for the same
                reason as the h1's inline font-size: these wrappers are spans,
                and globals.css's unlayered `span { line-height: 1.75 }` would
                otherwise double-space the headline whatever the h1 says. */}
            <RevealText
              as="span"
              aria-hidden
              className="block text-bone-100"
              style={{ lineHeight: 'inherit' }}
            >
              {HERO.headlineLead}
            </RevealText>
            <RevealText
              as="span"
              aria-hidden
              delay={0.18}
              className="block bg-gradient-to-br from-heat-300 via-heat-500 to-heat-500/55 bg-clip-text text-transparent"
              style={{ lineHeight: 'inherit' }}
            >
              {HERO.headlineAccent}
            </RevealText>
          </h1>

          {/* Rule down the left of the standfirst, so the paragraph reads as a
              caption to the headline rather than as the next block down. */}
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl border-l border-heat-500/35 pl-4 text-[13.5px] leading-[1.6] text-bone-300 sm:mt-7 sm:pl-5 sm:text-lg sm:leading-relaxed">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <HeroCTAs className="mt-6 sm:mt-10" />
          </Reveal>

          {/* Three figures the page then backs up, so the opener carries proof
              and not only claims. Hidden on phones: at 390px the screen is
              already spent on headline, standfirst, CTAs and the dial, and this
              was the block that pushed the dial out of the first view. From sm
              up there is room, and it goes three across. */}
          <Reveal delay={0.4} className="hidden sm:block">
            <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7 sm:mt-12 sm:pt-8">
              {HERO.facts.map((f) => (
                <div
                  key={f.label}
                  className="border-l border-white/10 px-2 first:border-l-0 first:pl-0 sm:px-4 sm:first:pl-0"
                >
                  <dt className="font-serif text-[clamp(1.15rem,4.6vw,1.5rem)] leading-none text-heat-400 sm:text-[clamp(1.6rem,2.6vw,2.1rem)]">
                    {f.value}
                  </dt>
                  <dd
                    className="mt-2.5 max-w-[20ch] text-[10.5px] leading-snug text-bone-500 sm:mt-3 sm:text-[13px] sm:leading-relaxed"
                    style={{ hyphens: 'auto' }}
                  >
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Thermostat panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          // Capped and centred until lg. The panel is square, so at full column
          // width on a phone it is ~350px tall on its own and cannot share the
          // first screen with the copy. 200px still reads as an instrument
          // (the dial's own readout is ~40px type inside it) and fits.
          // -translate-y on lg only: the grid is items-center, so the square
          // panel otherwise sits lower than the headline's optical centre once
          // the fact strip is in play. Nudged up, the dial reads as level with
          // the copy. Left alone below lg, where the column is stacked and the
          // mobile layout is already fitted to one screen.
          className="relative mx-auto w-[min(72vw,264px)] sm:w-[min(48vw,300px)] lg:w-full lg:-translate-y-40"
        >
          {/* Halo behind the panel. Slow conic sweep so the instrument sits in
              a moving pool of warmth rather than on a flat plate; stilled, but
              still present, under reduced motion. Blurred and inset-negative,
              so it never reads as a second border. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-[60px] opacity-60 blur-2xl sm:-inset-10 sm:blur-3xl"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255,138,61,0.22), transparent 32%, rgba(255,138,61,0.10) 55%, transparent 78%, rgba(255,138,61,0.22))',
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
          />

          {/* Instrument-case corner brackets. Cheap, but they do the work of
              framing the dial as a device you're being shown, which the bare
              rounded rectangle didn't. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-2 z-10 h-6 w-6 rounded-tl-[10px] border-l-2 border-t-2 border-heat-500/45 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-2 z-10 h-6 w-6 rounded-tr-[10px] border-r-2 border-t-2 border-heat-500/45 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-2 -left-2 z-10 h-6 w-6 rounded-bl-[10px] border-b-2 border-l-2 border-heat-500/45 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-2 -right-2 z-10 h-6 w-6 rounded-br-[10px] border-b-2 border-r-2 border-heat-500/45 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          />

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
                in front of them. Hidden on phones, where the panel is 200px and
                two 10px captions would sit on top of the dial's own status
                line; the chip above the headline already carries grid state. */}
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 hidden items-center justify-between sm:flex">
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

      {/* Scroll cue. Desktop only: on a phone the dial already sits at the
          bottom of the first screen, and a cue under it would collide with the
          floating widget this route carries bottom-left. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 hidden justify-center lg:flex">
        <motion.span
          aria-hidden
          className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/15 pt-2"
          animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className="block h-1.5 w-[3px] rounded-full bg-heat-500"
            animate={reduce ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.span>
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
