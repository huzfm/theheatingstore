/**
 * SINGLE SOURCE OF TRUTH for every company fact the site states about itself.
 *
 * Before this file existed the site contradicted itself in public: the homepage
 * hero claimed 5,000 installations while /about claimed 6,000; the installation
 * warranty was stated as 5, 10, 25 and "lifetime" years on four different
 * pages; heat retention was 8-10, 6-10 and 6-8 hours depending on the route;
 * and /contact published an @electrichamam.in address while the footer and the
 * LocalBusiness schema published @theheatingstore.in.
 *
 * RULE: nothing in this file may be duplicated as a literal anywhere else.
 * If a number or a contact detail appears in a component, it imports it here.
 * If a fact changes, it changes once, in this file.
 *
 * ── PROVENANCE ────────────────────────────────────────────────────────────
 * Values below were supplied by the site owner on 2026-08-09, resolving each
 * contradiction found in the Phase 0 SEO audit. Two figures are owner-supplied
 * claims that could not be corroborated anywhere in this repository and are
 * NOT independently verified, they are flagged inline and are carried in
 * SEO-REPORT.md under "requires human verification":
 *
 *   - installationsWorldwide (2,000,000)
 *   - installationsLocal     (550,000)
 *
 * `foundedYear` and the phone number were already unanimous across the
 * codebase and were carried forward unchanged.
 */

/** Something the site states about itself, with the string it renders as. */
type Figure = {
  /** Raw number, for counters, schema.org and any arithmetic. */
  readonly value: number;
  /** Exactly how it is written in prose and on stat cards. */
  readonly display: string;
};

const FOUNDED_YEAR = 2011;

