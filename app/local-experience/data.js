// ─────────────────────────────────────────────────────────────────────────────
// DATA — every figure below is sourced from the copy already established for
// this page (brand certifications, FAQ answers, service regions). Nothing
// here is a new or invented claim; sections only restate what `faqs` already
// states, in more scannable form.
// ─────────────────────────────────────────────────────────────────────────────

export const serviceNetwork = [
	{
		region: 'Jammu & Kashmir',
		places: ['Srinagar', 'Anantnag', 'Kupwara', 'Baramulla', 'Pulwama', 'Budgam', 'Sopore'],
	},
	{
		region: 'North India',
		places: ['Delhi', 'Shimla', 'Manali'],
	},
	{
		region: 'West India',
		places: ['Mumbai', 'Ahmedabad', 'Surat'],
	},
	{
		region: 'Central India',
		places: ['Bhopal', 'Indore'],
	},
	{
		region: 'East India',
		places: ['Kolkata', 'Darjeeling'],
	},
];

export const faqs = [
	{
		category: 'Performance',
		q: 'Does electric hamam work in Kashmir winters (-15°C)?',
		a: "Absolutely. Our systems are rated to operate in sub-zero conditions down to -20°C. The layered concrete thermal mass method stores heat for 4–6 hours post power cut, critical for Kashmir's load-shedding schedule. Every installation is cold-climate certified.",
	},
	{
		category: 'Performance',
		q: 'How long does the floor take to heat up?',
		a: 'Typically 30–45 minutes from cold start. With our smart thermostats set on a schedule, the floor is warm before you wake up. Thermal retention means it stays warm long after the system switches off.',
	},
	{
		category: 'Installation',
		q: 'Can it be installed in an existing home without major renovation?',
		a: 'Yes. Our ultra-thin heating mats add only 3–4mm to floor height, no screed pour required in most retrofit cases. We handle everything from survey to commissioning. Zero structural disruption.',
	},
	{
		category: 'Installation',
		q: 'Which floor types are compatible?',
		a: 'All of them, marble, granite, ceramic tile, natural stone, and engineered wood. We have installed across every floor type common to Kashmiri residential and commercial construction.',
	},
	{
		category: 'Cost & Running',
		q: 'What does it cost to run monthly?',
		a: "A typical Kashmir bathroom (50–80 sq ft) costs INR 1000–1500 per month at standard J&K tariff rates. Our smart thermostats cut consumption by 30–40% by learning your usage pattern and Kashmir's power schedules automatically.",
	},
	{
		category: 'Warranty & Support',
		q: 'What warranty do I get?',
		a: 'Every system carries a 10 to 25+ year product warranty, the longest in the industry. Parts and labour are fully covered. No excess, no exclusions for normal use. Fully transferable if you sell the property.',
	},
	{
		category: 'Warranty & Support',
		q: 'What happens if something goes wrong?',
		a: 'We guarantee replacement within 24 hours anywhere in India. Our 0.01% fault rate across 2 million+ global installations means this almost never happens, but when it does, we respond the same day.',
	},
	{
		category: 'Warranty & Support',
		q: 'Do you service systems installed years ago?',
		a: 'Yes. We support every system we have ever installed. Our Srinagar team handles ongoing servicing, thermostat upgrades, and zone expansions for existing customers at preferential rates.',
	},
];

// Derived from `faqs.category`, not hand-maintained, so the tab list can
// never drift out of sync with the data it filters.
export const faqCategories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

// Trust rail figures — every value already appears verbatim above or in the
// hero eyebrow ("Kashmir #1 Seller · Since 2011"), just resurfaced as a
// scannable technical rail rather than a new set of statistics.
export const proofStats = [
	{ value: '−20°C', label: 'Cold-climate rated' },
	{ value: '4–6 hrs', label: 'Heat retention post power-cut' },
	{ value: '25+ yrs', label: 'Product warranty' },
	{ value: '2011', label: 'Kashmir-first engineering since' },
];
