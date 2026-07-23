export const metadata = {
  title: "Heating Equipment Supplier in Srinagar | The Heating Store Kashmir",
  description:
    "The Heating Store is a leading heating equipment supplier in Srinagar, Kashmir. We supply and install electric hamam, underfloor heating, radiant floor heating, and home & commercial heating solutions. Call 9070907035.",
  keywords: [
    "heating equipment supplier Srinagar",
    "heating equipment Kashmir",
    "electric hamam supplier",
    "underfloor heating Srinagar",
    "radiant floor heating Kashmir",
    "commercial heating systems Kashmir",
  ],
  openGraph: {
    title: "Heating Equipment Supplier in Srinagar | The Heating Store Kashmir",
    description:
      "Premium UK-imported heating equipment supplier in Srinagar, Kashmir. Electric hamams, underfloor heating, and complete heating solutions.",
  },
};

import HeatingEquipmentClient from './HeatingEquipmentClient';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "The Heating Store",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rajbagh",
    "addressLocality": "Srinagar",
    "addressRegion": "Jammu and Kashmir",
    "postalCode": "190008",
    "addressCountry": "IN"
  },
  "telephone": "+919070907035",
  "description": "Premium UK-imported heating equipment supplier in Srinagar, Kashmir"
};

export default function HeatingEquipmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeatingEquipmentClient />
    </>
  );
}
