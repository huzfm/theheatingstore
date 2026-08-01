'use client';

import AboutHero from '@/components/sections/About/AboutHero';
import OriginGallery from '@/components/sections/About/OriginGallery';
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
 * OriginGallery carries the origin narrative over a draggable circular gallery
 * of job-site imagery (a WebGL ring, see components/3d/CircularGalleryScene).
 * StoryRail then carries the three principles as one pinned section with a
 * sticky 3D heating mat. The two were a single rail until the origin story got
 * its own treatment; StoryRail's scroll thresholds live in lib/story-rail and
 * were re-derived for the shorter rail.
 */
export default function AboutClient() {
  return (
    <main className="bg-ink-950">
      <AboutHero />
      <OriginGallery />
      <StoryRail />
      <Timeline />
      <AboutStats />
      <AboutCTA />
    </main>
  );
}
