'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Nishat', href: '/areasweserve/nishat' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
  { name: 'Panthachowk', href: '/areasweserve/panthachowk' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Hazratbal?',
    a: 'Yes. The Heating Store installs UK-imported electric hamam and underfloor heating systems in Hazratbal homes, apartments, and properties around the shrine area.',
  },
  {
    q: 'Is Hazratbal covered by your Kashmir service area?',
    a: 'Yes. Hazratbal is part of our regular service area. We provide free site visits and handle the complete installation from survey to warranty handover.',
  },
  {
    q: 'Are your systems engineered for Hazratbal\'s lake-side cold?',
    a: 'Yes. Our UK-imported systems are built for sub-zero Kashmir floors, with full thermal mass layering and 8–10 hour heat retention after a power cut.',
  },
  {
    q: 'How quickly can you visit my Hazratbal home?',
    a: 'Site visits in Hazratbal are typically scheduled within 24–48 hours. Call 9070907035 to book a free survey.',
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
  areaServed: ['Hazratbal', 'Rajbagh', 'Srinagar', 'Dalgate', 'Nishat'],
};

export default function HazratbalClient() {
  return (
    <AreaPageTemplate
      areaName="Hazratbal"
      areaSlug="hazratbal"
      heroTagline="Premium UK-imported electric hamams for Hazratbal homeowners — installed by The Heating Store from our Rajbagh showroom."
      bodyText="Hazratbal is one of Srinagar's most revered neighbourhoods, home to the famous Hazratbal shrine and a mix of established family homes and lake-adjacent properties. The Heating Store in nearby Rajbagh supplies and installs UK-imported electric hamam and underfloor heating systems engineered for the long Kashmir winter — with full thermal mass layering, 8–10 hour heat retention, certified wet-area safety, and a written warranty. Our Kashmir team handles every project from site survey to final handover."
      directionsText="From Hazratbal, head down the Boulevard towards Dalgate and continue to Rajbagh via Lal Chowk. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
