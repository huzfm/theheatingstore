import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/journal");

import ArticlesSection from "../components/ArticlesSection";

/**
 * The Journal, lifted off the home page onto its own route.
 *
 * ArticlesSection is unchanged and still owns all of the layout and copy, it
 * simply reads as the page here rather than as one band near the foot of the
 * home page. Individual cards still deep-link into /blog, which remains the
 * full article index.
 */
export default function JournalPage() {
  return (
    <main>
      <ArticlesSection />
    </main>
  );
}
