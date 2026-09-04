import LandingClient from './LandingClient';

/**
 * Server wrapper so this route can export metadata at all. The page body is a
 * client component ('use client'), and a client page file cannot export
 * `metadata`, which is why /landing was the only marketing route on the site
 * with no canonical.
 *
 * This is the Google Ads paid-traffic landing page. It carries `noindex` to
 * prevent organic indexing — the page duplicates the homepage's intent, has
 * zero inbound links, and an organically indexed Ads page competes with the
 * homepage for the same queries. Google Ads does not require organic indexing.
 * The canonical is kept so link equity (if any) consolidates rather than
 * fragmenting.
 *
 * The three next/font faces that used to be declared here (Fraunces,
 * Instrument Sans, IBM Plex Mono) are gone. This route is now set in the
 * site's own two faces — Bebas Neue and Hanken Grotesk, already loaded by the
 * root layout as --font-heading / --font-body — so /landing is no longer the
 * one page in a different typeface, and no longer pays for a fourth, fifth and
 * sixth font download on a page whose entire job is a fast first paint.
 *
 * It also fixes a leak: the old `.lp h1, .lp h2, .lp h3` rule set every
 * heading inside the wrapper in Fraunces, which meant the shared sections this
 * page embeds (Installation, FAQ, Testimonials, Our Process) rendered their
 * headlines in a serif here and in Bebas everywhere else on the site.
 */
export const metadata = {
  title: { absolute: 'Underfloor Heating in Kashmir | Free Site Visit' },
  description:
    'Book a free site visit for electric hamam and underfloor heating in Kashmir. Professional installation, UK-imported systems, lifetime warranty.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/landing' },
  // Only to stop this route sharing the root layout's share card with six
  // others. Not approved marketing copy; it describes what the page is.
  twitter: {
    card: 'summary_large_image',
    title: 'Underfloor Heating in Kashmir | The Heating Store',
    description: 'Free site visit, professional install, lifetime warranty, across the Valley.',
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
