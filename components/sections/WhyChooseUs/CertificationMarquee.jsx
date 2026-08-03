'use client';

import Link from 'next/link';
import { MARQUEE } from './data';

/**
 * Certification strip. A single-row marquee, duplicated once so the track can
 * translate a full copy-width and loop seamlessly; the duplicate is
 * aria-hidden so a screen reader hears the list once.
 *
 * The keyframe is local rather than in globals.css, since nothing else on the
 * site uses it, and it is disabled outright under prefers-reduced-motion, a
 * continuously moving band is exactly what that setting exists to stop.
 */
export default function CertificationMarquee() {
  return (
    <section
      aria-label="Certifications and standards"
      className="relative overflow-hidden border-y border-white/10 bg-ink-950 py-7"
    >
      <style>{`
        @keyframes wcu-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .wcu-track {
          display: flex;
          width: max-content;
          animation: wcu-marquee 42s linear infinite;
        }
        .wcu-marquee:hover .wcu-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .wcu-track { animation: none; }
          .wcu-marquee { overflow-x: auto; }
        }
      `}</style>

      {/* Edge fades, so items enter and leave rather than being cut off */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent"
      />

      <Link href="/certifications" className="wcu-marquee block">
        <div className="wcu-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center"
            >
              {MARQUEE.map((m) => (
                <li
                  key={m}
                  className="flex items-center whitespace-nowrap px-7 text-[12.5px] uppercase tracking-[0.18em] text-bone-500"
                >
                  <span
                    aria-hidden
                    className="mr-7 inline-block h-1 w-1 rounded-full bg-heat-500/70"
                  />
                  {m}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Link>
    </section>
  );
}
