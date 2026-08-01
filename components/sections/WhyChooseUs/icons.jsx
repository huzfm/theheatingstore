'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

export const S = (p) => ({
	width: p.size,
	height: p.size,
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: p.color,
	strokeWidth: p.sw || 1.5,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
});

export const Icon = {
	Customers: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
			<circle cx='9' cy='7' r='4' />
			<path d='M23 21v-2a4 4 0 0 0-3-3.87' />
			<path d='M16 3.13a4 4 0 0 1 0 7.75' />
		</svg>
	),
	Shield: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Systems: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<rect x='2' y='3' width='20' height='14' rx='2' />
			<path d='M8 21h8M12 17v4' />
			<path d='M7 8h.01M11 8h6' />
			<path d='M7 12h.01M11 12h6' />
		</svg>
	),
	Globe: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<circle cx='12' cy='12' r='10' />
			<line x1='2' y1='12' x2='22' y2='12' />
			<path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
		</svg>
	),
	Wrench: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Refresh: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	ClipboardCheck: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' />
			<rect x='9' y='3' width='6' height='4' rx='1' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Ruler: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M3 21h18' />
			<path d='M3 7v1M7 3v4M11 7v1M15 3v4M19 7v1' />
			<path d='M3 3h18v4H3z' />
		</svg>
	),
	MessageCircle: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	Layout: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<rect x='3' y='3' width='18' height='18' rx='2' />
			<line x1='3' y1='9' x2='21' y2='9' />
			<line x1='9' y1='21' x2='9' y2='9' />
		</svg>
	),
	Package: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<line x1='16.5' y1='9.4' x2='7.5' y2='4.21' />
			<path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
			<polyline points='3.27 6.96 12 12.01 20.73 6.96' />
			<line x1='12' y1='22.08' x2='12' y2='12' />
		</svg>
	),
	Tool: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Award: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<circle cx='12' cy='8' r='6' />
			<path d='M15.477 12.89L17 22l-5-3-5 3 1.523-9.11' />
		</svg>
	),
	Layers: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polygon points='12 2 2 7 12 12 22 7 12 2' />
			<polyline points='2 17 12 22 22 17' />
			<polyline points='2 12 12 17 22 12' />
		</svg>
	),
	BoxOpen: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polyline points='21 8 21 21 3 21 3 8' />
			<rect x='1' y='3' width='22' height='5' />
			<line x1='10' y1='12' x2='14' y2='12' />
		</svg>
	),
	HardHat: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z' />
			<path d='M10 10V5a2 2 0 1 1 4 0v5' />
			<path d='M4 15V9a8 8 0 0 1 16 0v6' />
		</svg>
	),
	BadgeCheck: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Chat: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	RotateCw: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	Star: ({ size = 13, color = '#F5B97A' }) => (
		<svg width={size} height={size} viewBox='0 0 24 24' fill={color} stroke={color} strokeWidth='0'>
			<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
		</svg>
	),
	Quote: ({ size = 36, color = 'currentColor', opacity = 1 }) => (
		<svg width={size} height={size} viewBox='0 0 24 24' fill={color} stroke='none' opacity={opacity}>
			<path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
		</svg>
	),
	ArrowRight: ({ size = 16, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2 })}>
			<line x1='5' y1='12' x2='19' y2='12' />
			<polyline points='12 5 19 12 12 19' />
		</svg>
	),
	ChevronLeft: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2.2 })}>
			<polyline points='15 18 9 12 15 6' />
		</svg>
	),
	ChevronRight: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2.2 })}>
			<polyline points='9 18 15 12 9 6' />
		</svg>
	),
};
