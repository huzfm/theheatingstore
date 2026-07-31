import { Icon } from './icons';

// ─────────────────────────────────────────────────────────────────────────────
// DATA (content preserved verbatim)
// ─────────────────────────────────────────────────────────────────────────────

export const STATS = [
	{
		display: '300K+',
		label: 'Happy Customers',
		sub: 'Across India & 9 countries',
		IconComp: Icon.Customers,
		color: '#F5B97A',
		pct: 92,
		bullets: ['Residential & commercial projects', 'Verified 5 star reviews', '99% satisfaction rate'],
		tag: 'Most Trusted',
	},
	{
		display: '10 - 25+',
		label: 'Year Warranty',
		sub: 'Industry-leading coverage',
		IconComp: Icon.Shield,
		color: '#7FC0E8',
		pct: 100,
		bullets: ['10 to 25 years warranty', 'No hassle claims process', 'Parts & labour fully covered'],
		tag: 'Industry Best',
	},
	{
		display: '2M+',
		label: 'Systems Installed',
		sub: 'Globally since 2011',
		IconComp: Icon.Systems,
		color: '#FF9E7A',
		pct: 78,
		bullets: ['500,000+ installations in India', '0.01% fault rate across all systems', 'Compatible with every floor type'],
		tag: 'Market Leader',
	},
	{
		display: '9',
		label: 'Countries',
		sub: 'Internationally trusted',
		IconComp: Icon.Globe,
		color: '#8FD4A6',
		pct: 56,
		bullets: ['UK · Sweden · UAE · France', 'Finland · Netherlands · Turkey', 'Bhutan · India, and growing'],
		tag: 'Global Reach',
	},
];

export const COUNTRIES = [
	{ name: 'United Kingdom', code: 'gb' },
	{ name: 'Sweden', code: 'se' },
	{ name: 'Netherlands', code: 'nl' },
	{ name: 'Finland', code: 'fi' },
	{ name: 'France', code: 'fr' },
	{ name: 'Turkey', code: 'tr' },
	{ name: 'UAE', code: 'ae' },
	{ name: 'Bhutan', code: 'bt' },
	{ name: 'India', code: 'in' },
];

export const RELIABILITY = [
	{
		IconComp: Icon.Wrench,
		title: 'Near-Zero Failure Rate',
		desc: '0.01% fault rate across 2 million+ global installations. Engineered for extreme cold climates.',
	},
	{
		IconComp: Icon.Refresh,
		title: '24 Hour Replacement Guarantee',
		desc: 'If a system fails, we replace it within 24 hours anywhere in India.',
	},
	{
		IconComp: Icon.ClipboardCheck,
		title: '10 to 25+ Year Product Warranty',
		desc: 'Every system ships with an industry-leading warranty. Fully transferable. Valid across India.',
	},
	{
		IconComp: Icon.Ruler,
		title: 'Custom Design',
		desc: 'Detailed heating layout plans, cable density maps, and thermostat zone configurations for every project.',
	},
];

export const PROCESS = [
	{
		num: '01',
		IconComp: Icon.MessageCircle,
		title: 'Free Consultation',
		desc: 'Our experts assess your space, floor type, and usage to craft the perfect heating solution for your exact project.',
		img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
	},
	{
		num: '02',
		IconComp: Icon.Layout,
		title: 'Custom Design & Layout',
		desc: 'Our engineers translate your floor plan into a detailed heating layout, mapping cable density, wattage zones, and thermostat placement for every room before a single cable is ordered.',
		img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
	},
	{
		num: '03',
		IconComp: Icon.Package,
		title: 'Excellent Service Support',
		desc: 'From your first enquiry to post-installation aftercare, our qualified team is available at every stage. Technical questions, system troubleshooting, or warranty claims, we respond fast and resolve faster.',
		img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
	},
	{
		num: '04',
		IconComp: Icon.Tool,
		title: 'Price Match Promise',
		desc: 'Found the same system cheaper elsewhere? We will match any like-for-like price from an authorised supplier. Same product, same warranty, same certified installation, guaranteed at the best price.',
		img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
	},
	{
		num: '05',
		IconComp: Icon.Award,
		title: 'Lifetime Warranty',
		desc: 'We stand by the quality of our underfloor heating systems. That’s why many of our products come with lifetime warranties, giving you long-term peace of mind.',
		img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
	},
];

export const CAPABILITY = [
	{ label: 'Electric systems', pct: 95 },
	{ label: 'Water UFH', pct: 88 },
	{ label: 'Smart controls', pct: 92 },
	{ label: 'Commercial grade', pct: 85 },
];

export const TESTIMONIALS = [
	{
		initials: 'AA',
		name: 'Asif Ali',
		role: 'Principal Architect, Ali Associates, Srinagar',
		tag: 'Verified Purchase',
		text: 'We have specified The Heating Store across six luxury residential and commercial projects. The installation quality is immaculate, zero callbacks, zero defects. The 0.01% fault rate they advertise is absolutely real. Nothing else comes close.',
	},
	{
		initials: 'KS',
		name: 'Kamran Siddiq',
		role: 'Senior Project Manager, Siddiq Builders, Jammu',
		tag: 'Trade Account',
		text: 'The design consultation was outstanding. Custom heating zones mapped across a 5,000 sq ft penthouse, flawless installation from start to finish. Our clients were absolutely delighted with the result.',
	},
	{
		initials: 'SF',
		name: 'Syed Faizan',
		role: 'Head of Development, Faizan Developments, Kashmir',
		tag: 'Commercial Project',
		text: 'Deployed across a 60-unit luxury residential complex. Every system performed perfectly from day one. The 25-year warranty gives our homebuyers genuine confidence, it is a real differentiator in the market.',
	},
];

export const CTA_INCLUDED = [
	{ IconComp: Icon.Layers, text: 'Free Consultation' },
	{ IconComp: Icon.BoxOpen, text: 'Custom Design' },
	{ IconComp: Icon.HardHat, text: 'Expert Installation' },
	{ IconComp: Icon.BadgeCheck, text: '25+ Year Warranty' },
	{ IconComp: Icon.Chat, text: 'Dedicated Support Team' },
	{ IconComp: Icon.RotateCw, text: '24h Replacement' },
];

export const MARQUEE = [
	'Kashmir Installation Warranty',
	'25-50 Year Pipe Guarantees',
	'CE & UKCA Certified',
	'IEC 60335 Safety Compliant',
	'ISO 9001:2015 Quality Management',
	'WRAS Approved Components',
	'18th Edition Electrical Compliance',
	'Global Electrical Approvals',
];

export const AVATARS = [
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
];
