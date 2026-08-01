// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS — content data
// All facts here trace back to the previous carousel implementation of this
// page; nothing below is invented. The old five "steps" have been split by
// role: four are a real chronological install journey, the fifth (radiant
// heat physics) was never a step in the customer's timeline — it now lives
// in the technical explainer section it always belonged in.
// ─────────────────────────────────────────────────────────────────────────────

export const PROCESS = [
	{
		num: '01',
		tag: 'Site Assessment',
		title: 'Expert Survey &',
		titleAccent: 'Bespoke Floor Design',
		outcome: 'A CAD heating layout mapped to your exact floor plan',
		desc: 'Our NICEIC certified engineers survey the property in person, measuring room dimensions, checking floor construction and existing insulation, and calculating thermal load and U-values room by room. The result is a bespoke CAD heating layout with cable density and circuit zoning mapped to your exact floor plan, not a generic template.',
		points: [
			{ label: 'Bespoke CAD Plan', detail: 'Cable spacing mapped room by room from your actual floor plan' },
			{ label: 'Thermal Load Analysis', detail: 'U-value and heat-loss calculations set the wattage per m²' },
			{ label: 'Circuit Zoning', detail: 'Load calculated per circuit so each thermostat zone is balanced' },
		],
		stat: { value: 'Free', label: 'Full survey and CAD design, zero obligation' },
		proof: '14,000+ bespoke CAD designs delivered across the UK',
		scene: 'survey',
	},
	{
		num: '02',
		tag: 'Installation',
		title: 'Precision Cable',
		titleAccent: 'Installation',
		outcome: 'A tested, wired system signed off to BS 7671',
		desc: 'Engineers embed ultra-thin heating cable directly into the screed, or fix self-adhesive mats across the subfloor, laid to the exact CAD spec so there are no cold spots. Every installation is wired and commissioned to BS 7671 Amendment 4 and signed off under NICEIC certification before the floor finish goes down.',
		points: [
			{ label: '3–4mm Cable Profile', detail: 'Sits invisibly beneath tile, stone, LVT or timber' },
			{ label: 'Self-Adhesive Mats', detail: 'Fast-fix system for renovations over an existing subfloor' },
			{ label: 'Screed-Embedded Cable', detail: 'Wet system for new-build slabs and full renovations' },
		],
		stat: { value: '4mm', label: 'Total profile, thinner than a pound coin' },
		proof: '0.01% fault rate across 2 million+ installations',
		scene: 'install',
	},
	{
		num: '03',
		tag: 'Smart Controls',
		title: 'Intelligent Thermostat',
		titleAccent: '& Commissioning',
		outcome: 'A commissioned system tuned to your household',
		desc: "Heatmiser Neo and Salus iT800 systems pair a floor sensor with an air sensor, so the thermostat reacts to both rather than just room temperature. Geofencing brings the heating on as you head home, and open-window detection pauses it automatically when a window opens nearby. Independent market reporting puts typical zoned-control savings in the 15–30% range depending on the property and how it's used.",
		points: [
			{ label: 'Dual Sensor Precision', detail: '±0.5°C accuracy, floor and air temperature both monitored' },
			{ label: 'Geofencing & Adaptive Scheduling', detail: 'Self-learning 7-day programme, heating adjusts as you leave and return' },
			{ label: 'Open-Window & Overheat Protection', detail: 'Automatic cutout if a window opens nearby or the floor runs hot' },
		],
		stat: { value: '±0.5°', label: 'Temperature control accuracy per zone' },
		proof: 'Heatmiser Neo integrates with Google Home, Amazon Alexa and Apple HomeKit via neoHub',
		scene: 'thermostat',
	},
	{
		num: '04',
		tag: 'Aftercare',
		title: '25 Year Warranty',
		titleAccent: '& Ongoing Support',
		outcome: 'Lifetime cover, with zero callout fees',
		desc: 'Every system we install carries a 25 year product warranty backed by a 24-hour replacement guarantee. Our dedicated aftercare team remains on call for the full lifetime of your heating system with zero callout fees, ever.',
		points: [
			{ label: '25 Year Warranty', detail: 'Cables, thermostats and all components fully covered' },
			{ label: '24 Hour Swap Guarantee', detail: 'Faulty unit replaced within one working day' },
			{ label: 'Zero Callout Fees', detail: 'Technical support with no hidden charges' },
		],
		stat: { value: '25yr', label: 'Warranty covering cables, thermostats and controls' },
		proof: '300,000+ customers served. Zero unresolved warranty claims.',
		scene: 'warranty',
	},
];

// The physics explainer — previously miscast as a numbered "step", it's the
// answer to "why does this feel different to a radiator", not a stage in
// the install timeline.
export const TECHNICAL = {
	tag: 'Heat Science',
	title: 'Radiant Warmth,',
	titleAccent: 'Engineered From the Ground Up',
	desc: 'Radiators heat air, which rises, cools and recirculates dust as it moves around a room. Underfloor heating radiates warmth directly from the floor surface, so the whole room warms evenly with no draughts, no dust circulation and no hot-and-cold layering. Comfort that reads as air quality, not just temperature.',
	points: [
		{ label: '26°C Floor Surface', detail: 'Warmth exactly where the body feels it, not six feet up a wall' },
		{ label: 'Zero Air Movement', detail: 'No convection currents to stir dust, pollen or allergens' },
		{ label: 'Completely Silent', detail: 'No pumps, valves, radiator noise or water gurgling' },
	],
	stat: { value: '100%', label: 'Floor area heated with total uniformity' },
	proof: 'Zero convection currents to circulate dust, pollen or allergens, room after room',
	scene: 'radiant',
};

// Same four stages, re-angled around what the customer actually experiences
// rather than what the engineers do — no new claims, just a different cut.
export const CUSTOMER_EXPERIENCE = [
	{
		phase: 'Before',
		num: '01',
		title: 'You Get a Plan, Not a Guess',
		desc: 'A free, no-obligation site survey and a bespoke CAD heating layout, so you know exactly what will be installed, where, and why, before anyone commits to anything.',
	},
	{
		phase: 'During',
		num: '02',
		title: 'We Handle Every Technical Detail',
		desc: 'NICEIC certified engineers lay cable or mat to your CAD spec, wire and test to BS 7671 Amendment 4, and commission the thermostat, dual sensors included, before they leave.',
	},
	{
		phase: 'After',
		num: '03',
		title: 'You Live With It, We Stand Behind It',
		desc: 'Geofenced, app-controlled heating that learns your week, backed by a 25 year warranty, a 24-hour replacement guarantee, and zero callout fees for as long as you own it.',
	},
];

// Quiet stat rail — every figure here already appears against a step above;
// this just gathers them in one place for the trust section.
export const TRUST_STATS = [
	{ value: '300,000+', label: 'Customers served' },
	{ value: '2M+', label: 'Installations completed' },
	{ value: '0.01%', label: 'Fault rate' },
	{ value: '25yr', label: 'Product warranty' },
];
