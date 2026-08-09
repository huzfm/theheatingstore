import { OG_IMAGE } from '@/app/lib/seo';

/**
 * NOT routed through content/page-meta.ts on purpose.
 *
 * /hero is a legacy WebGL demo of the homepage hero. It has zero inbound
 * links, duplicates the homepage's intent, and is still listed in the sitemap.
 * It is flagged for `noindex` plus removal from the sitemap, which is a
 * decision for the site owner, so its copy is left exactly as authored and
 * only the two site-wide Phase 2 rules are applied here: no `keywords`, and a
 * self-referencing canonical.
 */
export const metadata = {
  title: {
    absolute: "Electric Hamam Installation | Premium Underfloor Heating Systems",
  },
  description:
    "Expert electric hamam and underfloor heating installation for homes, villas, and luxury spaces in Kashmir. Professional installation using imported systems with lifetime warranty.",
  alternates: { canonical: '/hero' },
  openGraph: {
    title: "Electric Hamam Installation | Premium Underfloor Heating Systems",
    description:
      "Expert electric hamam and underfloor heating installation for homes, villas, and luxury spaces in Kashmir.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Electric Hamam Installation | Premium Underfloor Heating",
    description: 'A scroll-driven look at the floor build-up beneath an electric hamam.',
    images: [OG_IMAGE],
  },
};

import HeroClient from './HeroClient';

export default function HeroUnderfloorPremiumOrange() {
  return <HeroClient />;
}
