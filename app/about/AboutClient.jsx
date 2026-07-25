'use client';

import AboutHero from '@/components/sections/About/AboutHero';
import StoryRail from '@/components/sections/About/StoryRail';
import Timeline from '@/components/sections/About/Timeline';
import AboutStats from '@/components/sections/About/AboutStats';
import AboutCTA from '@/components/sections/About/AboutCTA';

/**
 * About, dark cinematic redesign. Composed from per-section components in
 * components/sections/About/. Shares the site's heat/ink/bone tokens, Bebas
 * Neue display face, and the GlowCard / MagneticButton / CounterNumber /
 * RevealText primitives so it belongs to the same system as /installation and
 * the /experience route. prefers-reduced-motion is honoured in each section.
 *
 * StoryRail carries the origin narrative and the three principles together, as
 * one pinned section with a sticky 3D heating mat. It replaces the separate
 * OriginStory and Principles sections, the copy is identical, but the two
 * needed to be adjacent to give the pinned panel enough scroll to act over.
 */
export default function AboutClient() {
  return (
    <main className="bg-ink-950">
      <AboutHero />
      <StoryRail />
      <Timeline />
      <AboutStats />
      <AboutCTA />
    </main>
  );
}
