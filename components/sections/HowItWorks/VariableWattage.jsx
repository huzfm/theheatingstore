'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Zap, ThermometerSun, Building2, ShieldCheck } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { VARIABLE_WATTAGE as V } from './data';

const KASHMIR_ICONS = [Zap, ThermometerSun, Building2];

/**
 * Variable Wattage Technology section — explains the self-regulating cable
 * technology. Sits between the process rail and the closing CTA on
 * /how-it-works.
 *
 * Follows the same dark cinematic grammar as ProcessRail and OnSiteTimeline:
 * ink-950 ground, bone text, heat accents, RevealText word-by-word entrances,
 * reduced-motion respected throughout.
 */
export default function VariableWattage() {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-32">
      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60vw 50vh at 30% 20%, rgba(255,138,61,0.06), transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {V.eyebrow}
            </span>
          </Reveal>

          <RevealText
            as="h2"
            className="mt-7 max-w-[20ch] font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {V.title}
          </RevealText>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-300">
              {V.sub}
            </p>
          </Reveal>
        </div>

        {/* ── How it works (principle) ── */}
        <Reveal delay={0.18}>
          <div className="mt-16 rounded-[24px] border border-white/10 bg-ink-900/60 p-6 sm:mt-20 sm:rounded-[28px] sm:p-9 lg:p-11">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-[28px]"
              style={{
                background:
                  'radial-gradient(85% 100% at 0% 0%, rgba(255,138,61,0.08), transparent 58%)',
              }}
            />
            <h3 className="font-serif text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.08] text-bone-100">
              {V.principle.title}
            </h3>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-bone-300">
              {V.principle.body}
            </p>
          </div>
        </Reveal>

        {/* ── Output curve table ── */}
        <Reveal delay={0.15}>
          <div className="mt-12 sm:mt-16">
            <h3 className="font-serif text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.08] text-bone-100">
              {V.outputCurve.title}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-bone-300">
              {V.outputCurve.intro}
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/10 bg-ink-900/80">
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
                      Floor temperature
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
                      Condition
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {V.outputCurve.rows.map((row) => (
                    <tr
                      key={row.temp}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-3.5 font-serif text-[clamp(1rem,2vw,1.2rem)] text-bone-100">
                        {row.temp}
                      </td>
                      <td className="px-5 py-3.5 text-bone-400">
                        {row.desc}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-heat-400">
                        {row.output}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-bone-500">
              {V.outputCurve.note}
            </p>
          </div>
        </Reveal>

        {/* ── Why it matters in Kashmir ── */}
        <Reveal delay={0.1}>
          <div className="mt-16 sm:mt-20">
            <RevealText
              as="h3"
              className="max-w-[20ch] font-serif text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.08] text-bone-100 [&_span]:leading-[inherit]"
            >
              Why this matters in Kashmir
            </RevealText>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {V.kashmir.map((item, i) => {
                const Icon = KASHMIR_ICONS[i];
                return (
                  <motion.div
                    key={item.title}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={
                      reduce ? undefined : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.85,
                      delay: i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-2xl border border-white/10 bg-ink-900/50 p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-heat-500/25 bg-heat-500/10 text-heat-400">
                      <Icon size={18} strokeWidth={1.5} aria-hidden />
                    </span>
                    <h4 className="mt-4 font-serif text-[clamp(1.1rem,2vw,1.4rem)] leading-tight text-bone-100">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-[14px] leading-relaxed text-bone-400">
                      {item.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ── Comparison table ── */}
        <Reveal delay={0.12}>
          <div className="mt-16 sm:mt-20">
            <h3 className="font-serif text-[clamp(1.45rem,3vw,2.25rem)] leading-[1.08] text-bone-100">
              {V.comparison.title}
            </h3>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/10 bg-ink-900/80">
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
                      Property
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
                      Fixed-output
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                      Variable wattage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {V.comparison.rows.map((row) => (
                    <tr
                      key={row.property}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-3.5 text-bone-300">
                        {row.property}
                      </td>
                      <td className="px-5 py-3.5 text-bone-500">
                        {row.fixed}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-heat-400">
                        {row.variable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* ── Availability / brands ── */}
        <Reveal delay={0.15}>
          <div className="mt-16 flex items-start gap-4 rounded-2xl border border-heat-500/20 bg-heat-500/5 p-6 sm:mt-20 sm:p-8">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-heat-500/25 bg-heat-500/10 text-heat-400">
              <ShieldCheck size={19} strokeWidth={1.5} aria-hidden />
            </span>
            <div>
              <h4 className="font-serif text-[clamp(1.2rem,2.5vw,1.6rem)] leading-tight text-bone-100">
                {V.brands.title}
              </h4>
              <p className="mt-3 text-[15px] leading-relaxed text-bone-300">
                {V.brands.body}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
