'use client';

export function Flag({ code, name }) {
	return (
		<img
			src={`https://flagcdn.com/w40/${code}.png`}
			srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
			width={20}
			height={15}
			alt={name}
			style={{ borderRadius: 2, objectFit: 'cover', flexShrink: 0, minWidth: 20 }}
		/>
	);
}
