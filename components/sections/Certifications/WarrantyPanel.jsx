'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { WARRANTY } from './data';

/**
 * What the certification is worth once something actually fails, on the raised
 * heat-lit panel treatment used for the closing panels site-wide.
 *
 * Absorbs three separate blocks from the previous version: "Warranty &
 * Protection", "Global Track Record", and a full-width orange gradient
 * "Technical Support" card that was the only element on the site rendering
 * white text on a solid heat gradient, and looked like it came from a
 * different template.
 *
 * The link at the foot replaces the old partner-brands paragraph, whose four
 * anchors (#prowarm-pdf and friends) pointed at nothing on this page. The
 * documents are on /global-experience.
 */
export default function WarrantyPanel() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative isolate overflow-hidden rounded-[32px] border border-white/10 px-6 py-14 sm:px-10 sm:py-16 lg:px-14"
          style={{
            background:
              'radial-gradient(80% 120% at 50% 0%, rgba(255,138,61,0.18), transparent 60%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
          }}
        >
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {WARRANTY.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit]"
            >
              {WARRANTY.title}
            </RevealText>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-300">
                {WARRANTY.intro}
              </p>
            </Reveal>
          </div>

          <RevealGroup
            className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3"
            stagger={0.08}
          >
            {WARRANTY.points.map((p) => (
              <RevealItem key={p.title} className="h-full">
                <div className="h-full bg-ink-950/70 p-6 backdrop-blur-sm sm:p-7">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-none text-heat-400">
                      {p.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-bone-500">
                      {p.unit}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-lg leading-tight tracking-wide text-bone-100">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-bone-300">
                    {p.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Track record. Plain list, these are building types rather than
              claims that need their own cards. */}
          <Reveal delay={0.15}>
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-bone-500">
                Installed worldwide in
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2.5">
                {WARRANTY.record.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-bone-300"
                  >
                    {r}
                  </li>
                ))}
              </ul>

              <Link
                href="/global-experience"
                className="group mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
              >
                Manufacturer manuals and certificates
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
