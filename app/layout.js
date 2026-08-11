

import { Bebas_Neue, Hanken_Grotesk } from 'next/font/google';
import "./globals.css";
import Footer from "./components/footer";
import AIChatbot from "./components/Chatbot";
import SiteHeader from './components/SiteHeader';
import SiteChrome from './components/SiteChrome';
import SmoothScroll from './components/SmoothScroll';
import facts from '@/content/facts';
import JsonLd from '@/components/seo/JsonLd';
import { localBusiness } from '@/components/seo/schema';

// Display / headline font, Bebas Neue (Google Fonts, self-hosted at build).
// Tall condensed all-caps gothic; ships a single 400 weight (never faux-bold it).
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
  display: 'swap',
});

// Body / UI font, Hanken Grotesk (Google Fonts, self-hosted at build).
// Clean, readable grotesque that pairs with the condensed gothic headlines.
// 800 is loaded only for the hero's closing-shot heading, which needs a real
// extra-bold rather than the browser synthesising one from 700.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "The Heating Store | Underfloor Heating & Electric Hamam Installation in Kashmir",
    template: "%s | The Heating Store",
  },
  description:
    "Expert electric hamam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty, terms apply.",
  // `keywords` deliberately removed here and on every route. Google has
  // ignored the meta keywords tag since 2009, and this list was inherited by
  // 55 pages while containing "steam bath installation", a Turkish steam room
  // rather than the heated Kashmiri floor this company actually sells.
  authors: [{ name: "The Heating Store" }],
  creator: "The Heating Store",
  publisher: "The Heating Store",
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
    url: "https://theheatingstore.in",
    siteName: "The Heating Store",
    title: "The Heating Store | Underfloor Heating & Electric Hamam Installation in Kashmir",
    description:
      "Expert electric hamam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty.",
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "The Heating Store - Premium Underfloor Heating Installation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Heating Store | Underfloor Heating & Electric Hamam Installation in Kashmir",
    description:
      "Expert electric hamam and underfloor heating installation across India. Professional installation, imported systems, and Kashmir installation warranty.",
    images: ["/og/default.jpg"],
    creator: "@theheatingstore",
  },
  metadataBase: new URL("https://theheatingstore.in"),
};

/**
 * The company, emitted once here so every page carries it.
 *
 * Replaces a hand-written `Organization` block that had three problems: its
 * logo URL (/images/logo.png) did not exist, its `sameAs` listed a Facebook
 * and a LinkedIn profile neither of which was confirmed to be real, and it
 * declared `areaServed: Country "India"` for a business whose whole case is
 * that it is the Srinagar team who turn up.
 *
 * LocalBusiness rather than Organization: this has a showroom, opening hours
 * and a service area, and LocalBusiness is the type Google reads for the local
 * pack. Built from content/facts.ts, so it cannot drift from the page copy.
 */
const businessSchema = localBusiness();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <JsonLd id="ld-business" data={businessSchema} />
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
            {/* <AIChatbot /> */}
          </SiteChrome>
        </main>

        {/* The footer was hidden on /product, /brands/*, /installation,
            /why-choose-us and /contact, which is nine routes with no footer
            at all, including four of the five most commercially important
            pages on the site. Those routes now render it like everything
            else.

            /experience keeps its exclusion: that subtree ships its own dark
            full-page chrome including its own footer, and rendering both
            would put two footers on one document.

            /landing is excluded too, for a different reason. It is the paid
            traffic destination, and the site footer's four columns are about
            twenty links out of it, sitting immediately under the closing CTA.
            Every one of them is a way for a click someone paid for to leave
            without filling in the form. It ships its own single-line footer
            instead, which is also why SiteHeader already suppresses the global
            nav on that route. */}
        <SiteChrome hidePrefixes={['/experience']} hideRoutes={['/landing']}>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
