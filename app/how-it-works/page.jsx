import { pageMetadata } from '@/app/lib/seo';
import HowItWorksClient from './HowItWorksClient';
import { STAGES } from '@/components/sections/HowItWorks/data';

/**
 * Positioned on *process* keywords, not on "how underfloor heating works",
 * which /working already owns. The two pages were previously competing for the
 * same query with near-identical titles.
 */
export const metadata = pageMetadata("/how-it-works");

/* Structured data mirrors what is actually rendered below, it is built from
   the same STAGES the page imports, so the markup cannot drift from the copy.
   No FAQPage schema here: the page carries no FAQ, and marking up questions
   that are not on the page is exactly what Google penalises. */
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Installing electric hamam underfloor heating, stage by stage',
  description:
    'The five stages of an electric underfloor heating installation, from the free site visit through to commissioning and aftercare.',
  step: STAGES.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.lead,
    url: `https://theheatingstore.in/how-it-works#stage-${s.num}`,
  })),
};

export default function HowItWorks() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <HowItWorksClient />
    </>
  );
}
