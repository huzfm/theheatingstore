export const metadata = {
  title: "Home Heating Solutions in Jammu Kashmir | The Heating Store Srinagar",
  description:
    "Looking for home heating solutions in Jammu Kashmir? The Heating Store in Rajbagh, Srinagar offers premium UK-imported heating systems for homes, villas, and apartments across Kashmir. Call 9070907035.",
  keywords: [
    "home heating solutions Kashmir",
    "home heating Srinagar",
    "house heating Kashmir",
    "UK imported home heating",
    "villa heating solutions",
  ],
  openGraph: {
    title: "Home Heating Solutions in Jammu Kashmir | The Heating Store Srinagar",
    description:
      "Premium UK-imported home heating solutions for homes, villas, and apartments across Kashmir.",
  },
};

import HomeHeatingSolutionsClient from './HomeHeatingSolutionsClient';

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
  "description": "Premium UK-imported home heating solutions in Srinagar, Kashmir"
};

export default function HomeHeatingSolutionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHeatingSolutionsClient />
    </>
  );
}
