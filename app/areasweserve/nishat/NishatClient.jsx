'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
  { name: 'Hazratbal', href: '/areasweserve/hazratbal' },
  { name: 'Panthachowk', href: '/areasweserve/panthachowk' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Nishat homes?',
    a: 'Yes. We install UK-imported electric hamam and underfloor heating systems in Nishat — including homes, boutique hotels, and the famous garden-side properties along the Boulevard.',
  },
  {
    q: 'Are your systems suitable for Nishat\'s lake humidity?',
    a: 'Yes. Our systems are certified safe for wet areas and engineered to handle the higher humidity of Nishat\'s lake-adjacent position.',
  },
  {
    q: 'Can I see a system in your Rajbagh showroom before I commit?',
    a: 'Absolutely. Visit our Rajbagh showroom to see live working systems and discuss the right solution for your Nishat home.',
  },
  {
    q: 'What warranty do you offer for Nishat installations?',
    a: 'Every installation comes with a 10–25 year manufacturer warranty, our Kashmir installation guarantee, and a free post-installation thermal check.',
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
  areaServed: ['Nishat', 'Rajbagh', 'Srinagar', 'Dalgate', 'Hazratbal'],
};

export default function NishatClient() {
  return (
    <AreaPageTemplate
      areaName="Nishat"
      areaSlug="nishat"
      heroTagline="Premium UK-imported electric hamams for Nishat homeowners — installed by The Heating Store from our Rajbagh showroom."
      bodyText="Nishat is one of Srinagar's most scenic neighbourhoods, sitting along the famous Boulevard and the Nishat and Shalimar Mughal gardens. Lake humidity and freezing winter winds make Nishat homes particularly demanding for heating systems — and that's exactly what our UK-imported electric hamams and underfloor heating are engineered for. The Heating Store in nearby Rajbagh supplies, installs, and warranties every system we sell, with full thermal mass layering, 8–10 hour heat retention, and certified wet-area safety."
      directionsText="From Nishat, head down the Boulevard towards Dalgate and continue to Rajbagh via Lal Chowk. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
