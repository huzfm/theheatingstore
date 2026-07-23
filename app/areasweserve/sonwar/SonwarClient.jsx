'use client';

import AreaPageTemplate from '../../components/AreaPageTemplate';
import { ALL_AREAS, PRODUCT_LINKS } from '../../lib/constants';

const NEARBY = [
  { name: 'Jawahar Nagar', href: '/areasweserve/jawaharnagar' },
  { name: 'Rajbagh', href: '/areasweserve/rajbagh' },
  { name: 'Gogji Bagh', href: '/areasweserve/gogjibagh' },
  { name: 'Dalgate', href: '/areasweserve/dalgate' },
  { name: 'Lal Chowk', href: '/areasweserve/lalchowk' },
];

const FAQS = [
  {
    q: 'Why is Sonwar a key area for electric hamam installation?',
    a: 'Sonwar sits on a ridge above Srinagar, exposed to the coldest winter winds in the valley. Our UK-imported high-output systems are built for exactly these conditions.',
  },
  {
    q: 'Do you install in Sonwar apartments and independent homes?',
    a: 'Yes. We install in both — from compact bathroom hamams in Sonwar apartments to full-house underfloor heating in larger independent homes on the ridge.',
  },
  {
    q: 'How does electric hamam perform at Sonwar\'s higher altitude?',
    a: 'Sonwar\'s higher elevation means colder floors and longer power cuts. Our systems are engineered to deliver high heat output and retain warmth for 8–10 hours after power off.',
  },
  {
    q: 'Can I see a system installed in Sonwar before I commit?',
    a: 'We can arrange a Sonwar reference visit on request, so you can see and feel a working electric hamam installation in a similar home before you book.',
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
  areaServed: ['Sonwar', 'Rajbagh', 'Srinagar', 'Jawahar Nagar', 'Gogji Bagh'],
};

export default function SonwarClient() {
  return (
    <AreaPageTemplate
      areaName="Sonwar"
      areaSlug="sonwar"
      heroTagline="Premium UK-imported electric hamams for Sonwar — the upmarket residential enclave on Srinagar's higher ground, where winters bite harder than anywhere else."
      bodyText="Sonwar sits on a ridge above Srinagar, and the homes here are exposed to some of the coldest winter winds in the valley. That's exactly why Sonwar homeowners have been among our most enthusiastic customers for years — they feel the difference a properly engineered heating system makes. Our UK-imported electric hamams and underfloor heating systems are built for exactly these conditions: high heat output, fast warm-up, certified safe for wet areas, and engineered to retain warmth for 8–10 hours after a power cut."
      directionsText="From Sonwar, head down the ridge towards Jawahar Nagar and then on to Rajbagh. The Heating Store is located in Rajbagh, Srinagar 190008."
      nearbyAreas={NEARBY}
      allAreas={ALL_AREAS}
      productLinks={PRODUCT_LINKS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
