/**
 * All copy below is verbatim from the original WhyElectricHamam.jsx 
 * headings, paragraphs, stat values/labels, CTA label, and the doctor quote
 * are unchanged. Only presentation metadata (image, accent) is new.
 */

export const EYEBROW = 'The Modern Choice';
export const TITLE = 'The Modern Evolution of Traditional Warmth';

export const CTA_LABEL = 'Talk to a Heating Specialist';

/**
 * One entry per cinematic scene. `counterStat` is the card's own badge text
 * (the "old way" problem it answers); `rowStat` is one of the four original
 * KPI-row entries, woven in as a narrative beat instead of a dashboard tile.
 * Together every original stat (6 card badges + 4 KPI-row stats) is placed
 * exactly once.
 */
// Kept to the two approved accent tokens (copper / amber), alternating for
// editorial variety without breaking the restrained luxury palette.
const COPPER = '#B86B45';
const AMBER = '#E5A94D';

export const SCENES = [
  {
    id: 'smoke-free',
    index: 1,
    accent: COPPER,
    title: 'Clean & Smoke-Free Heating',
    body: 'No wood smoke, ash, soot, kerosene odours, or chimney cleaning inside the home.',
    image: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: '4M+ deaths/yr', label: 'WHO, on indoor smoke exposure' },
    rowStat: { value: 'Zero', label: 'Smoke, fumes & emissions' },
  },
  {
    id: 'even-warmth',
    index: 2,
    accent: AMBER,
    title: 'Even Whole-Room Warmth',
    body: 'Radiant floor heating distributes warmth evenly across the floor and throughout the room.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: 'Forests disappearing', label: 'the cost of wood-fired heat' },
    rowStat: null,
  },
  {
    id: 'everyday-comfort',
    index: 3,
    accent: COPPER,
    title: 'Simple Everyday Comfort',
    body: 'No wood storage, fire preparation, or daily maintenance required during winter.',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: '2-3 hrs daily labour', label: 'saved, every single day' },
    rowStat: { value: '10-25+ yrs', label: 'System lifespan warranty' },
  },
  {
    id: 'precise-control',
    index: 4,
    accent: AMBER,
    title: 'Precise Temperature Control',
    body: 'Easily control room temperature using manual, programmable, or WiFi thermostats.',
    image: 'https://images.unsplash.com/photo-1619140099965-06d74aaf51fa?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: 'No control at all', label: 'with an open wood fire' },
    rowStat: null,
  },
  {
    id: 'power-cut-ready',
    index: 5,
    accent: COPPER,
    title: 'Heat Retention During Power Cuts',
    body: 'The heated screed layer stores warmth for long-lasting comfort even after shutdown.',
    image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: 'Children at real risk', label: 'from unattended open flame' },
    rowStat: { value: '6-10 hrs', label: 'Heat retained after power off' },
  },
  {
    id: 'modern-interiors',
    index: 6,
    accent: AMBER,
    title: 'Compatible With Modern Interiors',
    body: 'Suitable beneath carpet, marble, tile, stone, and engineered flooring systems.',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1800&q=80',
    counterStat: { value: 'Hidden costs always', label: 'with retrofitted stoves & flues' },
    rowStat: { value: '2-4 inches', label: 'Floor height added only' },
  },
];

export const QUOTE = {
  text: 'The underfloor heating system has no generation of gases, is completely insulated which makes it safe. There is no production of smoke, it is as good as a traditional hamam in every way.',
  name: 'Dr. Naveed Nazir',
  role: 'Pulmonologist, Kashmir',
  source: 'Kashmir Observer, Dec 2023',
};
