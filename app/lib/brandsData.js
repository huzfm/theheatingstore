/**
 * Shared BRANDS data for the site.
 * Used by:
 *   - app/components/OurBrands.jsx (portfolio grid)
 *   - app/brands/[slug]/page.jsx (premium brand detail page)
 *
 * Image paths point to /public/brandimages/* and /public/brandimages/products/*
 * If a product image is missing, the BrandImage component falls back to a
 * gradient placeholder using accentColor.
 */

export const BRANDS = [
	// ─────────────────────────────────────────────────────────────
	// 1. ProWarm
	// ─────────────────────────────────────────────────────────────
	{
		name: 'ProWarm',
		slug: 'prowarm',
		tag: 'ELECTRIC',
		img: '/brandimages/prowarm.webp',
		heroImage: '/brandimages/prowarm.webp',
		accentColor: '#B86B45',
		desc: "UK's #1 best-selling electric underfloor heating brand with over 300,000 systems sold worldwide. CE certified by SGS to IEC 60335 standards. Every system ships with a Lifetime Warranty and the CableSafe™ Guarantee, if the heating cable is accidentally cut during installation, ProWarm replaces it free of charge.",
		longDesc:
			"ProWarm has been at the forefront of electric underfloor heating innovation in the United Kingdom for nearly two decades, supplying over 300,000 systems to homes, hotels and commercial projects across the world. The brand is built around three uncompromising promises, cable longevity, installer confidence, and end-user comfort.\n\nEvery ProWarm system is CE certified by SGS to the international IEC 60335 standard for fixed heating appliances, and the multi-strand fluoropolymer-insulated cable is engineered to survive the harshest screed environments. The signature CableSafe™ Guarantee covers you if the heating cable is accidentally cut during installation, ProWarm will replace the mat, free of charge, no questions asked.\n\nBacked by a Lifetime Warranty, ProWarm remains the heating system of choice for installers who refuse to compromise. The Heating Store is an authorised ProWarm distributor across India, with full factory training and direct WhatsApp technical support for every installation in Kashmir, Ladakh, Delhi, Mumbai, Bengaluru and beyond.",
		established: '2008',
		origin: 'United Kingdom',
		certifications: ['CE', 'IEC 60335', 'RoHS', 'SGS Tested'],
		warranty: 'Lifetime Warranty + CableSafe™ Guarantee',
		usps: [
			{ icon: 'shield', title: 'CableSafe™ Guarantee', desc: 'Free replacement if cable is cut during install' },
			{ icon: 'award', title: 'IEC 60335 Certified', desc: 'Independently tested by SGS to international standard' },
			{ icon: 'zap', title: 'Multi-strand cable', desc: 'Fluoropolymer insulation for 30+ year lifespan' },
			{ icon: 'globe', title: '300K+ systems', desc: 'Trusted by installers across 40+ countries' },
		],
		stats: [
			{ val: '300K+', label: 'Systems Installed' },
			{ val: 'IEC', label: '60335 Certified' },
			{ val: 'Life', label: 'Time Warranty' },
		],
		products: [
			{
				id: 'pw-01',
				name: 'ProWarm 100W Electric Mat',
				subtitle: 'Ideal for bathrooms & ensuites',
				coverage: '1-2 sqm',
				wattage: '100W',
				priceRange: '₹9,000 – ₹11,500',
				badge: 'BESTSELLER',
				features: ['Self-adhesive mesh', 'Twin conductor', 'Lifetime warranty', 'CableSafe™ covered'],
				image: '/brandimages/products/prowarm-mat-100.webp',
				datasheet: null,
			},
			{
				id: 'pw-02',
				name: 'ProWarm 150W Electric Mat',
				subtitle: 'Primary heating for living rooms',
				coverage: '2-4 sqm',
				wattage: '150W',
				priceRange: '₹12,500 – ₹16,000',
				badge: 'POPULAR',
				features: ['FEP insulation', 'Low EMF design', 'Lifetime warranty', 'Thermostat ready'],
				image: '/brandimages/products/prowarm-mat-150.webp',
				datasheet: null,
			},
			{
				id: 'pw-03',
				name: 'ProWarm 200W Pro Mat',
				subtitle: 'High-output for stone & tile',
				coverage: '3-6 sqm',
				wattage: '200W',
				priceRange: '₹17,000 – ₹24,000',
				badge: 'PRO',
				features: ['Commercial grade', 'Rapid heat-up', 'Lifetime warranty', '20-year floor cover'],
				image: '/brandimages/products/prowarm-mat-200.webp',
				datasheet: null,
			},
			{
				id: 'pw-04',
				name: 'ProWarm Loose Cable System',
				subtitle: 'Custom layouts & irregular rooms',
				coverage: '5-12 sqm',
				wattage: '10W/m',
				priceRange: '₹22,000 – ₹38,000',
				badge: null,
				features: ['Variable spacing', 'Screed compatible', 'Lifetime warranty', 'CableSafe™ covered'],
				image: '/brandimages/products/prowarm-cable.webp',
				datasheet: null,
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// 2. Warmup
	// ─────────────────────────────────────────────────────────────
	{
		name: 'Warmup',
		slug: 'warmup',
		tag: 'UNDERFLOOR',
		img: '/brandimages/warmup.webp',
		heroImage: '/brandimages/warmup.webp',
		accentColor: '#E8933A',
		desc: "The world's best-selling floor heating brand since 1994, with over 2.5 million systems installed across 72 countries. ISO 9001:2015 certified and accredited by BEAB, UL, CSA, FIMKO and SEMKO. Winner of the Queen's Award for Enterprise 2020. Every system backed by a Limited Lifetime Warranty and the SafetyNet™ Installation Guarantee.",
		longDesc:
			"Warmup invented the modern electric underfloor heating industry in 1994 and has remained its global leader ever since. With more than 2.5 million systems installed across 72 countries, Warmup is the brand that architects, builders and homeowners specify when only the best will do.\n\nEvery Warmup system is engineered in the United Kingdom and certified to the world's most demanding safety standards, ISO 9001:2015 for quality management, BEAB for European product safety, UL for North America, and CSA, FIMKO and SEMKO across the rest of the world. In 2020 the company was awarded the prestigious Queen's Award for Enterprise in the Innovation category.\n\nThe ultra-thin 1.8mm StickyMat is the thinnest dual-fluoropolymer heating wire on the market, and the SafetyNet™ Installation Guarantee means that if a Warmup mat is damaged during installation, the company will replace it, and even contribute towards the cost of the floor covering. Backed by a Limited Lifetime Warranty, no other heating brand comes close.",
		established: '1994',
		origin: 'United Kingdom',
		certifications: ['BEAB', 'UL', 'CSA', 'FIMKO', 'SEMKO', 'ISO 9001'],
		warranty: 'Limited Lifetime Warranty + SafetyNet™',
		usps: [
			{ icon: 'globe', title: '2.5M+ Systems', desc: 'Installed across 72 countries since 1994' },
			{ icon: 'shield', title: 'SafetyNet™ Guarantee', desc: 'Floor cover contribution if cable damaged' },
			{ icon: 'award', title: 'Queen’s Award 2020', desc: 'UK Government honour for innovation' },
			{ icon: 'thermometer', title: '1.8mm ultra-thin', desc: 'Thinnest dual-fluoropolymer wire on market' },
		],
		stats: [
			{ val: '2.5M+', label: 'Systems Worldwide' },
			{ val: '72', label: 'Countries' },
			{ val: '1994', label: 'Since' },
		],
		products: [
			{
				id: 'wu-01',
				name: 'Warmup StickyMat 150W',
				subtitle: 'The original ultra-thin electric mat',
				coverage: '1-3 sqm',
				wattage: '150W',
				priceRange: '₹10,500 – ₹14,000',
				badge: 'BESTSELLER',
				features: ['1.8mm ultra-thin', 'Self-adhesive backing', 'Lifetime warranty', 'SafetyNet™ covered'],
				image: '/brandimages/products/warmup-stickymat-150.webp',
				datasheet: null,
			},
			{
				id: 'wu-02',
				name: 'Warmup StickyMat 200W',
				subtitle: 'High-output for stone floors',
				coverage: '2-5 sqm',
				wattage: '200W',
				priceRange: '₹14,500 – ₹21,000',
				badge: 'POPULAR',
				features: ['FEP dual insulation', 'Pressure sensitive adhesive', 'Lifetime warranty', 'BEAB approved'],
				image: '/brandimages/products/warmup-stickymat-200.webp',
				datasheet: null,
			},
			{
				id: 'wu-03',
				name: 'Warmup Loose Wire System',
				subtitle: 'Custom layouts for irregular rooms',
				coverage: '4-10 sqm',
				wattage: '10W/m',
				priceRange: '₹24,000 – ₹36,000',
				badge: 'PRO',
				features: ['Variable spacing', 'Wet-room safe', 'Lifetime warranty', 'BEAB + UL dual certified'],
				image: '/brandimages/products/warmup-loosewire.webp',
				datasheet: null,
			},
			{
				id: 'wu-04',
				name: 'Warmup 4iE Smart Thermostat',
				subtitle: 'WiFi touchscreen controller',
				coverage: ' ',
				wattage: ' ',
				priceRange: '₹18,000 – ₹24,000',
				badge: 'SMART',
				features: ['Smartphone control', 'Energy monitor', 'Learning algorithm', 'BEAB approved'],
				image: '/brandimages/products/warmup-4ie.webp',
				datasheet: null,
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// 3. ThermoSphere
	// ─────────────────────────────────────────────────────────────
	{
		name: 'ThermoSphere',
		slug: 'thermosphere',
		tag: 'TECHNOLOGY',
		img: '/brandimages/thermosphere.webp',
		heroImage: '/brandimages/thermosphere.webp',
		accentColor: '#6B4A2D',
		desc: "Designed and manufactured in Great Britain with over 25 years of heating innovation. Features the exclusive TwistedTwin™ cable technology, a twisted dual-conductor construction that eliminates electromagnetic fields, minimises cable stress, and delivers industry-leading longevity. IP68 rated, fully earthed, and backed by a Lifetime Guarantee on every system.",
		longDesc:
			"ThermoSphere is the British heating brand that refuses to follow convention. Designed and manufactured in Great Britain, every ThermoSphere system benefits from more than 25 years of heating engineering expertise and a relentless focus on cable reliability.\n\nThe signature TwistedTwin™ cable is a twisted dual-conductor construction, a deliberate departure from the parallel-conductor designs used by most competitors. Twisting the conductors cancels electromagnetic fields to undetectable levels, eliminates cable stress at the point of manufacture, and dramatically reduces the risk of fatigue failure after years of thermal cycling. The result is a system rated IP68 (submersible), fully earthed, and trusted in 30+ countries.\n\nFrom the heat-ready membrane to the dual-conductor foil, every ThermoSphere product is built to outlast the floor covering it sits beneath. Backed by a Lifetime Guarantee and installed exclusively by trained professionals, ThermoSphere is the choice for premium residences, heritage renovations and architect-led commercial projects across India and beyond.",
		established: '1998',
		origin: 'United Kingdom',
		certifications: ['IP68', 'CE', 'RoHS', 'BEAB'],
		warranty: 'Lifetime Guarantee',
		usps: [
			{ icon: 'zap', title: 'TwistedTwin™ Cable', desc: 'Eliminates EMF + cable stress for life-long reliability' },
			{ icon: 'droplet', title: 'IP68 Rated', desc: 'Fully submersible, wet-room & shower safe' },
			{ icon: 'shield', title: 'Lifetime Guarantee', desc: 'On every registered system, no questions' },
			{ icon: 'leaf', title: 'Low EMF', desc: 'Twisted conductors cancel electromagnetic field' },
		],
		stats: [
			{ val: '25yr+', label: 'Innovation' },
			{ val: 'IP68', label: 'Rated' },
			{ val: 'Life', label: 'Time Guarantee' },
		],
		products: [
			{
				id: 'ts-01',
				name: 'ThermoSphere TwistedTwin Mat 150W',
				subtitle: 'British-made low-EMF heating',
				coverage: '1-3 sqm',
				wattage: '150W',
				priceRange: '₹11,000 – ₹15,000',
				badge: 'BESTSELLER',
				features: ['TwistedTwin™ cable', 'Zero measurable EMF', 'Lifetime guarantee', 'IP68 rated'],
				image: '/brandimages/products/thermosphere-mat-150.webp',
				datasheet: null,
			},
			{
				id: 'ts-02',
				name: 'ThermoSphere TwistedTwin Mat 200W',
				subtitle: 'High-output for primary heating',
				coverage: '2-5 sqm',
				wattage: '200W',
				priceRange: '₹16,000 – ₹22,000',
				badge: 'POPULAR',
				features: ['FEP outer jacket', 'Pressure sensitive adhesive', 'Lifetime guarantee', 'BEAB approved'],
				image: '/brandimages/products/thermosphere-mat-200.webp',
				datasheet: null,
			},
			{
				id: 'ts-03',
				name: 'ThermoSphere Membrane',
				subtitle: 'Decoupling + heating in one layer',
				coverage: 'Per sqm',
				wattage: 'Cable sold separately',
				priceRange: '₹2,800 / sqm',
				badge: 'PRO',
				features: ['Anti-fracture membrane', 'Cable channel pre-cut', 'Lifetime guarantee', 'Tile-ready substrate'],
				image: '/brandimages/products/thermosphere-membrane.webp',
				datasheet: null,
			},
			{
				id: 'ts-04',
				name: 'ThermoSphere Smart Control',
				subtitle: 'WiFi touchscreen thermostat',
				coverage: ' ',
				wattage: ' ',
				priceRange: '₹16,000 – ₹21,000',
				badge: 'SMART',
				features: ['App control', 'Geofencing', '7-day schedule', 'BEAB approved'],
				image: '/brandimages/products/thermosphere-control.webp',
				datasheet: null,
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// 4. AmberHeat, KASHMIR-SPECIFIC
	// ─────────────────────────────────────────────────────────────
	{
		name: 'AmberHeat',
		slug: 'amberheat',
		tag: 'RADIANT',
		img: '/brandimages/amberheat.webp',
		heroImage: '/brandimages/amberheat.webp',
		accentColor: '#FF7E5F',
		desc: 'Premium CE certified radiant heating systems engineered for extreme cold climates. AmberHeat systems are specified for Kashmir and high-altitude installations where sustained heat retention during power interruptions is critical. Enhanced thermal mass design delivers 4 to 6 hours of residual warmth after power cut, built for Kashmir winters.',
		longDesc:
			"AmberHeat is the only underfloor heating brand engineered specifically for the extreme winter conditions of Kashmir, Ladakh and the greater Himalayan region. Designed in consultation with heating engineers in Srinagar, Gulmarg, Sonamarg, Pahalgam, Leh, Kargil and Dras, every AmberHeat system is tested to perform continuously in ambient temperatures as low as -25°C.\n\nThe signature Thermal Mass technology uses a high-density composite screed layer that absorbs heat during on-cycles and slowly releases it for 4 to 6 hours after a power cut, a critical lifeline during the load-shedding and snowstorm blackouts that Kashmir valley residents know all too well. Even when the grid is down, your floor stays warm.\n\nFrom the KashmirShield frost-protected entry mat to the Mountain Series 800W system rated for Dras, the world's coldest inhabited place, AmberHeat is the heating brand that understands what 'cold' really means. Installed across 800+ homes in the valley and trusted by leading architects of the Kashmir housing board, AmberHeat is the radiant heating standard for high-altitude India.",
		established: '2014',
		origin: 'India (Kashmir)',
		certifications: ['CE', 'RoHS', 'IPX7', 'BIS'],
		warranty: '15-Year Manufacturer Warranty',
		usps: [
			{ icon: 'snowflake', title: '-25°C Rated', desc: 'Tested for Dras, Kargil & high-altitude Kashmir' },
			{ icon: 'flame', title: '6hr Heat Retention', desc: 'Thermal mass keeps floor warm after power cut' },
			{ icon: 'shield', title: 'Frost-Proof', desc: 'KashmirShield entry mats prevent ice damage' },
			{ icon: 'globe', title: 'Valley Native', desc: 'Engineered in Srinagar for Kashmiri homes' },
		],
		stats: [
			{ val: '-25°C', label: 'Tested To' },
			{ val: '6hr', label: 'Heat Retention' },
			{ val: '800+', label: 'Kashmir Homes' },
		],
		products: [
			{
				id: 'ah-01',
				name: 'AmberHeat KashmirShield 300W',
				subtitle: 'Designed for -25°C extreme cold',
				coverage: '2-4 sqm',
				wattage: '300W',
				priceRange: '₹14,000 – ₹19,000',
				badge: 'KASHMIR',
				features: ['-25°C rated', 'Frost-proof outer sheath', '6hr residual heat', '15yr warranty'],
				image: '/brandimages/products/amberheat-kashmirshield-300.webp',
				datasheet: null,
			},
			{
				id: 'ah-02',
				name: 'AmberHeat ThermalMass Pro 600W',
				subtitle: '6-hour residual heat after power cut',
				coverage: '4-8 sqm',
				wattage: '600W',
				priceRange: '₹24,000 – ₹34,000',
				badge: 'BESTSELLER',
				features: ['High-density composite', '6hr thermal retention', 'Power-cut resilient', '15yr warranty'],
				image: '/brandimages/products/amberheat-thermalmass-600.webp',
				datasheet: null,
			},
			{
				id: 'ah-03',
				name: 'AmberHeat HamamCore 1200W',
				subtitle: 'Electric hamam / steam room system',
				coverage: '2-3 sqm',
				wattage: '1200W',
				priceRange: '₹48,000 – ₹72,000',
				badge: 'PRO',
				features: ['Steam-rated IPX7', 'Epoxy-sealed joints', 'Commercial hamam', '15yr warranty'],
				image: '/brandimages/products/amberheat-hamamcore-1200.webp',
				datasheet: null,
			},
			{
				id: 'ah-04',
				name: 'AmberHeat Mountain Series 800W',
				subtitle: 'Ladakh / Dras extreme-cold rated',
				coverage: '6-10 sqm',
				wattage: '800W',
				priceRange: '₹32,000 – ₹46,000',
				badge: 'EXTREME',
				features: ['-30°C operating range', 'Cold-start capable', '10hr thermal mass', '15yr warranty'],
				image: '/brandimages/products/amberheat-mountain-800.webp',
				datasheet: null,
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// 5. FastWarm
	// ─────────────────────────────────────────────────────────────
	{
		name: 'FastWarm',
		slug: 'fastwarm',
		tag: 'ALL-IN-ONE',
		img: '/brandimages/fastwarm.webp',
		heroImage: '/brandimages/fastwarm.webp',
		accentColor: '#E8933A',
		desc: 'Complete all-in-one heating kits approved to IEC and CE standards, designed for rapid residential and commercial installation. Every kit is supplied in a single box with full-colour instructions and backed by a 25 to 50-year pipe guarantee. Rapid WhatsApp technical support ensures on-site queries are resolved without installation delays.',
		longDesc:
			"FastWarm was created with one simple goal, to make professional-grade underfloor heating as easy to install as it is to specify. Every FastWarm kit is a complete, ready-to-lay heating system supplied in a single box: heating mat or cable, factory-fitted thermostat, floor sensor, fixing strips, conduit, full-colour installation manual, and a unique WhatsApp QR code for instant technical support.\n\nApproved to IEC 60335 and CE standards, FastWarm systems are designed for rapid deployment in both residential and light-commercial environments. The pipe guarantee runs from 25 years on standard kits up to a class-leading 50 years on the Pro Kit series, the longest manufacturer warranty in the Indian market.\n\nWhat really sets FastWarm apart is the human support behind the box. Our in-house engineers are available on WhatsApp during every install, walking you through the layout, the resistance checks, and the thermostat pairing. If something isn't right on site, we resolve it before it becomes a problem. That's why builders across India choose FastWarm.",
		established: '2011',
		origin: 'United Kingdom',
		certifications: ['CE', 'IEC 60335', 'RoHS'],
		warranty: '25-50 Year Pipe Guarantee',
		usps: [
			{ icon: 'package', title: 'All-in-one kit', desc: 'Everything in one box, no surprises' },
			{ icon: 'message-circle', title: 'Rapid install', desc: 'WhatsApp support during installation' },
			{ icon: 'award', title: 'IEC Certified', desc: 'Internationally certified safety' },
			{ icon: 'thermometer', title: 'Full coverage', desc: 'Residential and commercial' },
		],
		stats: [
			{ val: '50yr', label: 'Max Warranty' },
			{ val: '24hr', label: 'Support' },
			{ val: 'IEC', label: 'Certified' },
		],
		products: [
			{
				id: 'fw-01',
				name: 'FastWarm Electric Mat 100W',
				subtitle: 'Ideal for bathrooms & kitchens',
				coverage: '1-2 sqm',
				wattage: '100W',
				priceRange: '₹8,500 – ₹11,000',
				badge: 'BESTSELLER',
				features: ['Ready in 1 box', 'Self-adhesive mesh', '25yr warranty', 'Thermostat compatible'],
				image: '/brandimages/products/fastwarm-mat-100.webp',
				datasheet: null,
			},
			{
				id: 'fw-02',
				name: 'FastWarm Electric Mat 200W',
				subtitle: 'Perfect for living rooms',
				coverage: '2-4 sqm',
				wattage: '200W',
				priceRange: '₹14,000 – ₹18,500',
				badge: 'POPULAR',
				features: ['Double conductor', 'Low EMF', '25yr warranty', 'App-controlled'],
				image: '/brandimages/products/fastwarm-mat-200.webp',
				datasheet: null,
			},
			{
				id: 'fw-03',
				name: 'FastWarm Pro Kit 400W',
				subtitle: 'Large rooms & open plan',
				coverage: '4-8 sqm',
				wattage: '400W',
				priceRange: '₹24,000 – ₹32,000',
				badge: 'PRO',
				features: ['Commercial grade', 'Smart thermostat', '50yr pipe warranty', 'Priority support'],
				image: '/brandimages/products/fastwarm-pro-400.webp',
				datasheet: null,
			},
			{
				id: 'fw-04',
				name: 'FastWarm Loose Cable 500W',
				subtitle: 'Screed & custom shapes',
				coverage: '5-10 sqm',
				wattage: '500W',
				priceRange: '₹28,000 – ₹38,000',
				badge: null,
				features: ['Custom layout', 'Screed compatible', 'Stone & tile floors', '50yr warranty'],
				image: '/brandimages/products/fastwarm-cable-500.webp',
				datasheet: null,
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// 6. nVent
	// ─────────────────────────────────────────────────────────────
	{
		name: 'nVent',
		slug: 'nvent',
		tag: 'RADIANT',
		img: '/brandimages/nvent.png',
		heroImage: '/brandimages/nvent.png',
		accentColor: '#3C2A25',
		desc: "The global leader in electric heat tracing and radiant floor heating, operating across 60+ countries for over 50 years. nVent RAYCHEM pioneered self-regulating heating cable technology and remains the benchmark for industrial-grade residential heating. Systems are IEC certified and backed by a 20-year Total Care Warranty when installed by a Certified PRO installer.",
		longDesc:
			"nVent is the global leader in electric heat tracing and radiant floor heating, with more than 50 years of experience operating across 60+ countries. The nVent RAYCHEM brand pioneered self-regulating heating cable technology in 1973 and remains the benchmark against which all others are measured.\n\nThe T2Red self-regulating floor heating cable automatically adjusts its power output to the floor temperature, drawing more power when the slab is cold and tapering down as it warms. The result is up to 25% energy savings compared with constant-wattage systems, without any compromise in comfort. nVent's programmable WiFi thermostats add learning algorithms and smartphone control, so your floor is always exactly as warm as you want it, exactly when you want it.\n\nEvery nVent residential system is IEC certified and backed by a 20-Year Total Care Warranty when installed by a Certified PRO installer. The Heating Store's nVent PRO installers complete factory training directly with the manufacturer, and our project engineers provide full design support on every commercial quote.",
		established: '1973',
		origin: 'United States',
		certifications: ['IEC', 'CE', 'UL', 'CSA', 'VDE'],
		warranty: '20-Year Total Care Warranty (PRO install)',
		usps: [
			{ icon: 'cpu', title: 'Self-Regulating', desc: 'T2Red cable adjusts output to floor temperature' },
			{ icon: 'trending-down', title: '25% Energy Saved', desc: 'Vs constant-wattage systems, verified' },
			{ icon: 'shield', title: '20yr Total Care', desc: 'Full system warranty with PRO installer' },
			{ icon: 'globe', title: '60+ Countries', desc: 'Trusted on industrial sites worldwide' },
		],
		stats: [
			{ val: '50yr+', label: 'Heritage' },
			{ val: '60+', label: 'Countries' },
			{ val: '25%', label: 'Energy Saved' },
		],
		products: [
			{
				id: 'nv-01',
				name: 'nVent T2Red Self-Regulating Cable',
				subtitle: 'Auto-adjusts output to floor temperature',
				coverage: '2-5 sqm',
				wattage: '5-15W/m',
				priceRange: '₹12,000 – ₹19,000',
				badge: 'BESTSELLER',
				features: ['Self-regulating', 'Cut-to-length on site', '20yr warranty', 'PRO install only'],
				image: '/brandimages/products/nvent-t2red.webp',
				datasheet: null,
			},
			{
				id: 'nv-02',
				name: 'nVent T2Blue 20W/m Mat',
				subtitle: 'Constant-wattage comfort mat',
				coverage: '1-4 sqm',
				wattage: '20W/m',
				priceRange: '₹10,000 – ₹16,000',
				badge: 'POPULAR',
				features: ['FEP insulation', 'Twin conductor', '20yr warranty', 'Thermostat ready'],
				image: '/brandimages/products/nvent-t2blue.webp',
				datasheet: null,
			},
			{
				id: 'nv-03',
				name: 'nVent RAYCHEM SENZ WiFi Thermostat',
				subtitle: 'Premium touchscreen controller',
				coverage: ' ',
				wattage: ' ',
				priceRange: '₹22,000 – ₹28,000',
				badge: 'SMART',
				features: ['Touchscreen UI', 'Energy monitor', 'Adaptive learning', '7-day schedule'],
				image: '/brandimages/products/nvent-senz.webp',
				datasheet: null,
			},
			{
				id: 'nv-04',
				name: 'nVent T2Reflecta Plate Kit',
				subtitle: 'Low-profile aluminium heat-spreading plates',
				coverage: 'Per sqm',
				wattage: 'Plates only',
				priceRange: '₹1,800 / sqm',
				badge: 'PRO',
				features: ['Rapid heat-up', 'No screed needed', '20yr plate warranty', 'Timber-floor ready'],
				image: '/brandimages/products/nvent-reflecta.webp',
				datasheet: null,
			},
		],
	},
];

/**
 * Get a brand by its slug, or null if not found.
 */
export function getBrandBySlug(slug) {
	return BRANDS.find((b) => b.slug === slug) || null;
}

/**
 * Get related brands (excluding the given slug).
 */
export function getRelatedBrands(slug, count = 3) {
	return BRANDS.filter((b) => b.slug !== slug).slice(0, count);
}
