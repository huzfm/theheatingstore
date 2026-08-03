'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowUpRight,
  LayoutGrid,
  Ruler,
  ShieldCheck,
  Thermometer,
  Wrench,
} from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { STAGES } from './data';

const ICONS = {
  ruler: Ruler,
  layout: LayoutGrid,
  wrench: Wrench,
  thermometer: Thermometer,
  shield: ShieldCheck,
};

/**
 * The page's set piece: five stages as one continuous rail.
 *
 * This replaces an auto-advancing carousel. A carousel was the wrong form for
 * this content twice over, it hid four fifths of the answer behind a timer,
 * and a sequence whose whole point is "these happen in order" was being shown
 * as five interchangeable slides. A rail is the sequence.
 *
 * Desktop: a sticky index on the left tracks which stage is in the middle of
 * the viewport, with a heat-filled progress line. Below lg the index collapses
 * and each stage carries its own number, no sticky element is worth 40% of a
 * phone screen.
 *
 * The active stage is reported up by each Stage's own useInView with a
 * -45%/-45% margin, i.e. "the stage crossing the centre line", rather than a
 * scroll listener doing arithmetic on five bounding boxes every frame.
 *
 * Stages enter alternately from the left and the right over a blur-fade, the
 * same entrance vocabulary as the home page's seven reasons, so the sequence
 * rocks as it is read rather than marching straight up.
 */

/* Entrance travel for the alternating reveal, carried from
   components/sections/WhyElectricHamam. The wide value across a ~320px column
   reads as a lurch rather than a drift, hence the much shorter phone value.
   The section clips on x, so neither can induce page scroll. */
const SLIDE_WIDE = 220;
const SLIDE_NARROW = 62;

