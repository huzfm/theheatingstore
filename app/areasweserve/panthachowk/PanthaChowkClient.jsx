'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Hazratbal', href: '/areasweserve/hazratbal' },
  { name: 'Nishat', href: '/areasweserve/nishat' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
];

const FAQS = [
  {
    q: 'Where can I buy Electric Hamams near Pantha Chowk?',
    a: 'The Heating Store in Rajbagh serves customers throughout Pantha Chowk and Srinagar with premium UK-imported Electric Hamams.',
  },
  {
    q: 'How far is The Heating Store from Pantha Chowk?',
    a: 'Our Rajbagh showroom is conveniently accessible from Pantha Chowk, a short drive via Dalgate and Lal Chowk.',
  },
  {
    q: 'Are your Electric Hamams imported?',
    a: 'Yes. We specialize in premium Electric Hamams imported from the United Kingdom, engineered for safety, efficiency, and longevity.',
  },
  {
    q: 'Are Electric Hamams suitable for Kashmir winters?',
    a: 'Absolutely. They are selected specifically for climates that require dependable heating and perform reliably through Chilla Kalan.',
  },
  {
    q: 'Can I install an Electric Hamam in a new property?',
    a: 'Yes. Ideal for new homes, commercial projects, and renovations. We design the system around your floor plan and usage.',
  },
  {
    q: 'Do you serve commercial buildings?',
    a: 'Yes. Offices, institutions, clinics, hotels, and commercial properties across Pantha Chowk and Srinagar.',
  },
  {
    q: 'How can I contact The Heating Store?',
    a: 'Call 9070907035 or visit our Rajbagh showroom. We offer free site surveys across Srinagar.',
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
  areaServed: [
    'Pantha Chowk',
    'Rajbagh',
    'Srinagar',
    'Dalgate',
    'Nishat',
    'Hazratbal',
    'Rawalpora',
  ],
};

export default function PanthaChowkClient() {
  return (
    <AreaPageTemplate
      areaName="Pantha Chowk"
      areaSlug="panthachowk"
      heroTagline="Premium UK-imported heating solutions for Pantha Chowk, engineered for Kashmir winters, installed by The Heating Store from our Rajbagh showroom."
      bodyText="Pantha Chowk is one of Srinagar's most important gateway areas, connecting the city to Jammu and serving as a major residential, commercial, and transportation hub. Located near the Srinagar-Jammu National Highway, Pantha Chowk is home to residential communities, educational institutions, government offices, businesses, and growing commercial developments. Like the rest of Kashmir, Pantha Chowk experiences cold winters where dependable indoor heating becomes essential. At The Heating Store, we help homeowners, builders, architects, commercial property owners, hotel operators, and institutions find premium Electric Hamams specifically selected for Kashmir's climate. Located in Rajbagh, Srinagar, we proudly offer premium UK-imported Electric Hamams known for exceptional quality, reliability, and long-term performance."
      directionsText="From Pantha Chowk, head towards Dalgate and continue on to Rajbagh. The Heating Store is located in Rajbagh, Srinagar 190008. Nearby landmarks: Srinagar-Jammu National Highway, Pantha Chowk Market, Dalgate, Sonwar, Rajbagh Commercial District."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
