/**
 * Content for /local-experience, "who we are on the ground here".
 *
 * The brand list is deliberately NOT here. It lives in app/lib/brandsData.js,
 * which is what /brands/[slug], /product and the Why Choose Us brand strip all
 * read from. The previous version of this page kept its own hardcoded copy of
 * the same six brands, and the two had already drifted (origins read "UK" here
 * and "United Kingdom" there). BrandRail imports the canonical list instead, so
 * the cards can also link through to the brand pages that already exist.
 *
 * Lane: this page is about local presence, the towns, the team, the brands we
 * can actually service here. The physics is /working, the process is
 * /how-it-works, the build is /installation.
 */

export const HERO = {
  eyebrow: 'Local experience · Kashmir & India',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Heating built for the winter outside your window.',
  sub: 'A Srinagar team, six supported brands, and installations from the Valley to the coast. Not a catalogue shipped from somewhere warmer.',
  /* Local asset, not a remote Unsplash id: it is on-brand (an actual hamam
     interior with the heating loops lit in the floor), it was already in
     public/images and used by nothing, and it does not depend on a third
     party staying up. */
  bgImage: '/images/herosection.jpg',
  /* All three are counted from the data on this page rather than claimed, so
     they cannot drift from what the sections below actually show. */
  facts: [
    { value: '2011', label: 'Serving Kashmir since' },
    { value: '17', label: 'Towns across 5 regions' },
    { value: '6', label: 'Brands stocked and supported' },
  ],
};

/**
 * The narrative beat between the hero and the brand wall, same shape as
 * About's ORIGIN so OriginStory's layout can be mirrored here.
 */
export const STORY = {
  eyebrow: 'Why here is different',
  title: 'A Kashmir winter is a different brief.',
  paragraphs: [
    'Most heating is specified for a climate that dips. Ours is specified for one that sits below freezing for months, in houses built long before anyone designed them around insulation, on a grid that goes down when you need it most.',
    'That changes what you install. Thermal mass matters more than raw wattage, because a floor that holds its heat is worth more here than one that reaches temperature quickly and loses it just as fast. Insulation under the cable stops being an upsell and starts being the whole economics of the system.',
    'It is not knowledge you can ship in with a catalogue. It is the difference between a system that survives a Srinagar January and one that was designed for somewhere milder.',
  ],
  image: '/resons/reason1.jpg',
  imageAlt: 'A warm floor being used at home in winter',
};

export const BRAND_INTRO = {
  eyebrow: 'What we carry',
  title: 'Six brands, chosen for cold.',
  intro:
    'We distribute and support each of these directly, which is the part that matters after the invoice: a fault here is our callout, not a claim form posted to another country.',
};

export const NETWORK = {
  eyebrow: 'Where we work',
  title: 'The towns we actually reach.',
  intro:
    'Jammu & Kashmir is where the team is based and where response times are shortest. Everywhere else is served through the same team travelling out.',
  regions: [
    {
      region: 'Jammu & Kashmir',
      note: 'Home ground. Survey, install and aftercare handled directly by the Srinagar team.',
      places: [
        'Srinagar',
        'Anantnag',
        'Kupwara',
        'Baramulla',
        'Pulwama',
        'Budgam',
        'Sopore',
      ],
    },
    {
      region: 'North India',
      note: 'The other cold-winter market, and the one closest to our own conditions.',
      places: ['Delhi', 'Shimla', 'Manali'],
    },
    {
      region: 'West India',
      note: 'Mostly bathroom and spa work, where a warm floor matters more than a warm room.',
      places: ['Mumbai', 'Ahmedabad', 'Surat'],
    },
    {
      region: 'Central India',
      note: 'Served on scheduled trips, planned around the install rather than the enquiry.',
      places: ['Bhopal', 'Indore'],
    },
    {
      region: 'East India',
      note: 'Hill-station work in particular, where the winter case is closest to Kashmir’s.',
      places: ['Kolkata', 'Darjeeling'],
    },
  ],
};

export const CTA = {
  eyebrow: 'Nearest team',
  title: 'Find out what we can do at your address.',
  sub: 'Tell us where the house is and we will tell you honestly how quickly we can get to it, and what a system for that floor would look like.',
};
