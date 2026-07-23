'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Hyderpora', href: '/areasweserve/hyderpora' },
  { name: 'Rawalpora', href: '/areasweserve/rawalpora' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Chanapora', href: '/areasweserve/chanapora' },
  { name: 'Sanat Nagar', href: '/areasweserve/sanatnagar' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Bemina sectors?',
    a: 'Yes. We install across all Bemina sectors — A through F — handling both the insulated concrete floors and the long cold spells typical of this side of the city.',
  },
  {
    q: 'How far is your showroom from Bemina?',
    a: 'Our Rajbagh showroom is about 20 minutes from Bemina via the airport-road link. We can also arrange Bemina site visits directly at your home.',
  },
  {
    q: 'Are your systems suitable for Bemina apartment buildings?',
    a: 'Absolutely. We install in both apartments and independent homes across Bemina, designing the heating layout around your floor plan and usage patterns.',
  },
  {
    q: 'How long is the warranty on systems installed in Bemina?',
    a: 'Every installation in Bemina comes with a 10–25 year manufacturer warranty, our Kashmir installation guarantee, and a free post-installation thermal check.',
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
  areaServed: ['Bemina', 'Rajbagh', 'Srinagar', 'Hyderpora', 'Rawalpora'],
};

export default function BeminaClient() {
  return (
    <AreaPageTemplate
      areaName="Bemina"
      areaSlug="bemina"
      heroTagline="Premium UK-imported electric hamams for Bemina — Srinagar's well-planned residential colony on the airport side of the city."
      bodyText="Bemina is one of Srinagar's largest planned residential colonies, and the families here know that a Kashmir winter doesn't forgive poorly-designed heating. We've installed electric hamam and underfloor heating systems in homes across Bemina's sectors, and we know exactly how to handle the insulated concrete floors and the long cold spells that define life on this side of the city. Our UK-imported systems are engineered for sub-zero temperatures, certified safe for wet areas, and designed to retain heat for 8–10 hours after a power cut — a real benefit in Bemina, where winter outages are common."
      directionsText="From Bemina, head towards Hyderpora and on to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
