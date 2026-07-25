'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import GlowCard from '@/components/ui/GlowCard';
import { Reveal } from '@/components/ui/RevealText';

/** Three.js has no server runtime, and it's ~150kB before our own scene code. */
const PlaceholderSceneCanvas = dynamic(
  () => import('@/components/3d/PlaceholderSceneCanvas'),
  { ssr: false, loading: () => null }
);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * End-to-end check for the animation foundation. Not a real page section 
 * delete once the actual sections are built.
 *
 * Exercises, in order: a raw GSAP ScrollTrigger scrub (the layer everything
 * scroll-driven sits on), the R3F pipeline behind a dynamic import, and the
 * Framer Motion primitives.
 */
export default function FoundationCheckClient() {
  const gsapRowRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = gsapRowRef.current;
    if (!el) return undefined;

    const items = el.querySelectorAll('[data-gsap-item]');

    // Reduced motion still gets the end state, just placed, not travelled.
    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 64 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);

    // gsap.context().revert() kills the tweens AND their ScrollTriggers, and
    // restores inline styles, the correct teardown under React strict mode's
    // double-invoked effects.
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div className="px-6 pb-40 pt-32 md:px-16 lg:px-24">
      <p className="exp-eyebrow">Foundation check</p>
      <h1 className="exp-h2 mt-6 max-w-[18ch]">
        Every animation layer, proven end to end.
      </h1>

      {/* ── 1. GSAP + ScrollTrigger, scrubbed against Lenis ── */}
      <section className="mt-32">
        <h2 className="text-sm uppercase tracking-[0.25em] text-bone-500">
          01, GSAP ScrollTrigger (scrubbed)
        </h2>
        <div ref={gsapRowRef} className="mt-10 grid gap-4 sm:grid-cols-3">
          {['Registered client-side', 'Scrubbed to Lenis', 'Refreshes on resize'].map(
            (label) => (
              <div
                key={label}
                data-gsap-item
                className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-bone-100"
              >
                {label}
              </div>
            )
          )}
        </div>
      </section>

      {/* ── 2. React Three Fiber pipeline ── */}
      <section className="mt-32">
        <h2 className="text-sm uppercase tracking-[0.25em] text-bone-500">
          02, React Three Fiber (lazy, ssr:false)
        </h2>
        <div className="mt-10 h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <PlaceholderSceneCanvas />
        </div>
      </section>

      {/* ── 3. Framer Motion primitives ── */}
      <section className="mt-32">
        <h2 className="text-sm uppercase tracking-[0.25em] text-bone-500">
          03, Framer Motion primitives
        </h2>
        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton size="lg">Magnetic button</MagneticButton>
            <MagneticButton variant="outline" size="lg">
              Outline variant
            </MagneticButton>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <GlowCard className="p-9">
            <h3 className="text-2xl">GlowCard</h3>
            <p className="mt-3 text-[15px] text-bone-500">
              Lifts on hover; the border lights where the cursor is.
            </p>
          </GlowCard>
          <GlowCard className="p-9">
            <h3 className="text-2xl">Reveal</h3>
            <p className="mt-3 text-[15px] text-bone-500">
              whileInView entrance, disabled under reduced motion.
            </p>
          </GlowCard>
        </div>
      </section>
    </div>
  );
}
