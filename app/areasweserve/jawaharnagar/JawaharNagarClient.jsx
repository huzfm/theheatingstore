'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
  { name: 'Sonwar', href: '/areasweserve/sonwar' },
  { name: 'Gogji Bagh', href: '/areasweserve/gogjibagh' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
];

const FAQS = [
  {
    q: 'Do you serve Jawahar Nagar with electric hamam installation?',
    a: 'Yes. The Heating Store is just a 5-minute drive from Jawahar Nagar in Rajbagh. We regularly install electric hamam and underfloor heating systems in Jawahar Nagar homes.',
  },
  {
    q: 'How quickly can you visit my Jawahar Nagar home for a survey?',
    a: 'Same-day or next-day site visits are typical for Jawahar Nagar. Call 9070907035 and our team will schedule a free survey at a time that suits you.',
  },
  {
    q: 'Are your systems safe for use in Jawahar Nagar bathrooms?',
    a: 'Yes. Every system we install is certified safe for wet areas — including bathrooms and kitchens — and engineered for sub-zero Kashmir floors.',
  },
  {
    q: 'How long is the warranty on systems installed in Jawahar Nagar?',
    a: 'Our systems come with a 10–25 year manufacturer warranty plus our Kashmir installation guarantee. Full written warranty is handed over on completion.',
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
  areaServed: ['Jawahar Nagar', 'Rajbagh', 'Srinagar', 'Sonwar', 'Gogji Bagh'],
};

export default function JawaharNagarClient() {
  return (
    <AreaPageTemplate
      areaName="Jawahar Nagar"
      areaSlug="jawaharnagar"
      heroTagline="Premium UK-imported electric hamams for Jawahar Nagar homeowners — designed for Kashmir winters, installed by The Heating Store."
      bodyText="Jawahar Nagar is one of Srinagar's most prestigious residential areas, and homeowners here have trusted The Heating Store for over a decade to install premium electric hamam and underfloor heating systems. We're just a short drive away in Rajbagh — close enough for same-day site visits and after-installation service. Our systems are engineered for sub-zero Kashmir floors, designed to retain heat for hours even during power cuts, and certified safe for wet areas like bathrooms and kitchens."
      directionsText="From Jawahar Nagar, head towards Rajbagh via the Jawahar Nagar–Rajbagh link road. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
