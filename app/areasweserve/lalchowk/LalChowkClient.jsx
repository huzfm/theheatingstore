'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Jawahar Nagar', href: '/areasweserve/jawaharnagar' },
  { name: 'Sonwar', href: '/areasweserve/sonwar' },
  { name: 'Gogji Bagh', href: '/areasweserve/gogjibagh' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Lal Chowk heritage buildings?',
    a: 'Yes. We regularly install in heritage Lal Chowk properties, including older homes and boutique hotels. Our systems are designed to add minimal floor build-up and work with traditional Kashmiri construction.',
  },
  {
    q: 'Is electric hamam suitable for Lal Chowk offices and shops?',
    a: 'Absolutely. We install zoned underfloor heating for Lal Chowk commercial spaces — boutiques, offices, and showrooms — with thermostat-controlled zones for each room.',
  },
  {
    q: 'How long does installation take in a Lal Chowk property?',
    a: 'A typical bathroom hamam takes 1 day. Full-house underfloor heating is usually completed within 1–2 days depending on the total area and access.',
  },
  {
    q: 'Do you handle Lal Chowk power cut conditions?',
    a: 'Yes. Our UK-imported systems are engineered to retain heat for 8–10 hours after a power cut — a feature Lal Chowk residents particularly value during Chilla Kalan.',
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
  areaServed: ['Lal Chowk', 'Rajbagh', 'Srinagar', 'Dalgate', 'Jawahar Nagar'],
};

export default function LalChowkClient() {
  return (
    <AreaPageTemplate
      areaName="Lal Chowk"
      areaSlug="lalchowk"
      heroTagline="Premium UK-imported electric hamams for Lal Chowk — Srinagar's commercial heart and one of the most demanding climates in the valley."
      bodyText="Lal Chowk is the bustling heart of Srinagar, surrounded by offices, heritage homes, and the city's most recognised landmarks. We've installed electric hamam and underfloor heating systems in homes and boutique hotels across the Lal Chowk area, and we know exactly what it takes to keep these spaces warm through the harshest Kashmir winters. Our UK-imported systems are designed for daily use, certified safe for wet areas, and engineered to retain heat for 8–10 hours after a power cut — a feature Lal Chowk residents particularly value."
      directionsText="From Lal Chowk, head towards Rajbagh via Residency Road. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
