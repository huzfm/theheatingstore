/**
 * Content for /measuring-up, "work out your heatable area".
 *
 * The calculator on this page is the only interactive tool on the site, so its
 * arithmetic is carried across untouched, see AreaCalculator. What changed is
 * the copy around it, which contradicted it.
 *
 * The old Step 2 read: "A standard deduction of 20% is applied to the total
 * room area to account for fixed furniture." The calculator does no such
 * thing. It subtracts the un-heatable areas you type in, and then takes 10%
 * off the remainder, and that 10% is not a furniture allowance at all, it is
 * the perimeter gap and mat spacing, which the electric card further down the
 * page explains correctly. So the page stated a 20% automatic furniture
 * deduction that does not exist, and never explained the 10% that does.
 * The steps below describe what the tool actually does.
 */

export const HERO = {
  eyebrow: 'Measuring up · Heatable area',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Work out what you can actually heat.',
  sub: 'You do not heat a room, you heat the floor left over once the fixed furniture is out of it. Three measurements and this page gives you the number a quote is built from.',
  bgImage: '/images/hero.jpg',
  facts: [
    { value: '3', label: 'Measurements needed' },
    { value: '10%', label: 'Perimeter and spacing allowance' },
    { value: '80%', label: 'Below this, a rethink is worth it' },
  ],
};

export const STEPS = {
  eyebrow: 'The method',
  title: 'Three steps to a heatable area.',
  list: [
    {
      n: '01',
      title: 'Measure the room',
      body: 'Length times width, in metres, for the whole room. This is your gross floor area and everything else is taken off it.',
      img: '/images/m1.png',
      alt: 'Top-down floor plan of an empty room',
    },
    {
      n: '02',
      title: 'Subtract what is fixed',
      body: 'Anything that will never move comes out: kitchen units and islands, bathroom suites, built-in storage, storage radiators. Measure each one and enter it below. Heating a floor nobody stands on is the most common way to overspend.',
      img: '/images/m2.png',
      alt: 'Bathroom interior with fixed furniture',
    },
    {
      n: '03',
      title: 'Take off the perimeter',
      body: 'A further 10% comes off for the 50–100 mm gap around the edge of the room and the spacing needed so matting does not overlap itself. What is left is your heatable area.',
      img: '/images/m3.png',
      alt: 'Clean modern floor ready for underfloor heating',
    },
  ],
};

export const CALC = {
  eyebrow: 'The calculator',
  title: 'Heatable area calculator.',
  intro:
    'Enter the room, then add a row for each fixed obstruction. The perimeter allowance is applied for you.',
  note: 'An estimate for specifying a system, not a substitute for the site survey. Window sill height is recorded for installation planning only and does not affect the area.',
};

/**
 * The two system families. The electric card's "reduce by 10%" paragraph is
 * where the calculator's 10% comes from, so it stays.
 *
 * The electric card's button pointed at /electric-underfloor-heating, which is
 * not a route in this app, it was a dead link. It points at /product now.
 */
export const SYSTEMS = {
  eyebrow: 'Then which system',
  title: 'The allowance depends on what you are laying.',
  list: [
    {
      tag: 'Electric',
      title: 'Electric underfloor heating',
      img: '/images/e.png',
      alt: 'Electric underfloor heating cables close-up',
      paras: [
        "When buying a mat system you reduce the heatable area by 10% to allow for a 50 mm to 100 mm perimeter around the room, plus spacing so the matting does not overlap itself.",
        'For awkwardly shaped rooms such as bathrooms, a loose cable is the better answer. It maximises the heated area, installs more easily around fittings, and gives more even heat.',
        'The heating element cannot be shortened on site, doing so invalidates the warranty, so ordering the correct size is essential.',
      ],
      href: '/product',
      cta: 'See electric systems',
    },
    {
      tag: 'Water / wet',
      title: 'Water (wet) underfloor heating',
      img: '/images/p1.png',
      alt: 'Water underfloor heating pipes laid in a serpentine pattern',
      paras: [
        "Wet systems circulate warm water through pipework connected to a manifold, so the heatable area also has to account for pipe centres and the manifold's own footprint in the room.",
        'Because pipework sets into screed or a low-profile board, water systems suit new builds and larger renovations, where floor build-up height can be planned in from the start.',
        'Pipe runs are continuous per zone and cannot be shortened on site, so accurate measurements decide the manifold and pipe lengths you order.',
      ],
      href: '/contact',
      cta: 'Talk to us about water systems',
    },
  ],
};

export const CTA = {
  eyebrow: 'Next step',
  title: 'Have the number checked on site.',
  sub: 'Bring your figure to the free site visit. We measure it properly, check the floor build-up and the supply, and turn it into a written quote.',
};
