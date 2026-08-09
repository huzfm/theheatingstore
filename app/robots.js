import facts from '@/content/facts';

/**
 * robots.txt, generated.
 *
 * Replaces the hand-maintained public/robots.txt, which had drifted into
 * contradicting the sitemap:
 *
 *   Disallow: /SpaceVerification
 *     Blocked the destination of the site-wide secondary CTA, linked from
 *     roughly fifteen pages. Google saw every one of those links and was
 *     forbidden from following any of them. That route is now
 *     /book-site-visit and is crawlable.
 *
 *   Disallow: /warranty-check
 *     Blocked a URL the sitemap simultaneously submitted at priority 0.7.
 *     Submitting a blocked URL is a Search Console error, and the page is a
 *     legitimate customer service tool with real content.
 *
 *   Disallow: /admin/
 *     The trailing slash meant this matched /admin/anything but NOT /admin,
 *     which is the actual route. The dashboard was crawlable the whole time.
 *
 *   Crawl-delay: 1
 *     Ignored by Googlebot. Dropped.
 *
 * A static file in /public takes precedence over this route, so
 * public/robots.txt has been deleted. Do not reintroduce it.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // API handlers return JSON and have no business in an index.
          '/api/',
          // Internal analytics dashboard. Both forms, so the route itself is
          // covered as well as anything nested under it.
          '/admin',
          '/admin/',
          // Dev-only verification route for the animation primitives. Also
          // carries a noindex meta tag; this just saves the crawl.
          '/experience/foundation-check',
        ],
      },
    ],
    sitemap: `${facts.url}/sitemap.xml`,
    host: facts.url,
  };
}
