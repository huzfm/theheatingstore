'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { ORIGIN } from './data';

/**
 * ogl is a WebGL library with no server runtime, and it is dead weight on a
 * section the visitor has to scroll past the hero to reach, so the gallery is
 * both lazy and ssr:false. Same call StoryRail makes for its three.js scene.
 */
const CircularGallery = dynamic(() => import('@/components/ui/CircularGallery/CircularGallery'), {
  ssr: false,
  loading: () => null,
});

/** The gallery draws { image, text }; our data is authored as { src, label }. */
const ITEMS = ORIGIN.gallery.map((it) => ({ image: it.src, text: it.label }));

/**
 * Resolves the display face into a canvas 2D font string.
 *
 * The gallery rasterises its labels into a texture with the Canvas 2D API,
 * which needs a family name that is actually loaded. next/font hashes the
 * family (there is no literal "Bebas Neue" registered), so the name has to be
 * read back off the document at runtime rather than hard-coded. Falls back to
 * the stack in globals.css until it resolves.
 */
function useDisplayFont(size = 34) {
  const [family, setFamily] = useState("'Arial Narrow', sans-serif");

  useEffect(() => {
    const resolved = getComputedStyle(document.body).getPropertyValue('--font-heading').trim();
    if (resolved) setFamily(resolved);
  }, []);

  return useMemo(() => `${size}px ${family}`, [size, family]);
}

/**
 * Our Origin, as a circular gallery.
 *
 * The narrative copy sits above the ring rather than beside it: the gallery is
 * full-bleed and drag-driven, and a two-column split would have squeezed the
 * cards to the point where the bend stopped reading.
 *
 * The canvas is opaque to assistive tech, so the same eight items are also
 * rendered as a screen-reader-only list. That list is the accessible copy of
 * the section, not a decoration, do not drop it if the layout changes.
 */
export default function OriginGallery() {
  const reduce = useReducedMotion();
  const font = useDisplayFont();

  const header = (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal>
        <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
          <span className="h-px w-8 bg-heat-500/60" />
          {ORIGIN.eyebrow}
        </span>
      </Reveal>

      <RevealText
        as="h2"
        className="mt-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
      >
        {ORIGIN.title}
      </RevealText>

      <div className="mt-7 grid gap-5 lg:grid-cols-2 lg:gap-12">
        {ORIGIN.paragraphs.map((p, i) => (
          <Reveal key={i} delay={0.1 + i * 0.08}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300">{p}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );

  /* ── Reduced motion ───────────────────────────────────────────────
     No WebGL and no inertia. The same eight items as an ordinary
     scroll-snap strip, which keeps the content and the scroll affordance
     while dropping every bit of the motion.                            */
  if (reduce) {
    return (
      <section className="relative bg-ink-950 py-24 text-bone-100 sm:py-32">
        {header}

        <ul className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8">
          {ORIGIN.gallery.map((it) => (
            <li key={it.id} className="w-[260px] shrink-0 snap-center sm:w-[300px]">
              <div className="overflow-hidden rounded-[20px] border border-white/10">
                <img
                  src={it.src}
                  alt={it.label}
                  className="h-[340px] w-full object-cover sm:h-[400px]"
                />
              </div>
              <p className="mt-4 font-serif text-lg text-bone-100">{it.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-bone-300">{it.caption}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      data-section="origin-gallery"
      className="relative overflow-hidden bg-ink-950 py-24 text-bone-100 sm:py-32"
    >
      {/* Ambient wash, matching the other About sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60vw 45vh at 50% 20%, rgba(255,138,61,0.07), transparent 65%)',
        }}
      />

      <div className="relative">
        {header}

        <div className="mt-14 h-[clamp(400px,58vh,620px)] sm:mt-16">
          <CircularGallery
            items={ITEMS}
            bend={1}
            textColor="#f5f1ec"
            borderRadius={0.05}
            font={font}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>

        {/* The canvas has no accessible content of its own. */}
        <ul className="sr-only">
          {ORIGIN.gallery.map((it) => (
            <li key={it.id}>
              {it.label}. {it.caption}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-bone-500">
            Drag, scroll or use the arrow keys
          </p>
        </div>
      </div>
    </section>
  );
}
