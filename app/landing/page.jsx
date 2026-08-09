import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import LandingClient from './LandingClient';

/**
 * This page's three faces, self-hosted at build by next/font.
 *
 * They were loaded with a runtime `@import url('https://fonts.googleapis.com/…')`
 * inside an inline <style> block in the client component. A CSS @import is
 * render-blocking and cannot begin until the stylesheet containing it has
 * parsed, so it serialises a third-party round trip in front of first paint,
 * and it leaks the visitor's IP to Google on every view.
 *
 * next/font downloads them at build time, serves them from this origin, and
 * emits `font-display: swap` so text paints in a fallback immediately.
 *
 * `preload: false` on the mono face: it is used for small labels well below
 * the fold, so preloading it would compete with the two faces the hero needs.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lp-display',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lp-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lp-mono',
  display: 'swap',
  preload: false,
});

/**
 * Server wrapper so this route can export metadata at all. The page body is a
 * client component ('use client'), and a client page file cannot export
 * `metadata`, which is why /landing was the only marketing route on the site
 * with no canonical.
 *
 * Deliberately no title/description here: /landing duplicates the homepage's
 * intent, has zero inbound links and is flagged for `noindex`. Writing
 * approved marketing copy for a page that is probably about to be deindexed
 * would be wasted work. It inherits the root layout's title, description and
 * share card, and now declares where it lives.
 */
export const metadata = {
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
  return (
    <div className={`${fraunces.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <LandingClient />
    </div>
  );
}
