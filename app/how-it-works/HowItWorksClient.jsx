'use client';

import HowItWorksHero from '@/components/sections/HowItWorks/HowItWorksHero';
import ProcessRail from '@/components/sections/HowItWorks/ProcessRail';
import OnSiteTimeline from '@/components/sections/HowItWorks/OnSiteTimeline';
import HowItWorksCTA from '@/components/sections/HowItWorks/HowItWorksCTA';

/**
 * /how-it-works, dark cinematic redesign. Composed from per-section components
 * in components/sections/HowItWorks/, matching /about and /working: the same
 * heat/ink/bone tokens, Bebas Neue display face, and the RevealText / GlowCard
 * / HeroCTAs primitives, so all three read as one site. Reduced motion is
 * honoured in every section.
 *
 * This replaced a single self-contained 3,000-line client component built
 * around an auto-advancing five-slide carousel with its own inline palette,
 * inline <style> block and bespoke SVG scenes. Two things were wrong with it
 * beyond the styling: the carousel hid four fifths of the content behind a
 * 5.5s timer, and the copy was UK trade content (NICEIC, BS 7671, sterling
 * comparisons) on a Kashmir site that quotes in rupees everywhere else.
 *
 * Lane discipline against its two neighbours, none of which duplicate here:
 *   /working      — the physics of radiant heat and the thermostat
 *   /installation — the physical build, layer by layer
 *   /how-it-works — the customer's process, first call to aftercare
 */
export default function HowItWorksClient() {
  return (
    <main className="bg-ink-950">
      <HowItWorksHero />
      <ProcessRail />
      <OnSiteTimeline />
      <HowItWorksCTA />
    </main>
  );
}
