'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Hyderpora', href: '/areasweserve/hyderpora' },
  { name: 'Bemina', href: '/areasweserve/bemina' },
  { name: 'Sanat Nagar', href: '/areasweserve/sanatnagar' },
  { name: 'Chanapora', href: '/areasweserve/chanapora' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Rawalpora homes?',
    a: 'Yes. The Heating Store installs UK-imported electric hamam and underfloor heating systems in Rawalpora homes, apartments, and small commercial properties.',
  },
  {
    q: 'Is Rawalpora close to your Rajbagh showroom?',
    a: 'Yes. Rawalpora is roughly 25 minutes from our Rajbagh showroom via the airport-road link. We also conduct free site visits at your Rawalpora home.',
  },
  {
    q: 'How does your system handle Rawalpora\'s cold winters?',
    a: 'Our UK-imported systems are engineered for sub-zero Kashmir temperatures, with full thermal mass layering that retains heat for 8–10 hours after a power cut.',
  },
  {
    q: 'What warranty do you offer in Rawalpora?',
    a: 'Every Rawalpora installation comes with a 10–25 year manufacturer warranty, our Kashmir installation guarantee, and a free post-installation thermal check.',
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
  areaServed: ['Rawalpora', 'Rajbagh', 'Srinagar', 'Hyderpora', 'Bemina'],
};

export default function RawalporaClient() {
  return (
    <AreaPageTemplate
      areaName="Rawalpora"
      areaSlug="rawalpora"
      heroTagline="Premium UK-imported electric hamams for Rawalpora homeowners — installed by The Heating Store from our Rajbagh showroom."
      bodyText="Rawalpora is a growing residential colony on the airport side of Srinagar, and families here face the same long, harsh Kashmir winters as the rest of the valley. The Heating Store in nearby Rajbagh supplies and installs UK-imported electric hamam and underfloor heating systems engineered specifically for sub-zero floors, with full thermal mass layering, 8–10 hour heat retention, and a written warranty. From compact bathroom hamams to full-house underfloor heating installations, our team handles every project from site survey to handover."
      directionsText="From Rawalpora, head towards Hyderpora and continue to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
