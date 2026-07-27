'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient hero accent, a slow-rotating serpentine heating-cable line sitting
 * behind the hero copy. Purely decorative (like the CSS aura orbs, just in
 * 3D): no orbit controls, no pointer interaction, low poly count. Geometry
 * is useMemo'd so it builds once; all motion is imperative via useFrame so
 * the React tree never re-renders while it spins.
 */

function useCableCurve() {
	return useMemo(() => {
		const rows = 5;
		const halfW = 1.2;
		const zStart = -0.9;
		const gap = (0.9 * 2) / (rows - 1);
		const pts = [];
		for (let i = 0; i < rows; i += 1) {
			const z = zStart + i * gap;
			const ltr = i % 2 === 0;
			pts.push(new THREE.Vector3(ltr ? -halfW : halfW, 0, z));
			pts.push(new THREE.Vector3(ltr ? halfW : -halfW, 0, z));
			if (i < rows - 1) {
				pts.push(new THREE.Vector3(ltr ? halfW + 0.24 : -halfW - 0.24, 0, z + gap / 2));
			}
		}
		return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
	}, []);
}

function Cable() {
	const group = useRef(null);
	const bead = useRef(null);
	const flow = useRef(0);
	const curve = useCableCurve();
	const tube = useMemo(() => new THREE.TubeGeometry(curve, 128, 0.045, 8, false), [curve]);

	useFrame((_, delta) => {
		const d = Math.min(delta, 0.05);
		flow.current = (flow.current + d * 0.1) % 1;
		if (group.current) {
			group.current.rotation.y += d * 0.12;
		}
		if (bead.current) {
			const p = curve.getPointAt(flow.current);
			bead.current.position.set(p.x, p.y, p.z);
		}
	});

	return (
		<group ref={group} rotation={[-Math.PI * 0.38, 0.3, 0]}>
			<mesh geometry={tube}>
				<meshStandardMaterial
					color='#E8933A'
					emissive='#E8933A'
					emissiveIntensity={0.75}
					roughness={0.35}
					metalness={0.25}
				/>
			</mesh>
			<mesh ref={bead}>
				<sphereGeometry args={[0.09, 12, 12]} />
				<meshStandardMaterial color='#FFF2E0' emissive='#FFB88C' emissiveIntensity={1.6} />
			</mesh>
		</group>
	);
}

export default function HeroScene3D() {
	return (
		<Canvas
			flat
			dpr={[1, 1.5]}
			camera={{ position: [0, 1.2, 4.8], fov: 38 }}
			gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
			style={{ width: '100%', height: '100%' }}>
			<ambientLight intensity={0.5} />
			<hemisphereLight args={['#3a2414', '#0d0805', 0.6]} />
			<directionalLight position={[3, 4, 4]} intensity={1.1} color='#FFD9A8' />
			<directionalLight position={[-4, 2, 2]} intensity={0.5} color='#FF7E5F' />
			<Cable />
		</Canvas>
	);
}
