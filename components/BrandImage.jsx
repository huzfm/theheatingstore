'use client';

/**
 * BrandImage
 * ─────────────────────────────────────────────────────────────
 * Tries to load the actual image first. On error, falls back to
 * a beautiful gradient placeholder using the brand's accentColor.
 *
 * Props:
 *   src          – image URL (may be null / missing)
 *   alt          – alt text
 *   accentColor  – brand accent (e.g. '#E8933A')
 *   fallbackText – text/initials to show on placeholder
 *   height       – container height (default 180)
 *   width        – container width  (default '100%')
 *   rounded      – border-radius    (default 16)
 *   className    – extra classes
 *   style        – extra style
 *   objectFit    – 'cover' | 'contain' (default 'cover')
 *   priority     – hint to skip fade-in for above-the-fold
 */
import { useState, useMemo } from 'react';

export default function BrandImage({
	src,
	alt = '',
	accentColor = '#B86B45',
	fallbackText = '',
	height = 180,
	width = '100%',
	rounded = 16,
	className = '',
	style = {},
	objectFit = 'cover',
	priority = false,
}) {
	const [errored, setErrored] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// Derive gradient from accentColor
	const gradient = useMemo(() => {
		return `linear-gradient(135deg, ${accentColor}22, ${accentColor}55, ${accentColor}33)`;
	}, [accentColor]);

	// Initials from alt or fallbackText
	const initials = useMemo(() => {
		const text = (fallbackText || alt || '').trim();
		if (!text) return '';
		const parts = text.split(/\s+/);
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}, [alt, fallbackText]);

	const showImage = src && !errored;

	return (
		<div
			className={`brand-image-wrap ${className}`}
			style={{
				position: 'relative',
				width,
				height,
				borderRadius: rounded,
				overflow: 'hidden',
				background: gradient,
				...style,
			}}
		>
			{/* Gradient fallback layer (always rendered behind for smooth transitions) */}
			<div
				aria-hidden={showImage}
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: gradient,
					opacity: showImage ? (loaded ? 0 : 1) : 1,
					transition: 'opacity 0.5s ease',
					pointerEvents: 'none',
				}}
			>
				{initials && (
					<span
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(40px, 7vw, 80px)',
							fontWeight: 600,
							letterSpacing: '-0.02em',
							color: '#ffffff',
							textShadow: '0 2px 12px rgba(0,0,0,0.18)',
							userSelect: 'none',
						}}
					>
						{initials}
					</span>
				)}
			</div>

			{/* Actual image (rendered when src exists) */}
			{src && (
				<img
					src={src}
					alt={alt}
					loading={priority ? 'eager' : 'lazy'}
					onLoad={() => setLoaded(true)}
					onError={() => setErrored(true)}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit,
						opacity: errored ? 0 : loaded || priority ? 1 : 0,
						transition: 'opacity 0.5s ease',
					}}
				/>
			)}
		</div>
	);
}
