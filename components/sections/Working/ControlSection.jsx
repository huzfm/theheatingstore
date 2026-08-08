'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import ThermostatDial from '@/components/ui/ThermostatDial';
import HeatFloorAnimation from '@/components/sections/About/HeatFloorAnimation';
import { CONTROL } from './data';

const EASE = [0.16, 1, 0.3, 1];

/**
 * The control layer, the same auto-cycling dial that opens /about, but here it
 * is doing a different job: on About it is atmosphere beside a headline, and
 * on this page it is the illustration for the copy next to it.
 *
 * The list of states is driven by the dial's own onStateChange, not by a
 * second timer of our own. That matters, the dial's sequence has per-state
 * durations, so any parallel timer would drift out of step within a loop or
 * two and start highlighting the wrong paragraph.
 *
 * The dial is sticky on desktop: the five state descriptions are taller than
 * the instrument, and reading "Power cut" while the dial has scrolled off the
 * top would break the only link between the two columns.
 */
export default function ControlSection() {
  const [dialState, setDialState] = useState('off');

  /* Stable identity: ThermostatDial lists onStateChange in an effect's deps,
     so an inline arrow would re-run that effect on every render of this
     component. */
  const handleState = useCallback((s) => setDialState(s), []);

  /* The slide the mobile view shows. Falls back to the first state rather than
     rendering nothing if the dial ever reports an id this copy doesn't cover. */
  const activeIndex = Math.max(
    0,
    CONTROL.states.findIndex((s) => s.id === dialState)
  );
  const activeState = CONTROL.states[activeIndex];

  return (
    <section className="relative overflow-hidden bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-32">
      {/* Warm floor-glow behind the whole section, tied to nothing, this is
          ambience rather than a second readout. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60vw 50vh at 78% 40%, rgba(255,138,61,0.08), transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
            <span className="h-px w-8 bg-heat-500/60" />
            {CONTROL.eyebrow}
          </span>
        </Reveal>

        <RevealText
          as="h2"
          className="mt-7 max-w-[18ch] font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-bone-100"
        >
          {CONTROL.title}
        </RevealText>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-300">
            {CONTROL.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* The instrument */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.10), transparent 55%), linear-gradient(180deg, #131211 0%, #0b0b0a 100%)',
              }}
            >
              {/* Thermal wash held low so it reads as glow off a warm floor
                  rather than a second animation competing with the dial. */}
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

              <ThermostatDial onStateChange={handleState} />

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
                        dialState === 'outage'
                          ? 'none'
                          : '0 0 10px 2px rgba(255,138,61,0.8)',
                    }}
                  />
                  {dialState === 'outage' ? 'Grid · Out' : 'Grid · Live'}
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-500/70">
                  Live demo
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.24em] text-bone-500/70">
              Cycling through a full day
            </p>
          </div>

          {/* ── Mobile: one state at a time ──────────────────────────────
              The desktop timeline is five paragraphs on a spine, and stacked
              on a phone that is a column taller than the screen: the dial
              advances, the highlight moves to a row that is scrolled out of
              view, and the two halves stop looking connected. So on narrow
              screens the list becomes a single slide showing only the state
              the dial is actually in, with a dot rail for position.

              Advanced by the dial, not by a timer or a swipe. The dial owns
              the sequence and its states have different durations, so
              anything that could move this independently would immediately
              disagree with the instrument it is captioning. */}
          <div className="lg:hidden">
            {/* Given a card rather than left as loose text on the page
                background. The slide changes on the dial's schedule, not the
                reader's, and copy that swaps itself with no frame around it
                reads as a glitch; a panel makes it obvious that this is one
                surface showing one state at a time. Same chrome as the
                instrument above it, so the two read as a pair. */}
            <div
              className="relative overflow-hidden rounded-[24px] border border-white/10 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:p-7"
              style={{
                background:
                  'radial-gradient(130% 100% at 0% 0%, rgba(255,138,61,0.09), transparent 55%), linear-gradient(180deg, #151312 0%, #0c0b0a 100%)',
              }}
            >
              {/* Lit top edge, the same hairline the callout cards use. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(to right, transparent, rgba(255,176,97,0.75) 24%, rgba(255,255,255,0.14) 62%, transparent)',
                }}
              />

              <div className="flex items-center gap-4">
                <span aria-hidden className="flex items-center gap-1.5">
                  {CONTROL.states.map((s) => (
                    <motion.span
                      key={s.id}
                      className="h-[3px] rounded-full"
                      initial={false}
                      animate={{
                        width: dialState === s.id ? 22 : 10,
                        backgroundColor:
                          dialState === s.id ? '#ff8a3d' : 'rgba(255,255,255,0.16)',
                      }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  ))}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-bone-500/70">
                  {String(activeIndex + 1).padStart(2, '0')}
                  <span className="text-bone-500/40">
                    /{String(CONTROL.states.length).padStart(2, '0')}
                  </span>
                </span>
              </div>

              {/* Fixed height, so the card doesn't resize under the reader
                  every time a shorter or longer paragraph comes round. Sized
                  to the longest of the five at this width. */}
              <div className="relative mt-6 min-h-[190px]">
                <AnimatePresence>
                  <motion.div
                    key={activeState.id}
                    className="absolute inset-x-0 top-0"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <h3 className="flex items-center gap-3 font-display text-[13px] uppercase tracking-[0.22em] text-bone-100">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-heat-500"
                        style={{ boxShadow: '0 0 10px 2px rgba(255,138,61,0.7)' }}
                      />
                      {activeState.label}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-bone-300">
                      {activeState.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* The five states, highlighted from the dial's own state */}
          <ol className="relative hidden lg:block">
            {/* Spine the markers sit on */}
            <span
              aria-hidden
              className="absolute bottom-4 left-[7px] top-4 w-px bg-white/10"
            />
            {CONTROL.states.map((s) => {
              const active = dialState === s.id;
              return (
                <li key={s.id} className="relative pb-9 pl-9 last:pb-0">
                  {/* Marker. Scale/glow rather than a colour swap alone, the
                      active row has to be findable at a glance from across
                      the column. */}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border"
                    initial={false}
                    animate={{
                      scale: active ? 1 : 0.7,
                      borderColor: active
                        ? 'rgba(255,176,97,0.9)'
                        : 'rgba(255,255,255,0.18)',
                      backgroundColor: active ? '#ff8a3d' : 'rgba(10,10,10,1)',
                      boxShadow: active
                        ? '0 0 16px 3px rgba(255,138,61,0.45)'
                        : '0 0 0 0 rgba(255,138,61,0)',
                    }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                  <motion.div
                    initial={false}
                    animate={{ opacity: active ? 1 : 0.42 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <h3 className="font-display text-[13px] uppercase tracking-[0.22em] text-bone-100">
                      {s.label}
                      {active ? (
                        <span className="ml-3 align-middle text-[10px] tracking-[0.2em] text-heat-400">
                          NOW
                        </span>
                      ) : null}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-bone-300">
                      {s.body}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
