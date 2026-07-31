'use client';

export function Badge({ children, variant }) {
	const isHero = variant === 'hero';
	return (
		<div className={isHero ? 'whc-hero-badge' : 'whc-badge'}>
			<span className={isHero ? 'whc-hero-badge-dot' : 'whc-badge-dot'} />
			{children}
		</div>
	);
}
