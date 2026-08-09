import { pageMetadata } from '@/app/lib/seo';
import BookSiteVisitClient from './BookSiteVisitClient';

/**
 * Was /SpaceVerification.
 *
 * Three things were wrong with the old URL. It was CamelCase, which is
 * case-sensitive on most hosts and reads as a filename rather than a page. It
 * described the internal process ("space verification") rather than what the
 * visitor gets, so it could never match a search for what this page is. And it
 * was `Disallow`ed in robots.txt while being the destination of the site-wide
 * secondary CTA, linked from roughly fifteen pages, so Google saw the links,
 * refused to follow any of them, and the page could only ever appear as a bare
 * blocked URL.
 *
 * /SpaceVerification now 308s here (next.config.mjs) and the Disallow is gone.
 *
 * Server wrapper because the wizard itself is a client component and a client
 * page file cannot export metadata.
 */
export const metadata = pageMetadata('/book-site-visit');

export default function BookSiteVisitPage() {
  return <BookSiteVisitClient />;
}
