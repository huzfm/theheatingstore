'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Bemina', href: '/areasweserve/bemina' },
  { name: 'Hyderpora', href: '/areasweserve/hyderpora' },
  { name: 'Rawalpora', href: '/areasweserve/rawalpora' },
  { name: 'Chanapora', href: '/areasweserve/chanapora' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Sanat Nagar?',
    a: 'Yes. The Heating Store installs UK-imported electric hamam and underfloor heating systems across Sanat Nagar, with site visits available within 24–48 hours of your enquiry.',
  },
  {
    q: 'How much does installation cost in Sanat Nagar?',
    a: 'Costs depend on room size, flooring type, and the system you choose. We provide a written quotation after a free site survey at your Sanat Nagar home.',
  },
  {
    q: 'Can I see a working system before I commit?',
    a: 'Yes. Visit our Rajbagh showroom to see live working systems, or we can arrange a Sanat Nagar reference visit on request.',
  },
  {
    q: 'What warranty do I get with a Sanat Nagar installation?',
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
  areaServed: ['Sanat Nagar', 'Rajbagh', 'Srinagar', 'Bemina', 'Hyderpora'],
};

export default function SanatNagarClient() {
  return (
    <AreaPageTemplate
      areaName="Sanat Nagar"
      areaSlug="sanatnagar"
      heroTagline="Premium UK-imported electric hamams for Sanat Nagar homeowners, installed by The Heating Store from our Rajbagh showroom."
      bodyText="Sanat Nagar is a growing residential pocket on the airport side of Srinagar, and homeowners here are increasingly turning to electric hamam and underfloor heating for reliable, sub-zero Kashmir comfort. The Heating Store in nearby Rajbagh supplies and installs UK-imported systems engineered for the long Chilla Kalan cold, with full thermal mass layering, 8–10 hour heat retention, and a written warranty. From compact bathroom hamams to full-house installations, our Kashmir team handles every project from site survey to handover."
      directionsText="From Sanat Nagar, head towards Hyderpora and continue to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
