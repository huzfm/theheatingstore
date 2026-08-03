'use client';

import LocalExperienceHero from '@/components/sections/LocalExperience/LocalExperienceHero';
import ValleyStory from '@/components/sections/LocalExperience/ValleyStory';
import BrandWall from '@/components/sections/LocalExperience/BrandWall';
import CoverageIndex from '@/components/sections/LocalExperience/CoverageIndex';
import LocalExperienceCTA from '@/components/sections/LocalExperience/LocalExperienceCTA';

/**
 * /local-experience, dark cinematic redesign. Composed from per-section
 * components in components/sections/LocalExperience/, matching /about,
 * /working and /how-it-works: the same heat/ink/bone tokens, Bebas Neue
 * display face, and the RevealText / HeroCTAs primitives. Reduced motion is
 * honoured in every section.
 *
 * The rhythm is About's: a cinematic hero, then a photographic narrative beat
 * with a parallax image, then the two index sections, then the shared closing
 * panel. An earlier pass had no photography between hero and footer and read
 * as hairline boxes on black, which is what put it out of step with the rest
 * of the site.
 *
 * This replaced an 837-line self-contained client component with its own
 * inline amber/coral palette, a ~200-line inline CSS string, a lazy WebGL hero
 * canvas, three cursor-parallaxed aura orbs, bespoke magnetic/tilt pointer
 * hooks, a category-filtered FAQ accordion, and a hardcoded copy of the brand
 * list that had already drifted from app/lib/brandsData.
 *
 * Lane: local presence — the towns, the team, the brands we can service here.
 * The physics is /working, the process is /how-it-works, the build is
 * /installation.
 */
export default function LocalExperienceClient() {
  return (
    <main className="bg-ink-950">
      <LocalExperienceHero />
      <ValleyStory />
      <BrandWall />
      <CoverageIndex />
      <LocalExperienceCTA />
    </main>
  );
}
