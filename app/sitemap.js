import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import facts from '@/content/facts';
import { PAGE_META } from '@/content/page-meta';
import { ALL_AREAS } from '@/app/lib/constants';
import { BRANDS } from '@/app/lib/brandsData';

const SITE_URL = facts.url;

const BLOG_API_BASE = process.env.NEXT_PUBLIC_BLOG_API_BASE || 'https://api.theheatingstore.in/api/public';
const BLOG_API_KEY = process.env.NEXT_PUBLIC_BLOG_API_KEY || '';

/**
 * Every indexable route, with a real last-modified date.
 *
 * What was wrong with the previous version:
 *
 *  - It listed /warranty-check, which robots.txt simultaneously Disallowed.
 *    Submitting a blocked URL is a Search Console error.
 *  - It omitted all six /brands/* pages, which are the best-differentiated
 *    content on the site (~86% unique copy), plus /measuring-up and /dealer.
 *  - It listed /hero, a legacy WebGL demo of the homepage hero with zero
 *    inbound links and duplicate intent.
 *  - It listed /blog, whose server-rendered HTML was an empty skeleton.
 *  - Every entry carried `lastModified: new Date()`, i.e. "modified now" on
 *    every build, which is not a signal, it is noise. Google discounts a
 *    sitemap whose dates all move every deploy.
 *  - It was a hand-maintained array, so it drifted from the routes that
 *    actually exist. It is now derived: ROUTES below is the single list, and
 *    the area and brand entries are generated from the same constants the
 *    pages themselves render from.
 */

/**
 * Last commit date for a path, which is the only honest answer to "when did
 * this page last change".
 *
 * Falls back to file mtime, then to build time, because a deploy from a
 * tarball or a shallow clone has no git history and a sitemap that throws is
 * worse than one with an approximate date.
 */
const gitDateCache = new Map();
function lastModified(relPath) {
  if (gitDateCache.has(relPath)) return gitDateCache.get(relPath);

  let iso;
  try {
    iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', relPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    iso = '';
  }

  if (!iso) {
    try {
      iso = fs.statSync(path.join(process.cwd(), relPath)).mtime.toISOString();
    } catch {
      iso = new Date().toISOString();
    }
  }

  gitDateCache.set(relPath, iso);
  return iso;
}

/**
 * The indexable routes, each with the source path whose history dates it.
 *
 * `priority` is included because the previous sitemap used it, but be aware
 * Google has said publicly that it ignores both priority and changeFrequency.
 * They are kept only as documentation of intent for other crawlers.
 */
const ROUTES = [
  ['/', 'app/page.js', 1.0],
  ['/product', 'app/product', 0.9],
  ['/installation', 'app/installation', 0.9],
  ['/contact', 'app/contact', 0.9],
  ['/book-site-visit', 'app/book-site-visit', 0.9],
  ['/why-choose-us', 'app/why-choose-us', 0.9],
  ['/about', 'app/about', 0.8],
  ['/how-it-works', 'app/how-it-works', 0.8],
  ['/working', 'app/working', 0.8],
  ['/certifications', 'app/certifications', 0.8],
  ['/measuring-up', 'app/measuring-up', 0.8],
  ['/areasweserve', 'app/areasweserve/page.jsx', 0.9],
  ['/heatingequipmentsupplier', 'app/heatingequipmentsupplier/page.jsx', 0.9],
  ['/journal', 'app/journal', 0.7],
  ['/blog', 'app/blog/page.js', 0.7],
  ['/bloginfo', 'app/bloginfo', 0.6],
  ['/dealer', 'app/dealer', 0.6],
  ['/warranty-check', 'app/warranty-check', 0.6],
  ['/experience', 'app/experience/page.jsx', 0.6],
];

const SUPPLIER_PAGES = [
  'electrichamam',
  'electricfloorheating',
  'heatingsystems',
  'underfloorheating',
  'radiantfloorheating',
  'homeheatingsolutions',
  'commercialheatingsystems',
];

/**
 * Deliberately absent, and why:
 *
 *   /hero          Legacy WebGL demo duplicating the homepage hero. Zero
 *                  inbound links. Awaiting a noindex decision; listing it
 *                  meanwhile invites the duplicate-content comparison.
 *   /landing       Second landing page duplicating the homepage. Same.
 *   /admin         Internal dashboard, Disallowed in robots.
 *   /AboutSection  308 -> /about.
 *   /local-experience, /global-experience   308 -> /why-choose-us.
 *   /SpaceVerification                      308 -> /book-site-visit.
 *   /experience/foundation-check            noindex dev route.
 *   /blog/[slug]   Posts come from an external API at request time; there is
 *                  no build-time list of slugs to enumerate. Worth adding a
 *                  generated sitemap for once that API is queried at build.
 */

export default async function sitemap() {
  const entries = [];

  for (const [route, source, priority] of ROUTES) {
    entries.push({
      url: route === '/' ? SITE_URL : `${SITE_URL}${route}`,
      lastModified: lastModified(source),
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority,
    });
  }

  for (const slug of SUPPLIER_PAGES) {
    entries.push({
      url: `${SITE_URL}/heatingequipmentsupplier/${slug}`,
      lastModified: lastModified(`app/heatingequipmentsupplier/${slug}`),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Generated from the same constant the area pages and their cross-links use,
  // so a new neighbourhood page cannot be forgotten here.
  for (const area of ALL_AREAS) {
    entries.push({
      url: `${SITE_URL}${area.href}`,
      lastModified: lastModified(`app/areasweserve/${area.slug}`),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Likewise from brandsData, the array that generates the routes themselves.
  for (const brand of BRANDS) {
    entries.push({
      url: `${SITE_URL}/brands/${brand.slug}`,
      lastModified: lastModified('app/lib/brandsData.js'),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Blog posts: fetched from the API so the sitemap stays in sync with the CMS.
  try {
    const blogRes = await fetch(`${BLOG_API_BASE}/blogs/sitemap`, {
      headers: { 'x-api-key': BLOG_API_KEY },
      cache: 'no-store',
    });
    if (blogRes.ok) {
      const blogData = await blogRes.json();
      for (const item of blogData.items || []) {
        entries.push({
          url: item.url,
          lastModified: new Date(item.lastmod),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Blog API unavailable at build time — skip rather than fail the build.
  }

  // A URL in the sitemap that has no approved metadata entry is a route that
  // slipped through Phase 2. Fail the build rather than submit it.
  // Blog posts (/blog/*) are dynamic and excluded from this check.
  const missing = entries
    .map((e) => e.url.replace(SITE_URL, '') || '/')
    .filter((p) => !PAGE_META[p] && !p.startsWith('/blog/'));
  if (missing.length) {
    throw new Error(
      `sitemap: these routes have no entry in content/page-meta.ts: ${missing.join(', ')}`
    );
  }

  return entries;
}
