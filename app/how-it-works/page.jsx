import HowItWorksClient from './HowItWorksClient';
import { STAGES } from '@/components/sections/HowItWorks/data';

/**
 * Positioned on *process* keywords, not on "how underfloor heating works",
 * which /working already owns. The two pages were previously competing for the
 * same query with near-identical titles.
 */
export const metadata = {
  title: 'The Installation Process | Survey to Handover, Step by Step',
  description:
    'What actually happens when you install electric hamam underfloor heating in Kashmir: the free site visit, the heat design and quote, installation, screed curing and commissioning, and the warranty you are left with.',
  keywords: [
    'underfloor heating installation process Kashmir',
    'electric hamam installation steps',
    'free heating site survey Kashmir',
    'underfloor heating installation time',
    'electric hamam warranty Kashmir',
    'how long does underfloor heating take to install',
  ],
  openGraph: {
    title: 'The Installation Process | Survey to Handover, Step by Step',
    description:
      'Five stages, no surprises: who arrives, what they do, how long your house is a building site, and what you are left holding.',
    type: 'article',
  },
  alternates: { canonical: '/how-it-works' },
};

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
