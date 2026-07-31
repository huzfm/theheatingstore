'use client';

import { Badge } from './Badge';

export function SectionHeading({ badge, title, accent, sub, center = false, as = 'h2' }) {
	const Tag = as;
	return (
		<div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 620 : 'none', margin: center ? '0 auto' : 0 }}>
			<Badge>{badge}</Badge>
			<Tag className='whc-h'>
				{title}
				{accent && <span className='whc-h-accent'> {accent}</span>}
			</Tag>
			{sub && (
				<p className='whc-sub' style={{ maxWidth: center ? 560 : 560, margin: center ? '18px auto 0' : '18px 0 0' }}>
					{sub}
				</p>
			)}
		</div>
	);
}
