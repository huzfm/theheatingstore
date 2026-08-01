'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

// Tracks the site's lg breakpoint so pointer-only interactions (magnetic
// CTAs) never arm themselves on touch devices.
export function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia('(min-width: 1024px)');
		const sync = () => setIsDesktop(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);
	return isDesktop;
}

// Cursor-magnet interaction for the page's primary CTAs, matching the
// physics used on Local Experience and How It Works.
export function useMagnetic({ strength = 0.35, max = 16, disabled = false } = {}) {
	const ref = useRef(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
	const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

	const onMouseMove = (e) => {
		if (disabled || !ref.current) return;
		const r = ref.current.getBoundingClientRect();
		const dx = e.clientX - (r.left + r.width / 2);
		const dy = e.clientY - (r.top + r.height / 2);
		x.set(Math.max(-max, Math.min(max, dx * strength)));
		y.set(Math.max(-max, Math.min(max, dy * strength)));
	};
	const onMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
}
