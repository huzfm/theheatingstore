export const metadata = {
  title: "Commercial Heating Systems in Jammu Kashmir | The Heating Store Srinagar",
  description:
    "Looking for commercial heating systems in Jammu Kashmir? The Heating Store in Rajbagh, Srinagar supplies and installs premium UK-imported heating systems for hotels, offices, guest houses, and commercial properties. Call 9070907035.",
  keywords: [
    "commercial heating systems Kashmir",
    "hotel heating Srinagar",
    "commercial heating Srinagar",
    "guest house heating Kashmir",
    "office heating solutions",
  ],
  openGraph: {
    title: "Commercial Heating Systems in Jammu Kashmir | The Heating Store Srinagar",
    description:
      "Premium UK-imported commercial heating systems for hotels, offices, and commercial properties in Kashmir.",
  },
};

import CommercialHeatingSystemsClient from './CommercialHeatingSystemsClient';

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
  "description": "Premium UK-imported commercial heating systems supplier in Srinagar, Kashmir"
};

export default function CommercialHeatingSystemsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CommercialHeatingSystemsClient />
    </>
  );
}
