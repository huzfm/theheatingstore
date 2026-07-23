export const metadata = {
  title: "Underfloor Heating in Jammu Kashmir | UK Imported Systems | The Heating Store",
  description:
    "Looking for underfloor heating in Jammu Kashmir? The Heating Store in Rajbagh, Srinagar supplies and installs premium UK-imported underfloor heating systems designed for Kashmir winters. Call 9070907035.",
  keywords: [
    "underfloor heating Jammu Kashmir",
    "underfloor heating Srinagar",
    "UK imported underfloor heating",
    "heating equipment supplier Kashmir",
    "underfloor heating installation",
  ],
  openGraph: {
    title: "Underfloor Heating in Jammu Kashmir | UK Imported Systems | The Heating Store",
    description:
      "Premium UK-imported underfloor heating systems, supplied and installed across Kashmir by The Heating Store.",
  },
};

import UnderfloorHeatingClient from './UnderfloorHeatingClient';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Underfloor Heating",
  "brand": { "@type": "Brand", "name": "The Heating Store" },
  "description": "Premium UK-imported underfloor heating systems for Kashmir winters",
  "category": "Heating Equipment",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "INR",
    "seller": { "@type": "Organization", "name": "The Heating Store" }
  }
};

export default function UnderfloorHeatingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnderfloorHeatingClient />
    </>
  );
}
