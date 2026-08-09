'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { RevealText } from '@/components/ui/RevealText';
import CounterNumber from '@/components/ui/CounterNumber';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { COMPARISON, VERDICT } from './data';

const EASE = [0.16, 1, 0.3, 1];

/**
 * "Electric vs Traditional Wood Hamam" — the comparison ledger that follows
 * the seven reasons.
 *
 * The seven reasons argue the electric case on its own terms. This section
 * answers the question that immediately follows it: *compared to what?* So it
 * is deliberately a table, not another card grid — a reader deciding between
 * two systems wants the same criterion answered twice, side by side, on one
 * baseline. Anything that separates the two answers (tabs, a toggle, a
 * before/after wipe) turns a comparison into two lists the reader has to hold
 * in their head.
 *
 * Structure:
 *  - One row element per criterion, one markup path for every viewport. At
 *    `lg` the row is `wood | criterion | electric` across three columns; below
 *    it the criterion moves above its own pair and the two values sit side by
 *    side. Only `grid-template-areas` changes — no duplicated DOM, so the
 *    whole table is one crawlable document order at every width.
 *  - The two columns are tinted, not boxed: ash for wood, a warm heat wash for
 *    electric, with zero vertical gap so the cells read as two continuous
 *    columns rather than sixteen cards.
 *  - The centre column is a fixed 232px at `lg`, which is what lets the two
 *    hairline spines be positioned at `calc(50% ± 116px)` and drawn downward
 *    on scroll. That is the section's only scroll-linked effect.
 *
 * Rows reveal individually on `whileInView` so the cascade follows the reader
 * down the table instead of firing all eight at once, and everything degrades
 * to static markup under `prefers-reduced-motion`.
 */

