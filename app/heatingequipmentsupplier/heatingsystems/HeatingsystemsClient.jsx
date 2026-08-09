'use client';

import { service } from '@/components/seo/schema';

import ProductPageTemplate from '../../components/ProductPageTemplate';
import { ALL_AREAS } from '../../lib/constants';

const FAQS = [
  {
    q: 'What types of heating systems do you supply?',
    a: 'We supply and install the full range of UK-imported heating systems, electric hamams, electric underfloor heating, and commercial-grade zoned solutions. Every system is matched to your space, usage, and Kashmir climate.',
  },
  {
    q: 'Do you handle commercial and large-scale installations?',
    a: 'Yes. We design and install heating systems for hotels, offices, schools, hospitals, and residential developments across Kashmir, including zoned thermostats for multi-room control.',
  },
  {
    q: 'How much do your heating systems cost in Kashmir?',
    a: 'Cost depends on the system type, area, and installation complexity. We provide a written quotation after a free site survey, call 9070907035 to book one.',
  },
  {
    q: 'How long does a typical installation take?',
    a: 'A residential system is typically completed in 1–2 days. Larger commercial projects are scheduled on a project basis with a written timeline provided upfront.',
  },
  {
    q: 'What warranty and after-service do you offer?',
    a: 'Every heating system we install comes with a 10–25 year manufacturer warranty, our Kashmir installation guarantee, and a free post-installation thermal check. After-service is available on call.',
  },
];

/* Was a Product with an Offer that had priceCurrency and availability but
   no price, which is invalid, and it was never rendered anyway. This is a
   fitted service, not a boxed product with stock. */
const JSON_LD = service({
  name: "Heating System Supply and Installation",
  description:
    "UK-imported heating systems for Kashmir homes, hotels and commercial spaces, certified to CE and IEC 60335 and fitted by our Srinagar team.",
});

export default function HeatingsystemsClient() {
  return (
    <ProductPageTemplate
      productName="Heating Systems"
      heroTagline="Complete UK-imported heating systems for homes, hotels, and commercial spaces, supplied and installed across Kashmir by The Heating Store."
      heroSubtitle="From electric hamams and underfloor heating to commercial-grade zoned solutions, every system is UK-imported, certified, and backed by our Kashmir installation guarantee."
      whatIsText={
        <p>
          <strong>Heating systems</strong> from The Heating Store cover the full spectrum of UK-imported electric underfloor heating, from compact bathroom hamams and whole-home underfloor heating, to zoned commercial solutions for hotels, offices, and large residential developments. Every system is designed around your space, your usage, and Kashmir's sub-zero winter climate. Our Kashmir-based team handles every project from initial site survey and custom design to professional installation, commissioning, and warranty registration.
        </p>
      }
      whyUkImportedText="Every heating system we install is sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards. UK heating systems are engineered for some of the harshest European winters, making them ideally suited to Kashmir's Chilla Kalan. We don't sell local imitations, we sell the same systems used in European homes and commercial buildings for decades, now installed by our Kashmir team. Every system ships with a 10–25 year manufacturer warranty, a 0.01% fault rate across millions of global installations, and our own Kashmir installation guarantee."
      areasServed={ALL_AREAS}
      faqs={FAQS}
      jsonLd={JSON_LD}
    />
  );
}
