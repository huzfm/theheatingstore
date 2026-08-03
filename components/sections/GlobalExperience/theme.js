// ─────────────────────────────────────────────────────────────────────────────
// PALETTE — aliased 1:1 onto the site-wide amber/coral/ivory system defined
// in WhyChooseUs/theme.js, so this page reads as the same brand. Names stay
// page-local (bg0, copper, ivory…) since components already reference them.
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
	bg0: '#0D0805',
	bg1: '#150D07',
	bg2: '#1A0F08',
	ivory: '#FBF3EA',
	ivorySoft: 'rgba(251,243,234,0.60)',
	ivoryMute: 'rgba(251,243,234,0.40)',
	copperDeep: '#E8933A',
	copper: '#F5B97A',
	copperLight: '#FF7E5F',
	line: 'rgba(255,255,255,0.09)',
	lineStrong: 'rgba(255,255,255,0.16)',
};

export const EASE = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

export const staggerContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItem = {
	hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
	show: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.9, ease: EASE },
	},
};

export const fadeUp = {
	hidden: { opacity: 0, y: 22 },
	show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const clipReveal = {
	hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0.4 },
	show: {
		clipPath: 'inset(0 0 0% 0)',
		opacity: 1,
		transition: { duration: 1.1, ease: EASE },
	},
};
