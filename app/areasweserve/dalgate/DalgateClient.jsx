'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Nishat', href: '/areasweserve/nishat' },
  { name: 'Hazratbal', href: '/areasweserve/hazratbal' },
  { name: 'Sonwar', href: '/areasweserve/sonwar' },
];

const FAQS = [
  {
    q: 'Is electric hamam suitable for Dalgate\'s lake humidity?',
    a: 'Yes. Every system we install in Dalgate is certified safe for wet areas and engineered to handle the high humidity typical of the Boulevard and Dal Lake shoreline.',
  },
  {
    q: 'Do you install in Dalgate houseboats and boutique hotels?',
    a: 'Yes. We have installed heating in Dalgate-area houseboats and boutique hotels — each system is custom-designed for the specific layout and load requirements.',
  },
  {
    q: 'How does your system perform in Dalgate\'s cold lake wind?',
    a: 'Our UK-imported systems use high-output heating elements and full thermal mass layering, retaining warmth for 8–10 hours after a power cut — exactly what Dalgate homes need.',
  },
  {
    q: 'Do you offer site surveys in Dalgate?',
    a: 'Yes. Same-day or next-day site surveys in Dalgate are typical. Call 9070907035 to schedule a free survey.',
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
  areaServed: ['Dalgate', 'Rajbagh', 'Srinagar', 'Lal Chowk', 'Boulevard'],
};

export default function DalgateClient() {
  return (
    <AreaPageTemplate
      areaName="Dalgate"
      areaSlug="dalgate"
      heroTagline="Premium UK-imported electric hamams for Dalgate — Srinagar's famous Boulevard neighbourhood, where lake humidity meets freezing winter air."
      bodyText="Dalgate sits at the foot of the Boulevard, where the lake meets the city. The humidity here is high, the winter wind cuts straight off the water, and the floors stay cold long after sunrise. Homes and boutique hotels in Dalgate need heating systems that handle moisture as well as cold — and that's exactly what our UK-imported electric hamams and underfloor heating systems are engineered for. Every system we install is certified safe for wet areas, retains heat for 8–10 hours after a power cut, and comes with a written warranty plus our Kashmir installation guarantee."
      directionsText="From Dalgate, head up the Boulevard towards Lal Chowk, then on to Rajbagh. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
