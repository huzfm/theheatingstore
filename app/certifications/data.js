// ─────────────────────────────────────────────────────────────────────────────
// Certifications — content source of truth. Every claim here is carried over
// from the previous CertificationsClient implementation; nothing invented.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO = {
	eyebrow: 'Engineered for Extreme Climates',
	heading: ['Certified systems.', 'Engineered for Kashmir.'],
	body: "We partner with the world's most trusted underfloor heating manufacturers to supply certified electric hamam systems across Kashmir, India, and international markets — engineered for -15°C winters, power-cut resilience, and humidity, and backed by internationally recognized safety standards.",
	meta: [
		{ label: 'Since', value: '2011' },
		{ label: 'Region', value: 'Kashmir' },
		{ label: 'Standard', value: 'International' },
	],
	seal: {
		center: 'CE',
		ring: ['IEC 60335', 'ISO 9001', 'UKCA', 'WRAS'],
	},
};

export const PARTNERS = [
	{ n: '01', name: 'ProWarm', slug: 'prowarm' },
	{ n: '02', name: 'Warmup', slug: 'warmup' },
	{ n: '03', name: 'ThermoSphere', slug: 'thermosphere' },
	{ n: '04', name: 'FastWarm', slug: 'fastwarm' },
];

export const PARTNERS_NOTE =
	'Together, these systems have powered hundreds of thousands of installations worldwide, delivering proven reliability across residential, commercial, and luxury developments — every one backed by our Kashmir-based warranty and support.';

// International Compliance — asymmetric weighting: one primary, two secondary,
// remainder as technical chips.
export const COMPLIANCE_PRIMARY = {
	n: '01',
	code: 'CE',
	title: 'European Conformity',
	desc: 'All heating systems comply with international safety and performance standards, with Kashmir-specific testing for heat retention, power-cut resilience, and humidity.',
	meta: ['EN 60335', 'UKCA 2025'],
};

export const COMPLIANCE_SECONDARY = [
	{
		n: '02',
		code: 'IEC 60335',
		title: 'Electrical appliance safety',
		desc: 'Meets international safety standards for electrical appliances, with Kashmir-specific consideration for humidity, altitude, and power fluctuation.',
	},
	{
		n: '03',
		code: 'ISO 9001:2015',
		title: 'Quality management',
		desc: 'Quality-management-certified manufacturing processes ensuring consistent product testing and reliability, installed across Kashmir since 2011.',
	},
];

export const COMPLIANCE_CHIPS = ['UKCA', 'UL / cUL', 'CSA', 'VDE', 'SEMKO'];

// Built Around Standards — vertical technical timeline / accordion
export const STANDARDS_TIMELINE = [
	{
		n: '01',
		tag: 'Electrical Safety',
		code: 'IEC 60335',
		desc: 'Meets international safety standards for electrical appliances, with Kashmir-specific consideration for humidity, altitude, and power fluctuation conditions.',
	},
	{
		n: '02',
		tag: 'Quality Management',
		code: 'ISO 9001:2015',
		desc: 'Quality-management-certified manufacturing processes ensuring consistent product testing and reliability, installed across Kashmir since 2011.',
	},
	{
		n: '03',
		tag: 'Water Systems',
		code: 'WRAS',
		desc: 'Water-based systems use WRAS-approved pipes and fittings, complying with Water Supply Regulations and Scottish Byelaws. All manifold assemblies meet strict hygienic standards.',
		ref: 'REG. NO. 2406012',
	},
	{
		n: '04',
		tag: 'Multilayer Pipe',
		code: 'EN ISO 21003',
		desc: 'PERT-AL-PERT multilayer pipes manufactured to EN ISO 21003-1, with an aluminium oxygen barrier, corrosion resistance, and 50-year durability.',
	},
	{
		n: '05',
		tag: 'Installation',
		code: 'BS 7671 / 18th Edition',
		desc: 'Complies with IET Electrical Regulations (BS 7671) and 18th Edition wiring standards for safe installation.',
	},
];

// Water-based systems — cross-section flow
export const WATER_SYSTEM_STAGES = [
	{ label: 'Water System', detail: 'Hydronic underfloor circuit' },
	{ label: 'WRAS Approved', detail: 'Water Supply Regulations & Scottish Byelaws · Reg. No. 2406012' },
	{ label: 'PERT-AL-PERT', detail: 'Multilayer pipe manufactured to EN ISO 21003-1' },
	{ label: 'Aluminium Oxygen Barrier', detail: 'Prevents oxygen ingress into the circuit' },
	{ label: 'Corrosion Resistance', detail: 'Protects manifold and system components' },
	{ label: '50-Year Durability', detail: 'Long-term structural life of the pipe run' },
];

// Safety & Installation — three-stage sequence
export const SAFETY_STAGES = [
	{
		n: '01',
		code: 'TwistedTwin™',
		title: 'Advanced Cable Technology',
		desc: 'TwistedTwin™ technology reduces cable stress, improves flexibility, and enhances long-term durability with dual conductor architecture.',
	},
	{
		n: '02',
		code: 'Earth',
		title: 'Continuous Earth Protection',
		desc: 'Full metallic shielding with continuous earth protection braids for enhanced electrical safety and system reliability.',
	},
	{
		n: '03',
		code: '18th Edition',
		title: 'Electrical Compliance',
		desc: 'Complies with IET Electrical Regulations (BS 7671) and 18th Edition wiring standards for safe installation.',
	},
];

// Warranty / Protection Architecture
export const WARRANTY = [
	{
		value: '100%',
		label: 'Installation Protection',
		desc: 'Cables replaced if damaged during installation, before flooring is completed.',
	},
	{
		value: '50',
		unit: 'Years',
		label: 'Pipe Guarantee',
		desc: '25–50 year guarantees on multilayer pipework for hydronic systems.',
	},
];

// Global Track Record
export const TRACK_RECORD = {
	headline: '250,000+',
	headlineLabel: 'Residential homes',
	nodes: ['Luxury apartments', 'Hotels & resorts', 'Commercial buildings', 'Healthcare facilities'],
};

// Project Intelligence
export const PROJECT_INTELLIGENCE = [
	{
		n: '01',
		title: 'Installation-First',
		desc: 'Real on-site visuals showcasing workforce, floor preparation, and wiring layers — focused on execution, not marketing renders.',
	},
	{
		n: '02',
		title: 'Project Calculator',
		desc: 'Area-based system calculation with unit quantity, cost breakdown, labour estimation, and thermostat inclusion.',
	},
	{
		n: '03',
		title: 'End-to-End Guidance',
		desc: 'Clear explanation of workflow, safety standards, energy efficiency, and long-term reliability — helping clients understand their investment.',
	},
];

// Kashmir Expertise
export const KASHMIR_POINTS = [
	{ label: '-15°C Winters', desc: 'Systems engineered and tested for sustained sub-zero performance.' },
	{ label: 'Power-Cut Resilience', desc: 'Designed around Kashmir’s power fluctuation and outage patterns.' },
	{ label: 'Humidity & Altitude', desc: 'Component selection accounts for regional humidity and altitude conditions.' },
	{ label: 'Local Installation Knowledge', desc: 'Kashmir-installed since 2011, with hundreds of local installations.' },
	{ label: 'Kashmir-Based Support', desc: 'Technical team on the ground, not a remote call centre.' },
];

// Final Support CTA
export const SUPPORT_POINTS = [
	'Expert product consultation',
	'Installation guidance & CAD support',
	'Lifetime technical support',
	'System selection & design assistance',
];