export const facts = Object.freeze({
  /* ── IDENTITY ─────────────────────────────────────────────────────────── */

  /** Legal / display name. Never "TheHeatingStore" as one word in prose. */
  name: 'The Heating Store',
  url: 'https://theheatingstore.in',

  /**
   * The product, spelled the Kashmiri way, with one m.
   *
   * "hammam" is the Turkish/Arabic steam bath. What this company installs is a
   * heated floor, which in Kashmir is a hamam. The two spellings target
   * different search intent, and the site previously used "hammam" in the
   * site-wide <title> and twitter:description while using "hamam" in ~500
   * other places. One spelling, everywhere: hamam.
   */
  productNoun: 'electric hamam',

  foundedYear: FOUNDED_YEAR,

  /* ── SCALE ────────────────────────────────────────────────────────────── */

  /**
   * Installations completed in Kashmir and India.
   * Renders on the homepage hero stat card.
   * NOT INDEPENDENTLY VERIFIED, owner-supplied.
   */
  installationsLocal: Object.freeze<Figure>({
    value: 550_000,
    display: '550,000+',
  }),

  /**
   * Installations completed worldwide.
   * Renders on the /about counter band, labelled so it cannot be read as the
   * local figure.
   * NOT INDEPENDENTLY VERIFIED, owner-supplied.
   */
  installationsWorldwide: Object.freeze<Figure>({
    value: 2_000_000,
    display: '2,000,000+',
  }),

  /** Label that must accompany `installationsWorldwide` wherever it appears. */
  installationsWorldwideLabel: 'Installations worldwide',

  /* ── WARRANTY ─────────────────────────────────────────────────────────── */

  /**
   * OUR OWN installation warranty. Flat lifetime, no registration term.
   *
   * This is deliberately NOT a number. The site previously ran a 10-year
   * registration guarantee alongside a lifetime warranty alongside a "25 yr
   * as standard" counter, and the counter is what forced 25 into being a
   * number in the first place.
   *
   * Manufacturer warranties are a different fact and are NOT covered here:
   * ProWarm Lifetime, Warmup Limited Lifetime, ThermoSphere Lifetime,
   * AmberHeat 15-Year, nVent 20-Year, FastWarm 25-50 Year. Those are
   * per-brand, legitimately different from each other, and live in
   * app/lib/brandsData.js where they belong.
   */
  installationWarranty: 'Lifetime',

  /* ── PERFORMANCE ──────────────────────────────────────────────────────── */

  /**
   * How long the screed holds usable warmth after the power goes out. This is
   * the single most repeated claim on the site (27 correct occurrences before
   * this file, plus six that disagreed with them).
   */
  heatRetention: Object.freeze({
    minHours: 8,
    maxHours: 10,
    /** En dash, matching the 27 occurrences that were already correct. */
    display: '8–10',
    /** For prose: "retains heat for 8–10 hours after a power cut". */
    hours: '8–10 hours',
    /** For stat cards, which are tight on width. */
    hrsShort: '8–10 hrs',
  }),

  /* ── CONTACT ──────────────────────────────────────────────────────────── */

  /** E.164, for tel: links and schema.org telephone. */
  phone: '+919070907035',
  /** Grouped for reading, for anything a human sees. */
  phoneDisplay: '+91 90709 07035',
  whatsapp: 'https://wa.me/919070907035',

  /**
   * The only email address the site publishes.
   *
   * support@electrichamam.in and trade@electrichamam.in were removed: a
   * second domain on the contact page undermines every trust signal the rest
   * of the site is trying to build, and neither address matched the
   * LocalBusiness schema.
   */
  email: 'info@theheatingstore.in',

  /* ── PLACE ────────────────────────────────────────────────────────────── */

  /**
   * The showroom and technical office, as schema.org PostalAddress fields.
   *
   * The site previously stated two different addresses: the homepage
   * LocalBusiness said Lal Chowk / 190001, while all 15 area pages and the
   * /areasweserve schema said Rajbagh / 190008, and AreaPageTemplate told
   * visitors in prose to "visit our Rajbagh showroom". Rajbagh is correct,
   * confirmed by the site owner on 2026-08-09.
   */
  address: Object.freeze({
    streetAddress: 'Rajbagh',
    addressLocality: 'Srinagar',
    addressRegion: 'Jammu and Kashmir',
    postalCode: '190008',
    addressCountry: 'IN',
  }),

  /**
   * Deliberately NO `geo` block.
   *
   * The homepage carried latitude 34.0836 / longitude 74.7973, which is Lal
   * Chowk, roughly 3km from the actual Rajbagh showroom. A GeoCoordinates
   * pointing at the wrong building is worse than none: it is the coordinate
   * Google trusts for "near me" distance ranking, and it competes with the
   * pin on the Google Business Profile.
   *
   * To add it: open Google Maps, right-click the showroom door, click the
   * lat/long to copy it, and put the pair here as `geo: { latitude, longitude }`.
   * components/seo/schema.js already emits the block when this exists.
   */

  /** schema.org priceRange. Rupees, not dollars: this is an Indian business. */
  priceRange: '₹₹',

  /**
   * Profiles that actually exist, for schema.org sameAs.
   *
   * Facebook and LinkedIn were previously listed in the Organization schema.
   * Neither was confirmed as a real profile, and a sameAs pointing at a page
   * that does not exist weakens the entity it is supposed to corroborate, so
   * both are gone. WhatsApp is live but is a chat link, not a profile page,
   * so it belongs in contactPoint rather than sameAs.
   */
  sameAs: Object.freeze([
    'https://www.instagram.com/theheatingstore',
  ]),

  /* ── SHOWROOM ─────────────────────────────────────────────────────────── */

  /**
   * Opening hours. /contact previously stated two different sets in the same
   * file (Mon-Sat 9am-7pm on the call card, Sat-Thu 10am-6pm on the showroom
   * block) and the homepage schema stated a third (Mon-Sat 09:00-18:00).
   */
  hours: Object.freeze({
    /** schema.org dayOfWeek values. */
    days: Object.freeze(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    /** ISO times, for openingHoursSpecification. */
    opens: '09:00',
    closes: '19:00',
    /** Sentence form, for prose. */
    display: 'Monday to Saturday, 9am to 7pm',
    /** Compact form, for notes under a contact card. */
    short: 'Mon–Sat, 9am–7pm',
  }),

  /* ── COVERAGE ─────────────────────────────────────────────────────────── */

  /**
   * Districts served, for schema.org areaServed and for prose that lists them.
   * The 15 Srinagar neighbourhood pages are a finer-grained list and live in
   * app/lib/constants.js, ALL_AREAS.
   */
  serviceAreas: Object.freeze([
    'Srinagar',
    'Budgam',
    'Ganderbal',
    'Anantnag',
    'Baramulla',
    'Pulwama',
  ]),
});

/* ── DERIVED ────────────────────────────────────────────────────────────── */

/**
 * Years in business, computed rather than authored.
 *
 * /about hardcoded "14+" and /about's own metadata said "Over 15 years", so
 * the page disagreed with its own <meta name="description">. Computing it
 * means it is right this year and every year after, with no one having to
 * remember to bump it.
 */
export function yearsInBusiness(now: Date = new Date()): number {
  return now.getFullYear() - FOUNDED_YEAR;
}

/**
 * The copyright year. The footer rendered "© 2011", which is the founding
 * year, not the current one.
 */
export function currentYear(now: Date = new Date()): number {
  return now.getFullYear();
}

/* ── CONVENIENCE RE-EXPORTS ─────────────────────────────────────────────── */
/* Named exports for the values imported most often, so call sites read as
   `PHONE` rather than `facts.phone` in files that use one field. */

export const PHONE = facts.phone;
export const PHONE_DISPLAY = facts.phoneDisplay;
export const WHATSAPP = facts.whatsapp;
export const EMAIL = facts.email;
export const FOUNDED = facts.foundedYear;
export const WARRANTY = facts.installationWarranty;
export const HEAT_RETENTION = facts.heatRetention;

export default facts;
