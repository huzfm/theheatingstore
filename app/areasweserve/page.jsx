export const metadata = {
  title: "Areas We Serve in Srinagar | The Heating Store",
  description:
    "The Heating Store supplies and installs premium UK-imported electric hamams across Srinagar. We serve Rajbagh, Jawahar Nagar, Lal Chowk, Sonwar, Gogji Bagh, Dalgate, Bemina, Hyderpora, and more.",
  keywords: [
    "electric hamam Srinagar",
    "areas we serve Srinagar",
    "underfloor heating Srinagar",
    "Rajbagh electric hamam",
    "Lal Chowk heating",
    "Kashmir hamam installation",
  ],
  openGraph: {
    title: "Areas We Serve in Srinagar | The Heating Store",
    description:
      "The Heating Store supplies and installs premium UK-imported electric hamams across Srinagar.",
  },
};

import AreasWeServeClient from './AreasWeServeClient';

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
  "areaServed": [
    "Rajbagh",
    "Jawahar Nagar",
    "Lal Chowk",
    "Sonwar",
    "Gogji Bagh",
    "Dalgate",
    "Bemina",
    "Hyderpora",
    "Sanat Nagar",
    "Chanapora",
    "Rawalpora",
    "Nowgam",
    "Nishat",
    "Hazratbal",
    "Pantha Chowk",
    "Srinagar",
    "Kashmir"
  ]
};

export default function AreasWeServePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AreasWeServeClient />
    </>
  );
}
