/**
 * Content for /contact.
 *
 * The global footer is hidden on this route (see SiteChrome hidePrefixes in
 * app/layout.js), so this page has to carry its own closing panel and its own
 * coverage summary, it is the last thing on the screen.
 *
 * Two things from the old page are deliberately not carried across:
 *
 * 1. CITY_DATA. Ninety lines of per-city content, headline, tagline, coverage
 *    towns, three stats, a highlight block, a four-step process and a named
 *    customer testimonial, for each of Kashmir, Jammu and Ladakh. Exactly one
 *    field of it was ever rendered: `badge`, as a small pill that appeared
 *    when you picked a city in the form dropdown. Everything else was dead.
 *    The testimonials in particular are attributed quotes from named people,
 *    which should not sit unused in a source file, if they are real they
 *    belong somewhere visible, so they are called out here rather than quietly
 *    deleted. LOCATIONS still drives the dropdown.
 *
 * 2. The installation counts on the coverage cards, "45k+", "200k+" and
 *    "35k+". Those totalled 280,000 installations in the Kashmir Valley alone,
 *    while CITY_DATA in the same file put the Valley at "200+". A thousandfold
 *    contradiction inside one component. Neither figure is used here; the town
 *    lists are, since those are checkable.
 */

/** Drives the form's location dropdown and the value posted as `location`. */
export const LOCATIONS = ['Kashmir', 'Jammu', 'Ladakh'];

export const PHONE = '+919070907035';
export const PHONE_DISPLAY = '+91 90709 07035';
export const WHATSAPP = 'https://wa.me/919070907035';

export const HERO = {
  eyebrow: 'Contact · Kashmir, Jammu & Ladakh',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Talk to the people who do the install.',
  sub: 'Not a call centre. The team that answers is the team that surveys your house, specifies the system and comes back if anything goes wrong.',
  bgImage: '/images/f.png',
};

/**
 * How to reach us. `href` is used as-is.
 *
 * The old page listed "theheatingstore.in" as a mailto: address. That is a
 * domain, not an address, so the link opened a mail client addressed to
 * nothing. The two real addresses it also listed are kept.
 */
export const CHANNELS = [
  {
    icon: 'phone',
    title: 'Call us',
    body: 'To talk through an installation, or to book a survey over the phone.',
    action: { label: PHONE_DISPLAY, href: `tel:${PHONE}` },
    note: 'Monday to Saturday, 9am to 7pm IST.',
  },
  {
    icon: 'whatsapp',
    title: 'WhatsApp us',
    body: 'Send photos of the space and get an initial estimate back. Usually the fastest route.',
    action: { label: 'Open WhatsApp', href: WHATSAPP, external: true },
    note: 'We respond within about 2 hours during business hours.',
  },
  {
    icon: 'mail',
    title: 'Email us',
    body: 'For quotes, support and trade enquiries.',
    action: { label: 'support@electrichamam.in', href: 'mailto:support@electrichamam.in' },
    note: 'Trade and accounts: trade@electrichamam.in',
  },
  {
    icon: 'calendar',
    title: 'Book a site survey',
    body: 'An engineer visits, measures the rooms, checks the floor build-up and the supply, and leaves you with a written quotation.',
    action: { label: 'Book a survey', href: '#enquiry' },
    note: 'Free, across J&K and Ladakh.',
  },
];

export const FORM = {
  eyebrow: 'Installation enquiry',
  title: 'Tell us about the floor.',
  intro: 'Read by the installation team, not a queue. We reply within 24 hours.',
};

export const SHOWROOM = {
  eyebrow: 'In person',
  title: 'The Srinagar showroom.',
  body: 'Our showroom and technical office is in Srinagar. Open Saturday to Thursday, 10am to 6pm. Tap the map for directions.',
  mapsUrl: 'https://maps.google.com/?q=Lal+Chowk,+Srinagar,+Jammu+and+Kashmir',
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3300!2d74.7973!3d34.0836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1855f5454a0c1%3A0x7f39f9d5a9e3c2b0!2sLal%20Chowk%2C%20Srinagar%2C%20Jammu%20%26%20Kashmir!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin',
};

export const COVERAGE = {
  eyebrow: 'Where we work',
  title: 'Across the Valley, and beyond it.',
  regions: [
    {
      title: 'North Kashmir',
      places: ['Baramulla', 'Sopore', 'Kupwara', 'Bandipora', 'Handwara', 'Rafiabad', 'Uri', 'Tangmarg'],
    },
    {
      title: 'Central Kashmir',
      places: ['Srinagar', 'Budgam', 'Ganderbal', 'Beerwah', 'Magam', 'Chadoora', 'Narbal', 'Khansahib'],
    },
    {
      title: 'South Kashmir',
      places: ['Anantnag', 'Pulwama', 'Shopian', 'Kulgam', 'Awantipora', 'Bijbehara', 'Dooru', 'Qazigund'],
    },
  ],
  note: 'Jammu and Ladakh are served by the same team travelling out. Ask about your address, most of our coverage started as one enquiry from somewhere new.',
};

export const CTA = {
  eyebrow: 'Not sure where to start',
  title: 'Start with a phone call.',
  sub: 'Five minutes on the phone will tell you more than an hour on this website. No obligation, and no pressure at the end of it.',
};
