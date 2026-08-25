/**
 * schema.org builders. Every value comes from content/facts.ts.
 *
 * The rule this file exists to enforce: structured data is never authored by
 * hand next to the copy it describes. Before this, the homepage carried a
 * hand-written FAQPage with six questions while the visible accordion below it
 * held thirty-one different ones, and the markup claimed the company served
 * "Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata" and
 * partnered with Heatmiser, Salus, EPH and Nuheat, four brands that appear
 * nowhere in brandsData.js. Markup and page had drifted so far apart they
 * described different businesses.
 *
 * Deliberately absent from every builder here: AggregateRating and Review.
 * There are no verified reviews. Self-serving review markup on your own
 * organisation has not been eligible for rich results for years and carries a
 * manual-action risk that dwarfs any upside.
 */

import facts from '@/content/facts';

/** Stable node ids, so blocks on different pages reference one entity. */
export const BUSINESS_ID = `${facts.url}/#business`;
export const WEBSITE_ID = `${facts.url}/#website`;

/**
 * The company. Emitted once, from the root layout, so every page carries it.
 *
 * Typed as LocalBusiness rather than Organization: this is a business with a
 * showroom, opening hours and a service area, and LocalBusiness is what Google
 * reads for the local pack. The previous Organization block had none of that.
 */
export function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: facts.name,
    url: facts.url,
    description:
      'Electric hamam and underfloor heating supply and installation across Kashmir. UK-imported systems, certified for wet areas, installed by a Srinagar-based team.',
    logo: {
      '@type': 'ImageObject',
      url: `${facts.url}/final.png`,
    },
    image: `${facts.url}/og/default.jpg`,
    telephone: facts.phone,
    email: facts.email,
    foundingDate: String(facts.foundedYear),
    priceRange: facts.priceRange,

    address: {
      '@type': 'PostalAddress',
      ...facts.address,
    },

    // Emitted only when content/facts.ts carries real coordinates. See the note
    // there: a geo pin on the wrong building is worse than no geo pin.
    ...(facts.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: facts.geo.latitude,
            longitude: facts.geo.longitude,
          },
        }
      : {}),

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...facts.hours.days],
        opens: facts.hours.opens,
        closes: facts.hours.closes,
      },
    ],

    // The districts actually served, not "India". The old markup claimed the
    // whole country, which is a weaker signal than six real districts.
    areaServed: facts.serviceAreas.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: facts.phone,
        email: facts.email,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Urdu', 'Kashmiri'],
      },
    ],

    sameAs: [...facts.sameAs],
  };
}

/**
 * FAQPage, built from the SAME array the accordion renders.
 *
 * @param {Array<{q: string, a: string}>} faqs
 */
export function faqPage(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** The installation service itself, for /installation. */
export function installationService() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Electric Hamam Installation',
    name: 'Electric Hamam Installation',
    description:
      'Supply and installation of electric hamam underfloor heating: site survey, insulation, screed, cable layout, thermostat commissioning and warranty registration.',
    provider: { '@id': BUSINESS_ID },
    areaServed: facts.serviceAreas.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    // No `offers` block: prices vary per site survey and quoting a figure in
    // markup that the quote does not match is worse than quoting none.
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${facts.url}/contact`,
      servicePhone: { '@type': 'ContactPoint', telephone: facts.phone },
    },
  };
}

/**
 * A service this company sells, for the /heatingequipmentsupplier pages.
 *
 * These pages previously declared `Product` with an `Offer` carrying
 * `priceCurrency: "INR"` and `availability: InStock` but NO `price`. That
 * combination is invalid: Google requires a price (or a priceSpecification)
 * on any Offer, so the blocks failed validation and earned nothing. They also
 * described a fitted installation as a boxed product with stock levels.
 *
 * Service with no `offers` is the honest shape. Pricing genuinely depends on
 * the site survey, and markup that quotes a figure the quote will not match is
 * worse than markup that quotes none.
 *
 * @param {{name: string, description: string, serviceType?: string}} spec
 */
export function service({ name, description, serviceType }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: serviceType || name,
    description,
    provider: { '@id': BUSINESS_ID },
    areaServed: facts.serviceAreas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area,
    })),
  };
}

/**
 * BreadcrumbList.
 *
 * @param {Array<{name: string, path: string}>} trail
 *   Ordered, root first. `path` is site-relative, e.g. '/brands'.
 */
export function breadcrumbList(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${facts.url}${path === '/' ? '' : path}`,
    })),
  };
}

/**
 * A neighbourhood page's LocalBusiness, scoped to the areas it covers.
 *
 * Every one of the 15 area pages already built an object like this and passed
 * it to AreaPageTemplate as a `jsonLd` prop. The template destructured the prop
 * and never rendered it, so all 15 were silently discarded. This is that data,
 * built once and actually emitted.
 *
 * @param {string} areaName
 * @param {string[]} covers  Nearby areas this page also serves.
 */
export function areaBusiness(areaName, covers = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: facts.name,
    url: facts.url,
    telephone: facts.phone,
    email: facts.email,
    priceRange: facts.priceRange,
    address: { '@type': 'PostalAddress', ...facts.address },
    areaServed: [areaName, ...covers].map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
  };
}
