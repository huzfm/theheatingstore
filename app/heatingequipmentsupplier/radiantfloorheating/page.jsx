export const metadata = {
  title: "Radiant Floor Heating in Jammu Kashmir | The Heating Store Srinagar",
  description:
    "Looking for radiant floor heating in Jammu Kashmir? The Heating Store in Rajbagh, Srinagar supplies premium UK-imported radiant floor heating systems for homes, hotels, and commercial properties. Call 9070907035.",
  keywords: [
    "radiant floor heating Jammu Kashmir",
    "radiant heating Srinagar",
    "UK imported radiant heating",
    "radiant floor heating installation",
    "heating equipment supplier Kashmir",
  ],
  openGraph: {
    title: "Radiant Floor Heating in Jammu Kashmir | The Heating Store Srinagar",
    description:
      "Premium UK-imported radiant floor heating systems, supplied and installed across Kashmir by The Heating Store.",
  },
};

import RadiantFloorHeatingClient from './RadiantFloorHeatingClient';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Radiant Floor Heating",
  "brand": { "@type": "Brand", "name": "The Heating Store" },
  "description": "Premium UK-imported radiant floor heating systems for Kashmir winters",
  "category": "Heating Equipment",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "INR",
    "seller": { "@type": "Organization", "name": "The Heating Store" }
  }
};

export default function RadiantFloorHeatingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RadiantFloorHeatingClient />
    </>
  );
}
