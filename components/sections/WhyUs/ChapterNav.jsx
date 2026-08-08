'use client';

import { Reveal } from '@/components/ui/RevealText';
import { CHAPTERS } from './data';

/**
 * The three-chapter jump bar under the hero.
 *
 * It does two jobs. For a reader it declares up front that this is a long page
 * with a shape, which is what stops a merged page from feeling like three pages
 * stapled together. For search it gives the three anchors named targets, and
 * those anchors are also where the retired /local-experience and
 * /global-experience URLs redirect to, so an inbound link to either lands on
 * the movement it was about.
 *
 * Deliberately not sticky: the site header is already fixed, and a second
 * persistent bar under it costs more vertical space on a phone than the
 * convenience is worth.
 */
export default function ChapterNav() {
  return (
    <nav
      aria-label="On this page"
      className="relative border-y border-white/10 bg-ink-950"
    >
      <Reveal>
        <ol className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="group flex items-baseline gap-4 py-6 transition-colors duration-300 sm:justify-center sm:py-7"
              >
                <span className="text-[10px] tracking-[0.28em] text-heat-500/70">
                  {c.num}
                </span>
                <span className="font-serif text-[clamp(1.1rem,2.4vw,1.5rem)] leading-none tracking-wide text-bone-300 transition-colors duration-300 group-hover:text-heat-300">
                  {c.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Reveal>
    </nav>
  );
}
