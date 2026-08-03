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

import "./journal.css";
import JournalHero from "./components/JournalHero";
import FeaturedStory from "./components/FeaturedStory";
import JournalIndex from "./components/JournalIndex";
import JournalManifesto from "./components/JournalManifesto";
import JournalCTA from "./components/JournalCTA";

/**
 * The Journal — a dedicated editorial destination, not a single section.
 * Cinematic cover, a lead feature, a filterable index of the remaining
 * stories, a short manifesto, then one closing invitation.
 */
export default function JournalPage() {
  return (
    <main className="journal-page">
      <JournalHero />
      <FeaturedStory />
      <JournalIndex />
      <JournalManifesto />
      <JournalCTA />
    </main>
  );
}