export default function ProcessRail() {
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const railRef = useRef(null);
  const reduce = useReducedMotion();

  /* Read in an effect rather than during render so the server and the first
     client pass agree. The section sits below the fold, so no stage has
     revealed by the time this lands. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Progress line: fills between the first stage entering the centre and the
  // last one leaving it, so it tracks reading position, not raw page scroll.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start center', 'end center'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const jumpTo = useCallback((num) => {
    document
      .getElementById(`stage-${num}`)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }, [reduce]);

  return (
    /* overflow-x-clip, not overflow-hidden: the stages travel sideways on
       entry and must not widen the page, but `overflow: hidden` would make
       this section a scroll container and break the sticky index inside it.
       `clip` clips without creating one. */
    <section className="relative overflow-x-clip bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.06), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section head */}
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              The five stages
            </span>
          </Reveal>
          {/* Two-line reveal with the second line in heat, the same treatment
              as the home page's "7 Reasons to Install / Electric Hamam This
              Winter". Split across two RevealTexts rather than one so the
              second line can carry its own delay and colour, which is what
              makes the pair read as one gesture instead of a long single
              stagger, and what stops the line break falling wherever the
              viewport happens to put it on a phone.

              [&_span]:leading-[inherit] is load-bearing. RevealText wraps every
              word in a <span>, and globals.css sets `line-height: 1.75` on the
              bare `span` element selector, which beats an inherited value. On
              desktop the heading is one line and nothing shows; on a phone it
              wraps to three and the gaps open right up. */}
          <h2 className="mt-7 max-w-[16ch] text-balance">
            <RevealText
              as="span"
              className="block font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              Nothing here happens
            </RevealText>
            <RevealText
              as="span"
              delay={0.1}
              className="block font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-heat-500 [&_span]:leading-[inherit]"
            >
              out of order.
            </RevealText>
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-300">
              Each stage ends in something you can hold: a measurement, a
              drawing, a price, a tested floor, a warranty.
            </p>
          </Reveal>
        </div>

        <div
          ref={railRef}
          className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[240px_1fr] lg:gap-16"
        >
          {/* ── Sticky index, desktop only ── */}
          <nav
            aria-label="Process stages"
            className="hidden lg:block"
          >
            <div className="sticky top-28">
              <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.28em] text-bone-500">
                Stage {String(active + 1).padStart(2, '0')} of{' '}
                {String(STAGES.length).padStart(2, '0')}
              </p>

              <div className="relative pl-6">
                {/* Track + heat fill */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-px bg-white/10"
                />
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-px origin-top bg-gradient-to-b from-heat-400 to-heat-600"
                  style={{ scaleY: reduce ? 1 : fill }}
                />

                <ul className="space-y-5">
                  {STAGES.map((s, i) => {
                    const on = i === active;
                    return (
                      <li key={s.num} className="relative">
                        {/* Node on the track */}
                        <span
                          aria-hidden
                          className="absolute -left-6 top-2 h-1.5 w-1.5 -translate-x-[3px] rounded-full transition-all duration-500"
                          style={{
                            background: on ? '#ff8a3d' : '#3a3733',
                            boxShadow: on
                              ? '0 0 0 4px rgba(255,138,61,0.15), 0 0 12px 2px rgba(255,138,61,0.5)'
                              : 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => jumpTo(s.num)}
                          aria-current={on ? 'step' : undefined}
                          className="group block w-full text-left"
                        >
                          <span
                            className={`block text-[10px] tracking-[0.24em] transition-colors duration-300 ${
                              on ? 'text-heat-500' : 'text-bone-500/60'
                            }`}
                          >
                            {s.num}
                          </span>
                          <span
                            className={`mt-1 block font-serif text-lg leading-tight tracking-wide transition-colors duration-300 ${
                              on
                                ? 'text-bone-100'
                                : 'text-bone-500 group-hover:text-bone-300'
                            }`}
                          >
                            {s.tag}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>

          {/* ── Stages ── */}
          <div className="space-y-6 sm:space-y-8">
            {STAGES.map((s, i) => (
              <Stage
                key={s.num}
                stage={s}
                index={i}
                onActive={setActive}
                reduce={reduce}
                narrow={narrow}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ stage, index, onActive, reduce, narrow }) {
  const ref = useRef(null);
  const Icon = ICONS[stage.icon] ?? Ruler;

  /* Stages 01, 03, 05 (even indices) enter from the left, 02 and 04 from the
     right, so the column rocks as it is read. */
  const direction = index % 2 === 0 ? -1 : 1;
  const offset = (narrow ? SLIDE_NARROW : SLIDE_WIDE) * direction;

  // "In the middle band of the viewport". Reports on every crossing (once:
  // false) because the index has to follow scrolling back up too. The report
  // is an effect, not a render-time call: setting the parent's state while
  // this child renders is exactly the pattern React warns about.
  const centred = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (centred) onActive(index);
  }, [centred, index, onActive]);

  return (
    <motion.article
      ref={ref}
      id={`stage-${stage.num}`}
      /* `amount: 0.3` keys the reveal to each stage individually, so stage 04
         waits until stage 04 is itself approaching the viewport rather than
         firing with the rest of the column. `once` keeps it from replaying on
         the way back up. */
      initial={reduce ? false : { opacity: 0, x: offset, filter: 'blur(6px)' }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      // scroll-mt clears the fixed site header when the index jumps here.
      className="relative isolate scroll-mt-28 overflow-hidden rounded-[24px] border border-white/10 bg-ink-900/60 p-6 sm:rounded-[28px] sm:p-9 lg:p-11"
    >
      {/* Warm top-edge wash, strongest at the number */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(85% 100% at 0% 0%, rgba(255,138,61,0.10), transparent 58%)',
        }}
      />
      {/* Oversized ghost numeral, the stage's own watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-4 select-none font-serif text-[clamp(5rem,12vw,9rem)] leading-none text-white/[0.035] sm:right-8"
      >
        {stage.num}
      </span>

      {/* Head */}
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-heat-500/25 bg-heat-500/10 text-heat-400">
          <Icon size={19} strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-heat-400">
            Stage {stage.num} · {stage.tag}
          </p>
          <h3 className="mt-2 max-w-[24ch] font-serif text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.08] text-bone-100">
            {stage.title}
          </h3>
        </div>
      </div>

      {/* Body beside the stage's headline number */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
        <p className="max-w-2xl text-[15px] leading-relaxed text-bone-300">
          {stage.lead}
        </p>

        <div className="flex shrink-0 flex-row items-center gap-4 rounded-2xl border border-white/10 px-6 py-5 lg:w-[170px] lg:flex-col lg:items-start lg:gap-0 lg:text-left">
          <p className="font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] leading-none text-heat-400">
            {stage.metric.value}
          </p>
          <p className="max-w-[20ch] text-[12px] leading-snug text-bone-500 lg:mt-3">
            {stage.metric.label}
          </p>
        </div>
      </div>

      {/* Outcome / your part. The half people skip to. */}
      <dl className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 sm:gap-8">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
            What you end up with
          </dt>
          <dd className="mt-2.5 text-sm leading-relaxed text-bone-100">
            {stage.outcome}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
            What we need from you
          </dt>
          <dd className="mt-2.5 text-sm leading-relaxed text-bone-300">{stage.you}</dd>
        </div>
      </dl>

      {stage.link && (
        <Link
          href={stage.link.href}
          className="group mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
        >
          {stage.link.label}
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      )}
    </motion.article>
  );
}
