'use client';

import GlobalExperienceHero from '@/components/sections/GlobalExperience/GlobalExperienceHero';
import StandardsStory from '@/components/sections/GlobalExperience/StandardsStory';
import CountryIndex from '@/components/sections/GlobalExperience/CountryIndex';
import ProjectTypes from '@/components/sections/GlobalExperience/ProjectTypes';
import DocumentLibrary from '@/components/sections/GlobalExperience/DocumentLibrary';
import GlobalExperienceCTA from '@/components/sections/GlobalExperience/GlobalExperienceCTA';

/**
 * /global-experience, dark cinematic redesign. Composed from per-section
 * components in components/sections/GlobalExperience/, on the same rhythm as
 * /about and its sibling /local-experience: cinematic hero, photographic
 * narrative beat with a parallax image, index sections, closing panel. Same
 * heat/ink/bone tokens, Bebas Neue display face, and RevealText / HeroCTAs
 * primitives. Reduced motion honoured throughout.
 *
 * This replaced a 1,362-line self-contained client component with its own
 * inline amber/coral palette, a large inline CSS string, three drifting aura
 * orbs and a bespoke counter.
 *
 * Two sections did not survive the rewrite, both deliberately:
 *   - "Our Installation Process", five steps that were the same five stages
 *     /how-it-works exists to explain, told worse. Lane discipline.
 *   - The FAQ, five general questions already answered at greater length in
 *     app/components/FaqSection and on /working.
 *
 * Lane: what arrives here from outside, the countries these systems are proven
 * in, the standards they are built to, and the manufacturer documentation.
 * /local-experience covers what we do on the ground here.
 */
export default function GlobalExperienceClient() {
  return (
    <main className="bg-ink-950">
      <GlobalExperienceHero />
      <StandardsStory />
      <CountryIndex />
      <ProjectTypes />
      <DocumentLibrary />
      <GlobalExperienceCTA />
    </main>
  );
}
