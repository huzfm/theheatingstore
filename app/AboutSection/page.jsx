import { permanentRedirect } from 'next/navigation';

/**
 * The About page moved to /about (the canonical route, already in the sitemap).
 * This legacy path 308-redirects there so old links and the previous nav
 * target keep working.
 */
export default function AboutSectionRedirect() {
  permanentRedirect('/about');
}
