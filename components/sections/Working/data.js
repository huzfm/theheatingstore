/**
 * Content for /working, "how the heat actually works".
 *
 * Every figure here is carried from copy that already exists elsewhere on the
 * site (app/components/FaqSection.jsx and lib/floor-timeline.js) rather than
 * newly invented, so the two can't contradict each other. If a number changes,
 * it has to change in both places, they are listed here with a source note.
 */

export const HERO = {
  eyebrow: 'How it works · The physics',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Heat rises. So we start at the floor.',
  sub: 'A radiator warms the air near a wall and hopes it circulates. An electric hamam turns the entire floor into the heat source, so warmth arrives evenly, silently, from the one surface you are actually touching.',
  /* The buttons are not configured here: both this hero and the closing panel
     render the shared HeroCTAs pair, so the labels and destinations stay
     identical to the home page's rather than being restated per section. */
  bgImage:
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop',
  /* Three claims the rest of the page then proves, in order. */
  facts: [
    { value: '5 mm', label: 'Mat thickness under your floor' },
    { value: '150–200 W', label: 'Per m², depending on the room' }, // FaqSection, "Cost & Electricity"
    { value: '6–10 hrs', label: 'Warmth held through a power cut' }, // FaqSection, "Cost & Electricity"
  ],
};

/**
 * The core explanation: radiant vs convection. Deliberately three ideas, not
 * six, this is the part a visitor has to actually understand, and a longer
 * list is a list people skim instead of read.
 */
export const PHYSICS = {
  eyebrow: 'The principle',
  title: 'Radiant heat, not blown air.',
  intro:
    'Convection heating warms air and moves it around the room. Radiant heating warms the surfaces and the people directly, the same way sunlight warms you on a cold day without warming the air between. That single difference is where every other advantage comes from.',
  points: [
    {
      k: '01',
      title: 'The floor becomes the emitter',
      body: 'Heating cable runs beneath the whole floor area, so the warm surface is measured in square metres rather than the square centimetres of a radiator panel. A large emitter running gently beats a small one running hot.',
    },
    {
      k: '02',
      title: 'The screed stores the heat',
      body: 'The cable sits inside a concrete screed layer. Concrete is slow to warm and slow to let go, so the floor behaves like a battery: it charges while the power is on and keeps radiating after it is not.',
    },
    {
      k: '03',
      title: 'Nothing is blown anywhere',
      body: 'No fans, no ducts, no draughts. Dust and allergens stay where they are, the air does not dry out, and the room is silent, there is no moving part anywhere in the system.',
    },
  ],
  /* The comparison table. Kept to four rows a visitor can hold in their head. */
  compare: {
    a: 'Electric hamam',
    b: 'Radiators & blowers',
    rows: [
      {
        metric: 'Heat distribution',
        a: 'Even across the whole floor',
        b: 'Hot near the unit, cold at the far wall',
      },
      {
        metric: 'Warmest point',
        a: 'The floor, where you stand',
        b: 'The ceiling, where nobody is',
      },
      {
        metric: 'During a power cut',
        a: 'Screed keeps radiating for hours',
        b: 'Cold within minutes',
      },
      {
        metric: 'In the room',
        a: 'Silent, invisible, no floor space used',
        b: 'Audible fans, wall space, visible units',
      },
    ],
  },
};

/**
 * The control story, keyed by ThermostatDial's own state ids. The dial reports
 * its state up via onStateChange and this list highlights the matching row, so
 * the copy is driven by the animation rather than running beside it on a
 * separate timer that would slowly drift out of step.
 */
export const CONTROL = {
  eyebrow: 'The control layer',
  title: 'One dial, five states, no daily ritual.',
  intro:
    'A wood hamam needs someone to feed it. This needs a target temperature. The thermostat reads the floor and the room, then gives the cable only the power required to hold the number you set, which is what keeps a running cost predictable.',
  states: [
    {
      id: 'off',
      label: 'Off',
      body: 'The system rests at room temperature. Nothing is drawing power, and the ring sits where the room actually is rather than at zero.',
    },
    {
      id: 'heating',
      label: 'Heating',
      body: 'Full power to the cable until the target is met. This is the only phase drawing the system’s rated load, and on a well-insulated floor it is the shortest one.',
    },
    {
      id: 'holding',
      label: 'Holding',
      body: 'At temperature. The thermostat now cycles the cable in short bursts to replace only the heat the room loses, which is where the running cost quietly settles.',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      body: 'Set it to be warm by the time you are home. The controller works backwards from the target hour and starts early enough for the screed to come up to temperature.',
    },
    {
      id: 'outage',
      label: 'Power cut',
      body: 'The dial goes dark, the floor does not. Stored heat in the screed keeps the room comfortable for hours, which in Kashmir is the entire reason this system exists.',
    },
  ],
};

/** Numbers strip. All four are carried from the site’s existing FAQ copy. */
export const SPECS = [
  { value: '15–18°C', label: 'Room temperature held through winter' },
  { value: '₹1,500–1,800', label: 'Typical monthly run cost, 10×10 room' },
  { value: '₹180–350', label: 'Installed cost per sq ft' },
  { value: '5 years', label: 'Installation warranty, Kashmir' },
];

export const CTA = {
  eyebrow: 'Next step',
  title: 'See it specified for your own floor.',
  sub: 'A free site visit measures the rooms, checks the build-up and the circuit capacity, and comes back with a layout and a running-cost estimate for your actual house, not a generic one.',
};
