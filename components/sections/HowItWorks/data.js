/**
 * Content for /how-it-works, "the process, end to end".
 *
 * Lane discipline, this page sits between two neighbours and must not become
 * either of them:
 *   /working      — the physics (radiant vs convection, the thermostat)
 *   /installation — the physical build steps (insulation, screed, cable, finish)
 *   /how-it-works — THIS: what happens to *you*, from first call to living
 *                   with it. Who turns up, when, and what you are left with.
 *
 * Deliberately short. Every stage is one paragraph, one number and two one-line
 * commitments, the detail lives on the two pages above rather than being
 * restated here at length.
 *
 * Every figure is carried from copy that already exists on the site rather than
 * newly invented, sourced in the comment beside it. The previous version of
 * this page quoted UK trade bodies (NICEIC, BS 7671) and sterling comparisons,
 * which contradicted the rest of a Kashmir/India site, none of that is carried
 * forward.
 */

export const HERO = {
  eyebrow: 'How it works · The process',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'From first phone call to a warm floor.',
  sub: 'Five stages, no surprises. Who arrives, what they do, how long your house is a building site, and what you are left holding at the end.',
  bgImage:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=80&auto=format&fit=crop',
  facts: [
    { value: 'Free', label: 'Site visit and heat design' },
    { value: '₹180–350', label: 'Installed cost per sq ft' }, // FaqSection, "Cost & Electricity"
    { value: '15–18°C', label: 'Room temperature held through winter' }, // FaqSection, "Basics"
  ],
};

/**
 * The five stages. `you` is the part most process pages leave out, what the
 * customer is actually on the hook for, which is the question people are
 * really asking when they read a page like this.
 */
export const STAGES = [
  {
    num: '01',
    tag: 'Consultation',
    icon: 'ruler',
    title: 'A free site visit, before anything is quoted',
    lead: 'We come to the house and measure it: floor area room by room, what the floor is built on, the insulation you already have, and whether your supply can carry the load. A first-floor slab and a traditional timber floor need different systems, and nobody can tell which you need over the phone.',
    outcome: 'A measured record of your house that the quote is built on.',
    you: 'Access to each room, and the floor drawings if you have them.',
    metric: { value: 'Free', label: 'No charge, no obligation' },
  },
  {
    num: '02',
    tag: 'Design & quote',
    icon: 'layout',
    title: 'A heat design for your floor, and one written price',
    lead: 'The survey becomes a layout: which rooms are heated, cable spacing per room, and how the floor splits into thermostat zones. Colder, more exposed rooms get a denser layout than an internal bathroom. You then get one written price covering system, installation and controls, with the running cost stated up front rather than discovered in January.', // 150–200 W/m² and ₹1,500–1,800/month, FaqSection
    outcome: 'A layout drawing and a fixed written quote you can compare.',
    you: 'Tell us which rooms matter and how you actually live in them.',
    metric: { value: '150–200 W', label: 'Per m², set per room' },
  },
  {
    num: '03',
    tag: 'Installation',
    icon: 'wrench',
    title: 'Our own team lays the floor, not a subcontractor',
    lead: 'Insulation board goes down first so heat travels up into the room instead of into the slab. Cable or mat is fixed at the spacing on the drawing, tested, and buried in a 5-6 cm screed layer, then tested again. A fault found after the tiles are down is a floor that has to come up.',
    outcome: 'A heated floor slab, tested, ready for your finish.',
    you: 'Clear the rooms. The subfloor has to be empty and dry when we start.',
    metric: { value: '5 – 6 cm', label: 'Screed layer over the cable' },
    link: { href: '/installation', label: 'See the build, layer by layer' },
  },
  {
    num: '04',
    tag: 'Commissioning',
    icon: 'thermometer',
    title: 'The screed cures, then the system is brought up slowly',
    lead: 'The stage people are surprised by. Fresh screed has to cure before it is heated, typically three to four weeks, and the first heat-up is then ramped over several days rather than switched straight to your target. Rushing either cracks the screed. We set the thermostats with you and hand over the drawing, the test readings and the warranty papers.',
    outcome: 'A commissioned system and the paperwork that proves it.',
    you: 'Hold off on heavy furniture until the first heat-up is complete.',
    metric: { value: '7-10 days', label: 'Typical screed cure before first heat' },
  },
  {
    num: '05',
    tag: 'Aftercare',
    icon: 'shield',
    title: 'A floor with no daily job, and someone to call',
    lead: 'Nothing to feed, light, clean or service. You set a temperature and the thermostat holds it. When the power goes the screed keeps radiating for hours, which in a Kashmir winter is most of the point. Behind it sits a 5 year installation warranty and 10–25 years of manufacturer cover depending on the system specified.', // Working/data.js SPECS; FaqSection "Warranty"
    outcome: 'Heat you stop thinking about, and cover if you ever need it.',
    you: 'Nothing. That is the entire point of the system.',
    metric: { value: '6–10 hrs', label: 'Warmth held through a power cut' }, // FaqSection
  },
];

/**
 * What the disruption actually looks like, the question every renovation
 * customer asks and few installer pages answer. Ranges, not promises, and the
 * note under the timeline says so explicitly.
 */
export const TIMELINE = {
  eyebrow: 'On site',
  title: 'How long your house is a building site.',
  intro:
    'For a typical single-floor Kashmir home. Larger and multi-storey properties scale up, and the site visit replaces every range here with dates for your own project.',
  phases: [
    {
      when: 'Day 0',
      title: 'Site visit',
      body: 'One to two hours, and we are gone. Nothing disturbed, nothing committed.',
    },
    {
      when: 'Week 1',
      title: 'Design and quote',
      body: 'Done off site. You get the layout and the price, and take as long as you need with them.',
    },
    {
      when: 'Install days',
      title: 'Rooms out of use',
      body: 'Only the rooms being heated are cleared and unusable. The rest of the house stays livable.',
    },
    {
      when: 'Cure',
      title: 'The quiet weeks',
      body: 'Three to four weeks with nobody on site. Your floor finish can be planned around this window.',
    },
    {
      when: 'Handover',
      title: 'First heat-up',
      body: 'Ramped over several days, thermostats set with you, paperwork handed over.',
    },
  ],
};

export const CTA = {
  eyebrow: 'Stage 01',
  title: 'Start with the free site visit.',
  sub: 'An hour in your house replaces every range on this page with a number for your own floor. No cost, no obligation.',
};
