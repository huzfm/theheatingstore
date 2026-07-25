'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Bemina', href: '/areasweserve/bemina' },
  { name: 'Hyderpora', href: '/areasweserve/hyderpora' },
  { name: 'Sanat Nagar', href: '/areasweserve/sanatnagar' },
  { name: 'Rawalpora', href: '/areasweserve/rawalpora' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Nowgam?',
    a: 'Yes. The Heating Store installs UK-imported electric hamam and underfloor heating systems in Nowgam homes, apartments, and small commercial spaces.',
  },
  {
    q: 'Is Nowgam covered by your Kashmir installation service?',
    a: 'Yes. Nowgam is part of our regular service area. We provide free site visits and handle the complete installation from survey to warranty handover.',
  },
  {
    q: 'Are your systems safe for Nowgam bathrooms?',
    a: 'Absolutely. Every system we install is certified safe for wet areas, including bathrooms, kitchens, and laundry rooms, engineered for sub-zero Kashmir floors.',
  },
  {
    q: 'How long does installation take in a Nowgam home?',
    a: 'A typical bathroom hamam is completed in 1 day. Full-house underfloor heating usually takes 1–2 days depending on the total area.',
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
  areaServed: ['Nowgam', 'Rajbagh', 'Srinagar', 'Bemina', 'Hyderpora'],
};

export default function NowgamClient() {
  return (
    <AreaPageTemplate
      areaName="Nowgam"
      areaSlug="nowgam"
      heroTagline="Premium UK-imported electric hamams for Nowgam homeowners, installed by The Heating Store from our Rajbagh showroom."
      bodyText="Nowgam is a residential area on the outskirts of Srinagar, and homeowners here are increasingly turning to electric hamam and underfloor heating for reliable, sub-zero Kashmir comfort. The Heating Store in nearby Rajbagh supplies and installs UK-imported systems engineered for the long Chilla Kalan cold, with full thermal mass layering, 8–10 hour heat retention, and a written warranty. From compact bathroom hamams to full-house installations, our Kashmir team handles every project from site survey to handover."
      directionsText="From Nowgam, head towards Bemina and continue to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
