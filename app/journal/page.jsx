export const metadata = {
  title: "The Journal | Writing on Warmth & the Architecture of Comfort",
  description:
    "Studies on how invisible heating shapes the way a home feels, from Kashmir's coldest winters to its quietest luxury interiors. Comparisons, climate notes and system guides from The Heating Store.",
  keywords: [
    "underfloor heating articles",
    "electric hamam vs traditional hamam",
    "heating for Kashmir winters",
    "electric vs hydronic underfloor heating",
    "underfloor heating luxury homes",
  ],
  openGraph: {
    title: "The Journal | The Heating Store",
    description:
      "Writing on warmth, and the architecture of comfort. Studies on underfloor heating in Kashmir homes and hotels.",
    type: "website",
  },
  alternates: {
    canonical: "/journal",
  },
};

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
