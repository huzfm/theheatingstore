'use client';

import CertificationsHero from '@/components/sections/Certifications/CertificationsHero';
import StandardsIndex from '@/components/sections/Certifications/StandardsIndex';
import WarrantyPanel from '@/components/sections/Certifications/WarrantyPanel';
import CertificationsCTA from '@/components/sections/Certifications/CertificationsCTA';

/**
 * /certifications, dark cinematic redesign. Composed from per-section
 * components in components/sections/Certifications/, matching /about,
 * /working, /how-it-works, /local-experience and /global-experience: the same
 * heat/ink/bone tokens, Bebas Neue display face, and RevealText / HeroCTAs
 * primitives. Reduced motion honoured throughout.
 *
 * This replaced an 882-line self-contained client component with its own
 * inline amber/rust palette, a ~330-line inline CSS string, three drifting
 * aura orbs, a bespoke blur-in Counter, and eleven certification cards spread
 * across four sections in no particular order.
 *
 * Every mark, number and registration is carried over verbatim. What changed
 * is the organisation: the marks are now grouped by what they govern, and each
 * group says which systems it applies to, since two of the eleven applied only
 * to water-based systems and the old page never said so.
 *
 * Three blocks did not survive, all deliberately, see the note in data.js:
 * "Project Intelligence" (website features, not certifications), the
 * partner-brands paragraph (four dead #-anchors), and the solid orange
 * gradient support card (the only element on the site with that treatment).
 */
export default function CertificationsClient() {
  return (
    <main className="bg-ink-950">
      <CertificationsHero />
      <StandardsIndex />
      <WarrantyPanel />
      <CertificationsCTA />
    </main>
  );
}
