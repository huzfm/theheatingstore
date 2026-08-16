/**
 * Content for /warranty-check.
 *
 * The page used to be a single cream-palette client component with its own
 * inline token object (#FFF8F0 / #B86B45 / #E8933A), a light gradient ground
 * and a white nav sitting invisibly on top of it. Everything here is the
 * shared heat/ink/bone system instead, so the route reads like /contact,
 * /certifications and /measuring-up rather than like a different site.
 *
 * Facts come from content/facts.ts. Nothing in this file restates a number
 * that lives there.
 */

import siteFacts from '@/content/facts';

export const PHONE = siteFacts.phone;
export const PHONE_DISPLAY = siteFacts.phoneDisplay;
export const WHATSAPP = siteFacts.whatsapp;

/** Where the lookup goes. Same-origin proxy, see app/api/warranty/check. */
export const LOOKUP_ENDPOINT = '/api/warranty/check';

export const HERO = {
  eyebrow: `Warranty check · Since ${siteFacts.foundedYear}`,
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Check what your hamam is still covered for.',
  sub: 'Enter the phone number the installation was booked under, or the warranty ID on your certificate. The record comes back with the installation date, the expiry and the days you have left.',
  bgImage: '/images/elecr.png',
};

export const LOOKUP = {
  eyebrow: 'Registered installations',
  title: 'Look up your record.',
  intro:
    'One field, one search. Phone numbers are matched exactly as they were registered at installation.',
};

/**
 * The three things the lookup answers. Deliberately descriptions of what the
 * tool does, not warranty claims, the warranty terms themselves are on
 * /certifications and are stated once in content/facts.ts.
 */
export const ASSURANCES = [
  {
    title: 'Instant lookup',
    body: 'Search by registered phone number or by the warranty ID printed on your certificate.',
  },
  {
    title: 'Dates, not adjectives',
    body: 'Installation date, expiry date and the exact number of days of cover remaining.',
  },
  {
    title: 'Every registered system',
    body: `Electric hamam and underfloor heating installations carry our ${siteFacts.installationWarranty.toLowerCase()} installation warranty.`,
  },
];

export const HELP = {
  eyebrow: 'If nothing comes back',
  title: 'A blank result is usually the number, not the cover.',
  intro:
    'Records are filed against the number given on the day of installation. If a search returns nothing, one of these is normally why.',
  reasons: [
    {
      title: 'A different number',
      body: 'The installation may have been booked under a family member, a contractor or a site number rather than yours.',
    },
    {
      title: 'A recent installation',
      body: 'Certificates are issued once the job is signed off. A system fitted in the last few days may not be filed yet.',
    },
    {
      title: 'A typo in the ID',
      body: 'Warranty IDs are case-insensitive here, but a missing digit or dash will not match. Try the phone number instead.',
    },
  ],
};

export const CTA = {
  eyebrow: 'Still not sure',
  title: 'Call us with the address.',
  sub: 'We can find an installation from the address and the approximate date, and reissue the certificate if it has gone missing.',
};
