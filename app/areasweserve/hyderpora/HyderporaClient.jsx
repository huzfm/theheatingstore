'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Bemina', href: '/areasweserve/bemina' },
  { name: 'Rawalpora', href: '/areasweserve/rawalpora' },
  { name: 'Chanapora', href: '/areasweserve/chanapora' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Sanat Nagar', href: '/areasweserve/sanatnagar' },
];

const FAQS = [
  {
    q: 'Do you install electric hamam in Hyderpora apartments?',
    a: 'Yes. Hyderpora apartments and independent homes are among our most common installation sites. We design the heating layout around your floor plan and usage.',
  },
  {
    q: 'Is your showroom close to Hyderpora?',
    a: 'Yes. Our Rajbagh showroom is about 20 minutes from Hyderpora via the airport-road link. We can also come to your Hyderpora home for a free site survey.',
  },
  {
    q: 'Do you handle commercial heating installations in Hyderpora?',
    a: 'Absolutely. We install zoned underfloor heating in Hyderpora offices, showrooms, and commercial buildings with thermostat-controlled zones for each area.',
  },
  {
    q: 'Are your systems safe for Hyderpora bathrooms and kitchens?',
    a: 'Yes. Every system we install is certified safe for wet areas, including bathrooms, kitchens, and laundry rooms — engineered for sub-zero Kashmir floors.',
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
  areaServed: ['Hyderpora', 'Rajbagh', 'Srinagar', 'Rawalpora', 'Bemina'],
};

export default function HyderporaClient() {
  return (
    <AreaPageTemplate
      areaName="Hyderpora"
      areaSlug="hyderpora"
      heroTagline="Premium UK-imported electric hamams for Hyderpora — visit The Heating Store in nearby Rajbagh, Srinagar."
      bodyText="Hyderpora is one of Srinagar's most rapidly growing residential hubs, with a mix of modern apartments, independent homes, and commercial spaces. The Heating Store in Rajbagh is the trusted destination for Hyderpora homeowners looking for premium UK-imported electric hamams and underfloor heating systems engineered for Kashmir winters. Our systems are designed for sub-zero temperatures, certified safe for wet areas, and built to retain heat for 8–10 hours after a power cut."
      directionsText="From Hyderpora, head towards Bemina and continue on to Rajbagh via the airport-road link. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