const CSS = `
  .evw { font-family: var(--font-body), system-ui, sans-serif; }

  /* globals.css forces Cormorant on h1-h6 and line-height 1.75 on every
     span/div/li outside any cascade layer, so re-assert locally. */
  .evw-display,
  .evw h2, .evw h2 span,
  .evw h3 {
    font-family: var(--font-heading), 'Arial Narrow', sans-serif;
    font-weight: 400;
    letter-spacing: 0.015em;
  }
  .evw h2, .evw h2 span { font-size: clamp(2.3rem, 5vw, 4.1rem); line-height: 0.94; }
  .evw h3 { font-size: clamp(1.05rem, 1.5vw, 1.35rem); line-height: 1.05; }
  .evw p { line-height: 1.7; }

  /* Small-caps label used for the criterion and the verdict captions.
     Its line-height has to live here: Tailwind's leading-* utilities are
     inside a cascade layer, and the unlayered "span { line-height: 1.75 }"
     in globals.css beats every layered utility regardless of specificity.
     (No backticks in this string — it is a template literal.) */
  .evw-label { line-height: 1.45; }

  .evw-val {
    font-family: var(--font-heading), 'Arial Narrow', sans-serif;
    font-weight: 400;
    font-size: clamp(1.3rem, 2vw, 1.85rem);
    line-height: 1;
    letter-spacing: 0.012em;
  }

  /* ── Table frame ───────────────────────────────────────────────────── */
  .evw-table {
    position: relative;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255,255,255,0.012);
  }

  /* ── Row grid ──────────────────────────────────────────────────────────
     One markup path, three arrangements:
       base : criterion, then wood, then electric, stacked. A ~360px phone
              cannot carry two columns of body copy without shredding it.
       sm   : criterion above its pair, the two values side by side.
       lg   : wood | criterion | electric on one line. The centre track is a
              fixed 232px, which is what lets the spines sit at 50% ± 116px. */
  .evw-row,
  .evw-head {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      'label'
      'wood'
      'elec';
  }
  @media (min-width: 640px) {
    .evw-row,
    .evw-head {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'label label'
        'wood  elec';
    }
  }
  @media (min-width: 1024px) {
    .evw-row,
    .evw-head {
      grid-template-columns: 1fr 232px 1fr;
      grid-template-areas: 'wood label elec';
    }
  }

  .evw-cell-wood  { grid-area: wood; }
  .evw-cell-elec  { grid-area: elec; }
  .evw-cell-label { grid-area: label; }

  /* Column tints. Flat, and with no vertical gap between rows, so the eye
     joins the cells into two continuous columns rather than sixteen cards.
     (A per-cell vertical gradient would band at every row boundary.) */
  .evw-cell-wood { background: rgba(255,255,255,0.017); }
  .evw-cell-elec { background: rgba(255,138,61,0.05); }

  /* Hairlines. The rule that separates the two answers follows the layout:
     horizontal while they are stacked, vertical once they sit side by side,
     and absent at lg where the scroll-drawn spines take over. */
  .evw-cell-elec { border-top: 1px solid rgba(255,255,255,0.05); }
  @media (min-width: 640px) {
    .evw-cell-elec {
      border-top: 0;
      border-left: 1px solid rgba(255,255,255,0.07);
    }
  }

  /* Row separator: carried by the criterion until the row is a single line,
     at which point all three cells share one continuous rule. */
  .evw-row .evw-cell-label { border-top: 1px solid rgba(255,255,255,0.09); }
  @media (min-width: 1024px) {
    .evw-cell-elec { border-left: 0; }
    .evw-row .evw-cell-wood,
    .evw-row .evw-cell-elec,
    .evw-row .evw-cell-label {
      border-top: 1px solid rgba(255,255,255,0.07);
    }
  }

  /* ── Spines ────────────────────────────────────────────────────────────
     Two hairlines flanking the centre column, drawn top-down on scroll.
     Only meaningful once the three-column layout exists. */
  .evw-spine { display: none; }
  @media (min-width: 1024px) {
    .evw-spine {
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      pointer-events: none;
      transform-origin: top center;
    }
    .evw-spine-l {
      left: calc(50% - 116px);
      background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06));
    }
    .evw-spine-r {
      left: calc(50% + 116px);
      background: linear-gradient(180deg, rgba(255,138,61,0.55), rgba(255,138,61,0.14));
    }
  }

  /* ── Row state ─────────────────────────────────────────────────────────
     Hover is an enhancement only: every row is fully legible at rest, so
     touch devices lose nothing by having no hover. */
  .evw-row .evw-cell-wood,
  .evw-row .evw-cell-elec { transition: background-color 0.4s ease; }
  .evw-row .evw-val,
  .evw-row .evw-note { transition: color 0.4s ease; }

  @media (hover: hover) and (pointer: fine) {
    .evw-row:hover .evw-cell-elec { background-color: rgba(255,138,61,0.055); }
    .evw-row:hover .evw-cell-wood { background-color: rgba(255,255,255,0.028); }
    .evw-row:hover .evw-cell-wood .evw-note { color: rgba(207,199,189,0.62); }
  }

  /* Markers. Deliberately quiet — the tick is a reading aid, not a badge. */
  .evw-mark {
    flex: none;
    width: 15px; height: 15px;
    border-radius: 999px;
    display: grid; place-items: center;
    margin-top: 0.15em;
  }
  .evw-mark-wood {
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(140,133,125,0.9);
  }
  .evw-mark-elec {
    border: 1px solid rgba(255,138,61,0.42);
    background: rgba(255,138,61,0.12);
    color: #ffb061;
  }

  /* ── Verdict strip ─────────────────────────────────────────────────────
     CounterNumber renders its digits in a nested <span>, and globals.css
     sets "span { line-height: 1.75 }" unlayered — which targets that inner
     span directly and beats the class on its parent. The counted figures
     would then stand in a taller box than the static "Zero" beside them and
     push their labels out of line, so pin the line-height on descendants too
     (element+class outranks the bare element selector). With line-height 1
     on both, every value box is exactly 1em tall and the four labels below
     them share a baseline. */
  .evw-verdict-value,
  .evw-verdict-value span {
    font-family: var(--font-heading), 'Arial Narrow', sans-serif;
    font-weight: 400;
    font-size: inherit;
    line-height: 1;
    letter-spacing: 0.01em;
    font-variant-numeric: tabular-nums;
  }
  .evw-verdict-value {
    display: block;
    font-size: clamp(2.25rem, 4.2vw, 3.4rem);
    /* "25 yr" must never break across two lines — that would make one column
       taller than the other three. */
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .evw-row .evw-cell-wood,
    .evw-row .evw-cell-elec,
    .evw-row .evw-val,
    .evw-row .evw-note { transition: none; }
  }
`;

const TickIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="9" height="9" aria-hidden="true" {...props}>
    <path
      d="M4 12.5 9.5 18 20 6.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="9" height="9" aria-hidden="true" {...props}>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const FlameIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" {...props}>
    <path
      d="M12 3s4.5 3.8 4.5 8.2A4.5 4.5 0 0 1 12 15.7a4.5 4.5 0 0 1-4.5-4.5C7.5 6.8 12 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M8.2 14.4A6.4 6.4 0 0 0 12 21a6.4 6.4 0 0 0 3.8-6.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const BoltIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true" {...props}>
    <path
      d="M13.2 2.5 5 13.4h5.6L9.8 21.5 18.5 10h-6l.7-7.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

/** One criterion, answered twice. */
function Row({ item, reduce }) {
  return (
    <motion.div
      className="evw-row"
      role="row"
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      {/* Criterion. Above the pair on narrow screens, between them at lg. */}
      <div
        role="rowheader"
        className="evw-cell-label flex items-center justify-start px-5 pb-1 pt-7 lg:justify-center lg:px-6 lg:py-8 lg:text-center"
      >
        <span className="evw-label text-[10px] uppercase tracking-[0.2em] text-bone-500 lg:text-[10.5px]">
          {item.label}
        </span>
      </div>

      {/* Traditional wood-fired. */}
      <div role="cell" className="evw-cell-wood px-5 py-7 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex gap-2.5">
          <span className="evw-mark evw-mark-wood">
            <DashIcon />
          </span>
          <div className="min-w-0">
            <span className="evw-val block text-bone-300/85">{item.wood.value}</span>
            <p className="evw-note mt-2.5 max-w-[34ch] text-[13px] text-bone-500 sm:text-[13.5px]">
              {item.wood.note}
            </p>
          </div>
        </div>
      </div>

      {/* Electric. */}
      <div role="cell" className="evw-cell-elec px-5 py-7 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex gap-2.5">
          <span className="evw-mark evw-mark-elec">
            <TickIcon />
          </span>
          <div className="min-w-0">
            <span className="evw-val block text-heat-300">{item.electric.value}</span>
            <p className="evw-note mt-2.5 max-w-[34ch] text-[13px] text-bone-300/75 sm:text-[13.5px]">
              {item.electric.note}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ElectricVsWood() {
  const reduce = useReducedMotion();
  const tableRef = useRef(null);

  /* The spines draw from the top of the table to its bottom as it passes
     through the viewport. Springed so a flicked scroll doesn't snap them. */
  const { scrollYProgress } = useScroll({
    target: tableRef,
    offset: ['start 0.85', 'end 0.35'],
  });
  const draw = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="electric-vs-wood"
      data-section="electric-vs-wood"
      className="evw relative overflow-hidden bg-ink-950 py-24 md:py-32"
    >
      <style>{CSS}</style>

      {/* Hairline seam from the section above. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,138,61,0.28), transparent)',
        }}
      />

      {/* Ambient wash, painted once — warm on the right where the electric
          column lives, neutral on the left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(52vw 44vh at 88% 22%, rgba(255,138,61,0.07), transparent 64%), radial-gradient(46vw 40vh at 4% 82%, rgba(255,255,255,0.028), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10">
        {/* ── Heading ───────────────────────────────────────────────── */}
        <div className="max-w-[54ch]">
          <motion.div
            className="flex items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="h-px w-8 bg-heat-500/60" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-bone-500">
              Electric vs Wood-Fired
            </span>
          </motion.div>

          <h2 className="mt-5 text-balance">
            <RevealText as="span" className="block text-bone-100">
              The Same Ritual.
            </RevealText>
            <RevealText as="span" delay={0.1} className="block text-heat-500">
              None of the Smoke.
            </RevealText>
          </h2>

          <motion.p
            className="mt-6 max-w-[52ch] text-[15px] text-bone-300/70 sm:text-base"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            A Kashmiri hamam warms the floor either way. What changes is what it
            asks of you — in hours, firewood, air quality and upkeep. Here is the
            same question answered twice, line by line.
          </motion.p>
        </div>

        {/* ── Ledger ────────────────────────────────────────────────── */}
        <div className="relative mt-14 md:mt-16">
          {/* Glow behind the electric column. Sits outside the clipped table
              frame so it can bleed past the edge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-6 right-[-4%] hidden lg:block"
            style={{
              left: 'calc(50% + 116px)',
              background:
                'radial-gradient(58% 52% at 42% 42%, rgba(255,138,61,0.16), transparent 72%)',
              filter: 'blur(34px)',
            }}
          />

          <div ref={tableRef} className="evw-table" role="table" aria-label="Electric hamam compared with a traditional wood-fired hamam">
            {/* Spines. Scaled from 0 as the table scrolls through. */}
            <motion.span
              aria-hidden="true"
              className="evw-spine evw-spine-l"
              style={reduce ? undefined : { scaleY: draw }}
            />
            <motion.span
              aria-hidden="true"
              className="evw-spine evw-spine-r"
              style={reduce ? undefined : { scaleY: draw }}
            />

            {/* ── Column headers ──────────────────────────────────── */}
            <div className="evw-head" role="row">
              <div
                role="columnheader"
                className="evw-cell-label hidden lg:flex lg:items-center lg:justify-center lg:px-6 lg:py-8"
              >
                <span
                  className="evw-display text-[13px] uppercase tracking-[0.22em] text-bone-500"
                  aria-hidden="true"
                >
                  vs
                </span>
              </div>

              <div
                role="columnheader"
                className="evw-cell-wood px-5 py-7 sm:px-6 lg:px-8 lg:py-9"
              >
                <span className="inline-flex items-center gap-2 text-bone-500">
                  <FlameIcon />
                  <span className="text-[10px] uppercase tracking-[0.22em]">
                    The old way
                  </span>
                </span>
                <h3 className="mt-3 text-bone-300">Traditional Wood Hamam</h3>
                <p className="mt-2 text-[13px] text-bone-500">
                  Furnace, flue and firewood.
                </p>
              </div>

              <div
                role="columnheader"
                className="evw-cell-elec relative px-5 py-7 sm:px-6 lg:px-8 lg:py-9"
              >
                <span className="inline-flex items-center gap-2 text-heat-400">
                  <BoltIcon />
                  <span className="text-[10px] uppercase tracking-[0.22em]">
                    What we install
                  </span>
                </span>
                <h3 className="mt-3 text-bone-100">Electric Hamam</h3>
                <p className="mt-2 text-[13px] text-bone-300/70">
                  Cable, thermostat and a warm floor.
                </p>
              </div>
            </div>

            {/* ── Rows ────────────────────────────────────────────── */}
            {COMPARISON.map((item) => (
              <Row key={item.id} item={item} reduce={reduce} />
            ))}
          </div>
        </div>

        {/* ── Verdict ───────────────────────────────────────────────── */}
        <div className="mt-16 md:mt-20">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {VERDICT.map((v, i) => (
              <motion.div
                key={v.label}
                className="border-t border-white/10 pt-5"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
              >
                {typeof v.count === 'number' ? (
                  <CounterNumber
                    value={v.count}
                    suffix={v.suffix}
                    duration={1.7}
                    className="evw-verdict-value block text-heat-500"
                  />
                ) : (
                  <span className="evw-verdict-value block text-heat-500">
                    {v.value}
                  </span>
                )}
                <span className="evw-label mt-3 block text-[11px] uppercase tracking-[0.18em] text-bone-500">
                  {v.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center md:justify-between"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="max-w-[46ch] text-[15px] text-bone-300/70">
              Replacing a wood hamam, or building one from scratch? We survey the
              space free of charge and tell you exactly what it takes.
            </p>
            <HeroCTAs className="shrink-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
