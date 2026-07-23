'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Bemina', href: '/areasweserve/bemina' },
  { name: 'Hyderpora', href: '/areasweserve/hyderpora' },
  { name: 'Rawalpora', href: '/areasweserve/rawalpora' },
  { name: 'Sanat Nagar', href: '/areasweserve/sanatnagar' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Chanapora?',
    a: 'Yes. We install UK-imported electric hamam and underfloor heating systems across Chanapora — including homes, apartments, and small commercial spaces.',
  },
  {
    q: 'How quickly can you visit my Chanapora home?',
    a: 'Site visits in Chanapora are typically scheduled within 24–48 hours. Call 9070907035 to book a free survey.',
  },
  {
    q: 'Is your system suitable for Chanapora\'s cold winters?',
    a: 'Yes. Our UK-imported systems are engineered specifically for sub-zero Kashmir floors, with 8–10 hour heat retention after a power cut.',
  },
  {
    q: 'Do you handle warranty and after-service in Chanapora?',
    a: 'Yes. Every installation includes a written manufacturer warranty plus our Kashmir installation guarantee, with after-service available on call.',
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
  areaServed: ['Chanapora', 'Rajbagh', 'Srinagar', 'Bemina', 'Hyderpora'],
};

export default function ChanaporaClient() {
  return (
    <AreaPageTemplate
      areaName="Chanapora"
      areaSlug="chanapora"
      heroTagline="Premium UK-imported electric hamams for Chanapora homeowners — installed by The Heating Store from our Rajbagh showroom."
      bodyText="Chanapora is a fast-developing residential area on Srinagar's airport side, and The Heating Store in nearby Rajbagh is the trusted supplier for premium electric hamam and underfloor heating systems here. Every system we install is UK-imported, certified safe for wet areas, and engineered to retain heat for 8–10 hours after a power cut — exactly what Chanapora families need through the long Kashmir winter. Our team handles every project from initial site survey to final handover and warranty registration."
      directionsText="From Chanapora, head towards Hyderpora and continue to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
