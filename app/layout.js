

import { Bebas_Neue, Hanken_Grotesk } from 'next/font/google';
import "./globals.css";
import Footer from "./components/footer";
import AIChatbot from "./components/Chatbot";
import SiteHeader from './components/SiteHeader';
import SiteChrome from './components/SiteChrome';
import SmoothScroll from './components/SmoothScroll';

// Display / headline font — Bebas Neue (Google Fonts, self-hosted at build).
// Tall condensed all-caps gothic; ships a single 400 weight (never faux-bold it).
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
  display: 'swap',
});

// Body / UI font — Hanken Grotesk (Google Fonts, self-hosted at build).
// Clean, readable grotesque that pairs with the condensed gothic headlines.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "Electric Hammam Installation | Premium Underfloor Heating Systems",
    template: "%s | Electric Hammam",
  },
  description:
    "Expert electric hammam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty — terms apply.",
  keywords: [
    "electric hammam installation",
    "underfloor heating India",
    "steam bath installation",
    "luxury heating systems",
    "electric floor heating",
    "hammam system",
    "warm floor installation",
  ],
  authors: [{ name: "Electric Hammam" }],
  creator: "Electric Hammam",
  publisher: "Electric Hammam",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://electrichammam.com",
    siteName: "Electric Hammam",
    title: "Electric Hammam Installation | Premium Underfloor Heating Systems",
    description:
      "Expert electric hammam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Electric Hammam - Premium Underfloor Heating Installation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electric Hammam Installation | Premium Underfloor Heating Systems",
    description:
      "Expert electric hammam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty.",
    images: ["/images/og-default.jpg"],
    creator: "@electrichammam",
  },
  metadataBase: new URL("https://electrichammam.com"),
  alternates: {
    canonical: "https://electrichammam.com",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Electric Hammam",
  url: "https://electrichammam.com",
  logo: {
    "@type": "ImageObject",
    url: "https://electrichammam.com/images/logo.png",
  },
  sameAs: [
    "https://www.facebook.com/electrichammam",
    "https://www.instagram.com/electrichammam",
    "https://www.linkedin.com/company/electrichammam",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9070907035",
    contactType: "customer service",
    availableLanguage: "English",
    areaServed: "IN",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  description:
    "Expert electric hammam and underfloor heating installation across India. Professional installation of imported heating systems with a Kashmir installation warranty.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${bebasNeue.variable} ${hankenGrotesk.variable} antialiased bg-white text-slate-900`}
      >
        <SmoothScroll />
        {/* <Header /> */}
        <SiteHeader/>

        <main className="min-h-screen">
          {children}
          <SiteChrome>
            <AIChatbot />
          </SiteChrome>
        </main>

        <SiteChrome>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
