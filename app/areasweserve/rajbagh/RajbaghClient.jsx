'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Jawahar Nagar', href: '/areasweserve/jawaharnagar' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
  { name: 'Sonwar', href: '/areasweserve/sonwar' },
  { name: 'Gogji Bagh', href: '/areasweserve/gogjibagh' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam systems in Rajbagh homes?',
    a: 'Yes, The Heating Store is based in Rajbagh, so we install electric hamam and underfloor heating systems across Rajbagh and surrounding lanes with same-day site visits possible.',
  },
  {
    q: 'How much does electric hamam installation cost in Rajbagh?',
    a: 'Costs depend on room size, flooring type, and the system you choose. We provide a written quotation after a free site survey at your Rajbagh home.',
  },
  {
    q: 'Can I visit your Rajbagh showroom to see the systems?',
    a: 'Absolutely. Our Rajbagh showroom lets you see, touch, and compare the systems we install, from compact bathroom hamam units to full-house underfloor heating.',
  },
  {
    q: 'How long does installation take in a Rajbagh home?',
    a: 'A typical bathroom hamam takes 1 day; a full-house underfloor heating installation is usually completed within 1–2 days depending on area.',
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
  areaServed: ['Rajbagh', 'Srinagar', 'Jawahar Nagar', 'Lal Chowk', 'Sonwar'],
};

export default function RajbaghClient() {
  return (
    <AreaPageTemplate
      areaName="Rajbagh"
      areaSlug="rajbagh"
      heroTagline="Premium UK-imported electric hamams designed for Kashmir winters, installed by The Heating Store, right here in Rajbagh, Srinagar."
      bodyText="The Heating Store is located in the heart of Rajbagh, one of Srinagar's most central and well-connected neighbourhoods. Homeowners in Rajbagh and the surrounding lanes trust us for premium electric hamam and underfloor heating systems engineered for sub-zero temperatures and long power cuts. Our Rajbagh showroom lets you see, touch, and compare the systems we install, from compact bathroom hamam units to full-house underfloor heating solutions. Every system we sell is UK-imported, certified for wet areas, and backed by a written warranty plus our Kashmir installation guarantee."
      directionsText="We are located in Rajbagh itself, a short walk from Rajbagh Market and the Jawahar Nagar–Rajbagh link road. Call us for the exact pin location."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
