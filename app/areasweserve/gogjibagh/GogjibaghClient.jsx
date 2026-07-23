'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Jawahar Nagar', href: '/areasweserve/jawaharnagar' },
  { name: 'Sonwar', href: '/areasweserve/sonwar' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Gogji Bagh homes?',
    a: 'Yes. We have installed electric hamam and underfloor heating systems in many Gogji Bagh homes and are known locally for clean workmanship and reliable after-service.',
  },
  {
    q: 'How close is your showroom to Gogji Bagh?',
    a: 'Very close — our Rajbagh showroom is just a 5-minute drive from Gogji Bagh via the Gogji Bagh–Rajbagh link lane.',
  },
  {
    q: 'Do you handle bathroom-only hamam installations in Gogji Bagh?',
    a: 'Yes. We install compact bathroom hamam units in Gogji Bagh homes — typically completed in 1 day with no disruption to the rest of the house.',
  },
  {
    q: 'Are your systems energy efficient enough for daily Gogji Bagh winter use?',
    a: 'Yes. Our UK-imported systems are designed for daily use, engineered for sub-zero Kashmir floors, and tuned for energy efficiency even in prolonged cold weather.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The Heating Store',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rajbagh',
    addressLocality: 'Srinagar',
    addressRegion: 'Jammu and Kashmir',
    postalCode: '190008',
    addressCountry: 'IN',
  },
  telephone: '+919070907035',
  areaServed: ['Gogji Bagh', 'Rajbagh', 'Srinagar', 'Sonwar', 'Jawahar Nagar'],
};

export default function GogjibaghClient() {
  return (
    <AreaPageTemplate
      areaName="Gogji Bagh"
      areaSlug="gogjibagh"
      heroTagline="Premium UK-imported electric hamams for Gogji Bagh — one of Srinagar's most established residential pockets, just minutes from our Rajbagh showroom."
      bodyText="Gogji Bagh is one of Srinagar's quietest, most well-kept neighbourhoods — tree-lined lanes, large family homes, and a strong sense of community. We've installed electric hamam and underfloor heating systems in many of these homes over the years, and we're known in the area for our clean workmanship and reliable after-service. Our UK-imported systems are designed for sub-zero Kashmir floors, certified safe for wet areas, and engineered to retain heat for hours after a power cut."
      directionsText="From Gogji Bagh, head towards Rajbagh via the Gogji Bagh–Rajbagh link lane. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
