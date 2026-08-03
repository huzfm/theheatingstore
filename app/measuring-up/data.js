// ─────────────────────────────────────────────────────────────────────────────
// MEASURING UP — content data
// Every claim here already existed in the previous implementation of this
// page (or is the same 80% coverage threshold the calculator already
// enforces in code). Nothing below is a new stat or invented claim.
// ─────────────────────────────────────────────────────────────────────────────

export const GUIDE_STEPS = [
  {
    num: "01",
    title: "Room Size",
    body: "Measure the length and width of the room, wall to wall, to work out the overall square metres.",
    img: "/images/m1.png",
    alt: "Top-down floor plan of an empty room",
  },
  {
    num: "02",
    title: "Fixed Furniture",
    body: "Add the width and length of any built-in fittings, kitchen units, islands, storage radiators or bathroom suites. We recommend keeping these deductions under 20% of the room, so there's enough continuous floor area left for an even, efficient heat spread.",
    img: "/images/m2.png",
    alt: "Bathroom interior with fixed furniture",
  },
  {
    num: "03",
    title: "Heatable Area",
    body: "Once fixed areas are deducted, what remains is your heatable floor area, ready for a system to be sized against.",
    img: "/images/m3.png",
    alt: "Clean modern floor ready for underfloor heating",
  },
];

export const TRUST_BADGES = [
  { title: "Lifetime Warranty", sub: "On electric & water systems" },
  { title: "Next Day Delivery", sub: "On all orders" },
  { title: "Price Smash Promise", sub: "If it's cheaper, it's free" },
  { title: "60 Day Money Back", sub: "Guarantee" },
];

export const CONSIDERATIONS = [
  {
    tag: "Electric",
    title: "Electric Underfloor Heating",
    img: "/images/e.png",
    alt: "Electric underfloor heating cables close-up",
    paragraphs: [
      "When purchasing your mat system, you'll reduce this heatable area by 10% to allow for a 50mm to 100mm perimeter around the room, along with an allowance to space matting so it doesn't overlap.",
      "For areas that are awkward in shape, such as bathrooms, a loose cable is suggested. This maximises the heating area, provides an easy install solution, and a more efficient, even heat.",
      "The underfloor heating element cannot be shortened in length, as this will invalidate your lifetime warranty, so ordering the correct size system is essential.",
    ],
    cta: { label: "Shop Electric Underfloor Heating", href: "/product" },
  },
  {
    tag: "Water / Wet",
    title: "Water (Wet) Underfloor Heating",
    img: "/images/p1.png",
    alt: "Water underfloor heating pipes laid in a serpentine pattern",
    paragraphs: [
      "Wet systems circulate warm water through pipework connected to a manifold, so your heatable area also needs to account for pipe centres and the manifold's own footprint within the room.",
      "Because pipework is typically set into a screed or low-profile board, water systems suit new builds and larger renovations best, where floor build-up height can be planned in from the start.",
      "Pipe runs are continuous per zone and can't be shortened on site, so accurate room measurements up front are essential to specifying the correct manifold and pipe lengths.",
    ],
    cta: { label: "Talk to Us About Water Systems", href: "/contact" },
  },
];
