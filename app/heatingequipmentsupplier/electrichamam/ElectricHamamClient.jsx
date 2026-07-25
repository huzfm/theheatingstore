'use client';

import ProductPageTemplate from '../../components/ProductPageTemplate';
import { ALL_AREAS } from '../../lib/constants';

const FAQS = [
  {
    q: 'What is an electric hamam and how does it work?',
    a: 'An electric hamam is a UK-imported electric underfloor heating system installed beneath your floor. Heating cables embedded in the screed radiate warmth upward, giving even, silent heat across the entire floor, and retaining warmth for 8–10 hours after a power cut.',
  },
  {
    q: 'Are your electric hamams certified safe for wet areas?',
    a: 'Yes. Every electric hamam we supply is CE-certified and rated safe for wet areas, including bathrooms, kitchens, and laundry rooms.',
  },
  {
    q: 'How much does an electric hamam cost in Kashmir?',
    a: 'Cost depends on room size and the system chosen. We provide a written quotation after a free site survey, call 9070907035 to book one.',
  },
  {
    q: 'How long does installation take?',
    a: 'A typical bathroom hamam is completed in 1 day. Full-house electric hamam installation usually takes 1–2 days depending on total area.',
  },
  {
    q: 'What warranty do you offer on electric hamams?',
    a: 'Every system comes with a 10–25 year manufacturer warranty plus our Kashmir installation guarantee. Full written warranty is handed over on completion.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Electric Hamam',
  brand: { '@type': 'Brand', name: 'The Heating Store' },
  description:
    'Premium UK-imported electric hamam systems for Kashmir winters, certified safe for wet areas and engineered for sub-zero temperatures.',
  category: 'Heating Equipment',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'INR',
    seller: { '@type': 'Organization', name: 'The Heating Store' },
  },
};

export default function ElectricHamamClient() {
  return (
    <ProductPageTemplate
      productName="Electric Hamam"
      heroTagline="Premium UK-imported electric hamam systems, supplied and installed across Kashmir by The Heating Store."
      heroSubtitle="Engineered for sub-zero Kashmir floors, certified safe for wet areas, and built to retain warmth for 8–10 hours after a power cut."
      whatIsText={
        <p>
          An <strong>electric hamam</strong> is a UK-imported electric underfloor heating system installed beneath the floor surface of your home, bathroom, or commercial space. Thin heating cables or mats are laid on an insulated subfloor and encapsulated in a concrete screed, which acts as thermal mass, absorbing heat and releasing it slowly for hours, even after the power goes off. The result is silent, even warmth across the entire floor, with no radiators, no fans, and no noise.
        </p>
      }
      whyUkImportedText="Every electric hamam we install is sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards. UK heating systems are designed for some of the harshest European winters, making them ideally suited to Kashmir's Chilla Kalan. We don't sell local imitations; we sell the same systems used in European homes for decades, now installed by our Kashmir team. Every unit ships with a 10–25 year manufacturer warranty, a 0.01% fault rate across millions of global installations, and our own Kashmir installation guarantee."
      areasServed={ALL_AREAS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
