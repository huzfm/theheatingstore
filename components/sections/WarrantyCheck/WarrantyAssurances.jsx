'use client';

import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { ASSURANCES } from './data';

/**
 * Thin band between the hero and the lookup: what the search actually returns,
 * so the reader knows what they are about to get before they type. Kept to
 * three numbered lines rather than cards, the page's weight belongs to the
 * lookup underneath it.
 */
export default function WarrantyAssurances() {
  return (
    <section className="relative bg-ink-950 px-5 pb-4 pt-2 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <RevealGroup
          className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3"
          stagger={0.08}
        >
          {ASSURANCES.map((a, i) => (
            <RevealItem key={a.title} className="h-full">
              <div className="h-full bg-ink-950 p-6 sm:p-7">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* h3, not h2, and not because of the outline. globals.css
                    sets a font-size on every h1-h6 outside any cascade layer,
                    and unlayered CSS beats every Tailwind utility whatever its
                    specificity, so the tag chosen here is what decides the
                    size: an h2 renders these card titles at 56px. h3 is what
                    every other card heading on the site uses, for the same
                    reason. */}
                <h3 className="mt-4 font-serif text-lg leading-tight tracking-wide text-bone-100">
                  {a.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-bone-300">{a.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
