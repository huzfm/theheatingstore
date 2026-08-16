'use client';

import WarrantyHero from '@/components/sections/WarrantyCheck/WarrantyHero';
import WarrantyAssurances from '@/components/sections/WarrantyCheck/WarrantyAssurances';
import WarrantyLookup from '@/components/sections/WarrantyCheck/WarrantyLookup';
import WarrantyHelp from '@/components/sections/WarrantyCheck/WarrantyHelp';
import WarrantyCTA from '@/components/sections/WarrantyCheck/WarrantyCTA';

/**
 * /warranty-check, dark cinematic redesign. Composed from per-section
 * components in components/sections/WarrantyCheck/, matching every other
 * route: the same heat/ink/bone tokens, Bebas Neue display face, and
 * RevealText / Reveal primitives. Reduced motion honoured throughout.
 *
 * This replaced a 594-line self-contained client component that was the last
 * page on the site still running the old cream palette (#FFF8F0 ground,
 * #B86B45 / #E8933A accents, its own inline `T` token object). Three things
 * went with it:
 *
 *   - The page opened on a near-white gradient while Header.jsx renders as an
 *     absolutely-positioned overlay with white text and no solid background
 *     until you scroll 12px. The nav was effectively invisible on load, which
 *     is the reason every other route opens on a dark hero.
 *   - The certificate panel's "no search yet" and "no results" states were the
 *     only outcome copy on the page. There was nothing to do next, on a page
 *     whose most common empty result is a phone number filed under someone
 *     else. WarrantyHelp now answers that.
 *   - A `<SkeletonGroup label="TODO_COPY">` shipped, so the pending state
 *     announced the literal string TODO_COPY to screen readers.
 *
 * The lookup itself is unchanged in substance: same proxy, same query
 * parameters, same record fields. See WarrantyLookup for what did change
 * (payload unwrapping moved into the proxy, status derived from the expiry
 * date when the backend sends a value this page does not recognise, and en-IN
 * rather than en-PK date formatting).
 */
export default function WarrantyCheckClient() {
  return (
    <main className="bg-ink-950">
      <WarrantyHero />
      <WarrantyAssurances />
      <WarrantyLookup />
      <WarrantyHelp />
      <WarrantyCTA />
    </main>
  );
}
