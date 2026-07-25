// export const metadata = {
//   title: "Electric Hammam Installation | Premium Underfloor Heating Systems in India",
//   description:
//     "Expert electric hammam and underfloor heating installation across India. Professional installation of imported heating systems with Kashmir installation warranty. Serving homes, villas, hotels, and luxury spas.",
//   keywords: [
//     "electric hammam installation India",
//     "underfloor heating",
//     "premium floor heating systems",
//     "luxury steam bath installation",
//     "hammam systems India",
//     "warm floor installation",
//   ],
//   openGraph: {
//     title: "Electric Hammam Installation | Premium Underfloor Heating Systems in India",
//     description:
//       "Expert electric hammam and underfloor heating installation across India with Kashmir installation warranty.",
//     type: "website",
//     images: ["/images/electric.png"],
//   },
// };

// app/page.jsx — top of file, before the component
export const metadata = {
  title: "Underfloor Heating Installation in Kashmir | TheHeatingStore",
  description: "Kashmir's trusted underfloor heating specialists. Free site visits, expert installation, 5-year warranty. Electric & water underfloor heating, insulation, and smart thermostats.",
  openGraph: {
    title: "TheHeatingStore — Underfloor Heating Installation in Kashmir",
    description: "Kashmir's trusted underfloor heating specialists. Free site visits, expert installation, 5-year warranty.",
    images: ["https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheHeatingStore — Underfloor Heating Installation in Kashmir",
    description: "Kashmir's trusted underfloor heating specialists. Free site visits, expert installation, 5-year warranty.",
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://theheatingstore.in/#business",
  name: "The Heating Store",
  description:
    "Expert electric hammam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty.",
  url: "https://theheatingstore.in",
  telephone: "+91-9070907035",
  email: "info@theheatingstore.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lal Chowk",
    addressLocality: "Srinagar",
    addressRegion: "Jammu and Kashmir",
    postalCode: "190001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "34.0836",
    longitude: "74.7973",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  serviceType: [
    "Electric Hammam Installation",
    "Underfloor Heating Installation",
    "Thermostat Setup",
    "Warranty Verification",
  ],
  sameAs: [
    "https://www.facebook.com/theheatingstore",
    "https://www.instagram.com/theheatingstore",
    "https://www.linkedin.com/company/theheatingstore",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an electric hammam and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An electric hammam is a steam-free electric floor heating system installed beneath the floor surface. It uses electric heating cables or mats to generate warmth that radiates evenly across the floor, providing comfortable ambient heating without steam. It is commonly used for luxury bathrooms, spas, and living spaces.",
      },
    },
    {
      "@type": "Question",
      name: "How long does an electric hammam installation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical residential electric hammam installation takes 2 to 5 days depending on the site conditions, floor area, and whether it is a new construction or retrofit. The process includes site survey, floor preparation, heating element placement, thermostat wiring, and commissioning.",
      },
    },
    {
      "@type": "Question",
      name: "What areas of India do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Electric Hammam provides installation services across all major cities and regions in India including Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, and other metro and tier-2 cities. Site surveys and consultations are available nationwide.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer a warranty on installations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Electric Hammam provides a warranty valid for Kashmir installation — terms apply. The warranty covers Kashmir-specific installation conditions, heating elements, thermostat controllers, and installation workmanship. You can verify your warranty status using our online warranty check tool.",
      },
    },
    {
      "@type": "Question",
      name: "What brands of underfloor heating do you install?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We partner with globally trusted brands including Prowarm, Heatmiser, Warmup, Salus, EPH, and Nuheat. Our portfolio covers electric mat systems, water-based UFH, smart thermostats, and commercial-grade heating solutions.",
      },
    },
    {
      "@type": "Question",
      name: "Can electric hammam be installed in existing homes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, electric hammam systems can be retrofitted into existing homes. The installation is typically done by removing the existing floor finish, installing the heating layer, and laying a new floor surface on top. Our team conducts a thorough site survey to determine the best approach.",
      },
    },
  ],
};

import HomePage from "./components/home";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage />
    </>
  );
}
