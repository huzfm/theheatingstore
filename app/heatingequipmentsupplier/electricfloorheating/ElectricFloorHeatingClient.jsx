'use client';

import ProductPageTemplate from '../../components/ProductPageTemplate';
import { ALL_AREAS } from '../../lib/constants';

const FAQS = [
  {
    q: 'What is electric floor heating and how does it work?',
    a: 'Electric floor heating uses UK-imported heating cables or mats installed beneath the floor surface. The system warms the screed, which then radiates gentle, even heat upward through the floor — delivering silent, room-wide comfort without radiators or fans.',
  },
  {
    q: 'Is electric floor heating suitable for every floor type?',
    a: 'Yes. Our systems work under tile, stone, marble, engineered wood, and laminate flooring. We design the cable spacing and output for your specific floor finish.',
  },
  {
    q: 'How much does electric floor heating cost in Kashmir?',
    a: 'Cost depends on the heated area and the system you choose. We provide a written quotation after a free site survey — call 9070907035 to book one.',
  },
  {
    q: 'How long does installation take?',
    a: 'A single room is usually completed in 1 day. A full-house electric floor heating installation typically takes 1–2 days depending on the number of zones.',
  },
  {
    q: 'What warranty do you offer on electric floor heating?',
    a: 'Every system comes with a 10–25 year manufacturer warranty plus our Kashmir installation guarantee, with full written documentation handed over on completion.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Electric Floor Heating',
  brand: { '@type': 'Brand', name: 'The Heating Store' },
  description:
    'Premium UK-imported electric underfloor heating systems, certified safe for wet areas and engineered for sub-zero Kashmir floors.',
  category: 'Heating Equipment',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'INR',
    seller: { '@type': 'Organization', name: 'The Heating Store' },
  },
};

export default function ElectricFloorHeatingClient() {
  return (
    <ProductPageTemplate
      productName="Electric Floor Heating"
      heroTagline="Premium UK-imported electric floor heating systems, supplied and installed across Kashmir by The Heating Store."
      heroSubtitle="Fast warm-up, even heat, certified safe for wet areas — engineered for sub-zero Kashmir floors."
      whatIsText={
        <p>
          <strong>Electric floor heating</strong> is a UK-imported underfloor heating system that warms the entire floor surface of a room or entire home. Heating cables or mats are installed on an insulated subfloor, then encapsulated in a concrete screed. The screed acts as thermal mass, absorbing heat from the cables and releasing it slowly and evenly across the floor. The result is silent, draft-free warmth with no radiators, no fans, and 8–10 hour heat retention after a power cut.
        </p>
      }
      whyUkImportedText="Our electric floor heating systems are sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards. UK heating systems are engineered for some of the harshest European winters, making them ideally suited to Kashmir's sub-zero floors. We don't sell local imitations — we sell the same systems used in European homes for decades, installed by our Kashmir team. Every system ships with a 10–25 year manufacturer warranty, a 0.01% fault rate across millions of global installations, and our Kashmir installation guarantee."
      areasServed={ALL_AREAS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
