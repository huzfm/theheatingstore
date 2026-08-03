// ─────────────────────────────────────────────────────────────────────────────
// CONTACT — content data
// Facts (phone, emails, coverage areas, response windows) are carried over
// verbatim from the previous ContactClient implementation; nothing below is
// an invented statistic or claim. Only the presentation and structure change.
// ─────────────────────────────────────────────────────────────────────────────

export const PHONE_DISPLAY = '+91 90709 07035';
export const PHONE_TEL = '+919070907035';
export const WHATSAPP_URL = 'https://wa.me/919070907035';

export const LOCATIONS = ['Kashmir', 'Jammu', 'Ladakh'];

export const PROJECT_TYPES = ['New Construction', 'Renovation', 'Bathroom / Hamam', 'Full Home'];

export const FLOORING_TYPES = ['Marble', 'Granite', 'Ceramic Tile', 'Natural Stone', 'Engineered Wood'];

// Primary + supporting service channels — one dominant method, three quieter
// ones, rather than four equal dashboard cards.
export const CONTACT_METHODS = {
	primary: {
		tag: 'Call',
		title: 'Speak directly with our team',
		desc: 'For installation questions, site survey bookings, or a straight answer on whether your space is a fit, call our technical team directly.',
		meta: 'Monday to Saturday, 9am – 7pm IST',
		cta: 'Call ' + PHONE_DISPLAY,
		href: `tel:${PHONE_TEL}`,
	},
	supporting: [
		{
			tag: 'WhatsApp',
			title: 'Send plans or room photos',
			desc: 'Share room dimensions or photos of your space and get an initial read from our team within two hours during business hours.',
			cta: 'Open WhatsApp',
			href: WHATSAPP_URL,
			external: true,
		},
		{
			tag: 'Site Survey',
			title: 'Book an engineering visit',
			desc: 'Our engineer visits your home across J&K and Ladakh, assesses the substrate, and provides a written quotation on site.',
			cta: 'Book a Survey',
			href: '#consultation',
		},
		{
			tag: 'Email',
			title: 'For detailed project enquiries',
			desc: 'Installation and trade enquiries, reviewed personally by our team within one business day.',
			cta: 'support@electrichamam.in',
			href: 'mailto:support@electrichamam.in',
		},
	],
};

// Regional coverage — replaces the North/Central/South Kashmir card grid
// with the three regions the intake form itself asks about.
export const REGIONS = [
	{
		code: '01',
		name: 'Kashmir',
		summary: 'Srinagar to Sopore, Anantnag to Baramulla. Our founding market and the deepest bench of installation experience.',
		areas: ['Srinagar', 'Baramulla', 'Anantnag', 'Sopore', 'Kupwara', 'Pulwama', 'Shopian', 'Ganderbal'],
		response: '24–48 hrs',
	},
	{
		code: '02',
		name: 'Jammu',
		summary: 'Jammu city and the surrounding hill districts, configured for a milder valley climate and colder Udhampur elevations alike.',
		areas: ['Jammu City', 'Kathua', 'Udhampur', 'Samba', 'Reasi', 'Ramban', 'Rajouri', 'Poonch'],
		response: '48–72 hrs',
	},
	{
		code: '03',
		name: 'Ladakh',
		summary: 'Leh, Kargil and surrounding villages. High-output systems and reinforced layering, specified for altitude and ground frost.',
		areas: ['Leh Town', 'Kargil', 'Nubra Valley', 'Zanskar', 'Drass', 'Diskit', 'Padum', 'Khaltsi'],
		response: '72–96 hrs',
	},
];

export const TRUST_STRIP = [
	{ label: 'Site Survey', value: 'Available across J&K & Ladakh' },
	{ label: 'Response', value: 'Usually within 24 hours' },
	{ label: 'Engineering', value: 'Professional system design' },
	{ label: 'Support', value: 'Post-installation assistance' },
];

export const SHOWROOM = {
	city: 'Srinagar, Kashmir',
	address: 'Lal Chowk, Srinagar, Jammu and Kashmir',
	hours: 'Saturday to Thursday, 10am – 6pm',
	mapsUrl: 'https://maps.google.com/?q=Lal+Chowk,+Srinagar,+Jammu+and+Kashmir',
	embedSrc:
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3300!2d74.7973!3d34.0836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1855f5454a0c1%3A0x7f39f9d5a9e3c2b0!2sLal%20Chowk%2C%20Srinagar%2C%20Jammu%20%26%20Kashmir!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin',
};
