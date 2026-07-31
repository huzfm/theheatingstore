// ─────────────────────────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
	amber: '#E8933A',
	amberLt: '#F5B97A',
	coral: '#FF7E5F',
	text: '#FBF3EA',
	soft: 'rgba(251,243,234,0.60)',
	mute: 'rgba(251,243,234,0.40)',
	line: 'rgba(255,255,255,0.09)',
	glass: 'rgba(255,255,255,0.045)',
	glassBorder: 'rgba(255,255,255,0.10)',
};

export const EASE = [0.16, 1, 0.3, 1];

// Hero copy stagger — same pattern as GlobalExperienceClient's GlobalHero.
export const staggerContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
export const staggerItem = {
	hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
	show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
};

// Country ledger — quiet geographic expansion, not a bounce-in chip grid.
export const countryContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};
export const countryItem = {
	hidden: { opacity: 0, x: -10 },
	show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

// Reliability index — descending list reveal (ReliabilityGlobal, Phase 2 rebuild).
export const listStagger = {
	hidden: {},
	show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
export const listItem = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
