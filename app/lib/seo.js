/**
 * Metadata assembly for every route.
 *
 * This file was empty. Because there was no shared builder, each page hand-rolled
 * its own metadata object, and three things went wrong across the site:
 *
 *  1. 33 of 55 routes had NO canonical at all.
 *  2. Most routes emitted NO og:image. In the App Router a page-level
 *     `openGraph` REPLACES the parent's rather than merging into it, so every
 *     page that declared `openGraph: { title, description }` silently dropped
 *     the root layout's image. The handful that inherited it pointed at
 *     /images/og-default.jpg, which did not exist.
 *  3. 48 routes shared one twitter:description, for the same inheritance
 *     reason: declaring `openGraph` but not `twitter` keeps the parent's.
 *
 * Every one of those is an omission bug. Assembling the blocks in one place
 * means a route cannot omit them.
 *
 * `keywords` is deliberately absent. Google has ignored the meta keywords tag
 * since 2009, and ours listed "steam bath installation" site-wide, which is a
 * Turkish steam room, not a Kashmiri heated floor.
 */

import { PAGE_META } from '@/content/page-meta';
import facts from '@/content/facts';

export const SITE_URL = facts.url;

/**
 * The one Open Graph image for the whole site, 1200x630.
 *
 * Local, not remote. The homepage previously hotlinked an images.unsplash.com
 * URL, which meant every share card on the site depended on a third party
 * staying up and keeping that photo at that ID.
 */
export const OG_IMAGE = '/og/default.jpg';

const OG_IMAGE_ALT =
  'The Heating Store, electric hamam and underfloor heating installation in Kashmir';

/**
 * Build a route's full metadata from its approved strings.
 *
 * @param {string} path      Route path, exactly as it appears in PAGE_META
 *                           and in the URL, e.g. '/' or '/areasweserve/rajbagh'.
 * @param {object} [extra]   Merged in last. Use for per-route robots rules.
 */
export function pageMetadata(path, extra = {}) {
  const meta = PAGE_META[path];

  // Loud rather than silent: a typo'd path used to mean the page fell back to
  // the root layout's boilerplate, which is exactly how 48 routes ended up
  // sharing one description. Better to fail the build.
  if (!meta) {
    throw new Error(
      `pageMetadata: no entry for "${path}" in content/page-meta.ts. ` +
        `Add one, or fix the path.`
    );
  }

  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return {
    // `absolute` bypasses the root layout's "%s | The Heating Store" template.
    // With the template applied, every approved title would gain 20 characters
    // and blow the 60-character budget.
    title: { absolute: meta.title },
    description: meta.description,

    // Relative; metadataBase in app/layout.js resolves it to an absolute URL.
    alternates: { canonical: path },

    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: facts.name,
      url,
      title: meta.title,
      description: meta.description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },

    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      // Deliberately NOT meta.description. A share card is read in a feed, not
      // in a results page, and it gets its own line.
      description: meta.twitter,
      images: [OG_IMAGE],
    },

    ...extra,
  };
}

export default pageMetadata;
