import WhyChooseUsClient from './WhyChooseUsClient';
import { NETWORK, COUNTRIES } from '@/components/sections/WhyUs/data';

const SITE_URL = 'https://theheatingstore.in';

/**
 * The canonical "why buy this from us" page, and now the only one.
 *
 * It absorbed /local-experience and /global-experience, so the metadata has to
 * carry all three intents without turning into a keyword list: the guarantee
 * terms this URL already ranked for, the Kashmir/town terms /local-experience
 * held, and the certification/manual terms /global-experience held. Both of
 * those URLs 301 here (next.config.mjs).
 */
export const metadata = {
  title: 'Why Choose Us | Underfloor Heating Kashmir, Proven Since 2011',
  description:
    'Two million systems, a 0.01% fault rate and 10–25 year warranties. The Srinagar team, the 17 towns we cover, and the nine countries these systems are proven in.',
  keywords: [
    'best underfloor heating installer Kashmir',
    'underfloor heating Kashmir',
    'electric hamam Srinagar',
    'electric hamam warranty India',
    'certified heating contractor Kashmir',
    'underfloor heating fault rate',
    'IEC certified heating cable',
    'underfloor heating installation manual download',
    'underfloor heating service network India',
    'underfloor heating price match',
  ],
  openGraph: {
    title: 'Why Choose Us | Underfloor Heating Kashmir, Proven Since 2011',
    description:
      'Anyone can sell you a heating cable. The question is who answers the phone in year six.',
    type: 'article',
  },
  alternates: { canonical: '/why-choose-us' },
};

/**
 * Structured data is built from the same constants the page renders, so the
 * markup cannot drift from the copy.
 *
 * Deliberately absent: Review and AggregateRating. The three testimonials are
 * real and attributed, but self-serving reviews on your own organisation have
 * not been eligible for rich results for years and marking them up is a
 * manual-action risk rather than an SEO win.
 */
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/why-choose-us#business`,
  name: 'The Heating Store',
  url: `${SITE_URL}/why-choose-us`,
  description:
    'Electric hamam and underfloor heating supply and installation across Kashmir and India, to internationally certified standards.',
  foundingDate: '2011',
  areaServed: NETWORK.regions.flatMap((r) =>
    r.places.map((place) => ({ '@type': 'City', name: place }))
  ),
  /* The countries the systems we supply are installed in, which is a different
     claim from areaServed and is why it is `knowsAbout` rather than a second
     service area. */
  knowsAbout: COUNTRIES.list.map((c) => `Underfloor heating standards, ${c.name}`),
  slogan: 'Proven in nine countries. Answered from Srinagar.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Why Choose Us',
      item: `${SITE_URL}/why-choose-us`,
    },
  ],
};

export default function WhyChooseUs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema]),
        }}
      />
      <WhyChooseUsClient />
    </>
  );
}
