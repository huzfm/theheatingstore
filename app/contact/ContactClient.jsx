'use client';

import ContactHero from '@/components/sections/Contact/ContactHero';
import ContactChannels from '@/components/sections/Contact/ContactChannels';
import EnquiryForm from '@/components/sections/Contact/EnquiryForm';
import CoverageSummary from '@/components/sections/Contact/CoverageSummary';
import ContactCTA from '@/components/sections/Contact/ContactCTA';

/**
 * /contact, dark cinematic redesign. Composed from per-section components in
 * components/sections/Contact/, matching every other route: the same
 * heat/ink/bone tokens, Bebas Neue display face, and RevealText primitives.
 * Reduced motion honoured throughout.
 *
 * This replaced a 608-line self-contained client component with a ~320-line
 * inline CSS string, three drifting aura orbs, four hand-rolled SVG icons, and
 * light-on-dark form fields.
 *
 * The lead submission is carried across untouched, same endpoint, payload and
 * validation. See the header comment in EnquiryForm.
 *
 * Three corrections went in, all noted in data.js:
 *   - CITY_DATA, ninety lines of per-city content including three attributed
 *     customer testimonials and three four-step processes, of which exactly
 *     one field (`badge`) was ever rendered. Called out rather than silently
 *     dropped, since the testimonials look real and belong somewhere visible.
 *   - The coverage cards' installation counts (45k+/200k+/35k+) contradicted a
 *     "200+" figure in the same file by a factor of a thousand.
 *   - "theheatingstore.in" was listed as a mailto: address. It is a domain, so
 *     the link opened a mail client addressed to nothing.
 *
 * The global footer is hidden on this route (SiteChrome hidePrefixes in
 * app/layout.js), so the closing panel here is the last thing on the page.
 */
export default function ContactClient() {
  return (
    <main className="bg-ink-950">
      <ContactHero />
      <ContactChannels />
      <EnquiryForm />
      <CoverageSummary />
      <ContactCTA />
    </main>
  );
}
