import { pageMetadata } from '@/app/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbList } from '@/components/seo/schema';
import WhyChooseUsClient from './WhyChooseUsClient';
import { NETWORK, COUNTRIES } from '@/components/sections/WhyUs/data';

const SITE_URL = 'https://theheatingstore.in';

/**
 * The canonical "why buy this from us" page, and now the only one.
 *
 * It absorbed /local-experience and /global-experience, so the metadata has to
 * carry all three intents without turning into a keyword list: the guarantee
 * terms this URL already ranked for, the Kashmir/town terms /local-experience
 * held, and the certification/manual terms /global-experience held. Both of
 * those URLs 301 here (next.config.mjs).
 */
export const metadata = pageMetadata("/why-choose-us");

/**
 * Structured data is built from the same constants the page renders, so the
 * markup cannot drift from the copy.
 *
 * Deliberately absent: Review and AggregateRating. The three testimonials are
 * real and attributed, but self-serving reviews on your own organisation have
 * not been eligible for rich results for years and marking them up is a
 * manual-action risk rather than an SEO win.
 */
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  // Same @id as the site-wide LocalBusiness in the root layout, so this block
  // ADDS its 17-town areaServed to that one entity instead of declaring a
  // second business at the same address.
  '@id': `${SITE_URL}/#business`,
  name: 'The Heating Store',
  url: `${SITE_URL}/why-choose-us`,
  description:
    'Electric hamam and underfloor heating supply and installation across Kashmir and India, to internationally certified standards.',
  foundingDate: '2011',
  areaServed: NETWORK.regions.flatMap((r) =>
    r.places.map((place) => ({ '@type': 'City', name: place }))
  ),
  /* The countries the systems we supply are installed in, which is a different
     claim from areaServed and is why it is `knowsAbout` rather than a second
     service area. */
  knowsAbout: COUNTRIES.list.map((c) => `Underfloor heating standards, ${c.name}`),
  slogan: 'Proven in nine countries. Answered from Srinagar.',
};

const breadcrumbSchema = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'Why Choose Us', path: '/why-choose-us' },
]);

export default function WhyChooseUs() {
  return (
    <>
      <JsonLd
        id="ld-why-choose-us"
        data={[serviceSchema, breadcrumbSchema]}
      />
      <WhyChooseUsClient />
    </>
  );
}
