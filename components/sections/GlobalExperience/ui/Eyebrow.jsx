'use client';

// Small technical label used above every section heading, e.g.
// "GLOBAL FOOTPRINT / 08 MARKETS". A thin copper tick precedes the text
// instead of the glowing dot used on the site's other pages.
export default function Eyebrow({ children, className = '' }) {
	return (
		<div className={`ge-eyebrow ${className}`}>
			<span className='ge-eyebrow-tick' aria-hidden='true' />
			{children}
		</div>
	);
}
