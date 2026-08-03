'use client';

import WhyChooseUsHero from '@/components/sections/WhyChooseUs/WhyChooseUsHero';
import ProofStats from '@/components/sections/WhyChooseUs/ProofStats';
import Reliability from '@/components/sections/WhyChooseUs/Reliability';
import WhatYouGet from '@/components/sections/WhyChooseUs/WhatYouGet';
import Testimonials from '@/components/sections/WhyChooseUs/Testimonials';
import CertificationMarquee from '@/components/sections/WhyChooseUs/CertificationMarquee';
import WhyChooseUsCTA from '@/components/sections/WhyChooseUs/WhyChooseUsCTA';

/**
 * /why-choose-us, rebuilt on the site's shared design system.
 *
 * This module was already split into per-section components, but on a design
 * system of its own: a theme.js, an icons.jsx of hand-rolled SVGs, ui/
 * duplicates of Badge, Counter, Flag, Reveal and SectionHeading, and ~1,800
 * lines of CSS across nine stylesheets, plus three drifting aura orbs. All of
 * it is replaced by the heat/ink/bone tokens, Bebas Neue and the shared
 * RevealText / HeroCTAs primitives the rest of the site uses.
 *
 * Order changed too. The old file rendered Hero, Stats, Process, Brands,
 * Testimonials, Reliability, Cta, Marquee, with the reliability argument
 * arriving after the testimonials that were meant to corroborate it, and a
 * brands strip that duplicated the brand wall on /local-experience. Reliability
 * now precedes the testimonials, and Brands is dropped rather than repeated.
 *
 * Three content changes, all noted in data.js:
 *   - The five-step "process" was two steps and three offers. /how-it-works
 *     owns the sequence, so this is "what you get" and links there.
 *   - The stat cards' progress bars were driven by hardcoded percentages
 *     (92, 100, 78, 56) that measured nothing.
 *   - The customer avatars were four Unsplash photographs of strangers.
 */
export default function WhyChooseUsClient() {
  return (
    <main className="bg-ink-950">
      <WhyChooseUsHero />
      <ProofStats />
      <Reliability />
      <WhatYouGet />
      <Testimonials />
      <CertificationMarquee />
      <WhyChooseUsCTA />
    </main>
  );
}
