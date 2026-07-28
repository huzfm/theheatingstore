'use client';

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, clamp } from '@/lib/three-utils';
import { radialGlow, cableSheath, cableHeat } from '@/lib/textures';

/**
 * The serpentine run a heating cable actually takes: straight passes along
 * X, stepping over in Z, alternating direction.
 *
 * A centripetal Catmull-Rom rounds the U-turns without the overshoot a
 * uniform/chordal curve produces, overshoot would push the cable outside
 * the mat edge at every turn, which reads as a modelling bug.
 */
export function createSerpentinePath({ width, length, spacing, margin = 0.1 }) {
  const halfW = width / 2 - margin;
  const halfL = length / 2 - margin;
  const points = [];

  let dir = 1;
  for (let z = -halfL; z <= halfL + 0.0001; z += spacing) {
    points.push(new THREE.Vector3(-halfW * dir, 0, z));
    points.push(new THREE.Vector3(halfW * dir, 0, z));
    dir *= -1;
  }

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
  // three.js defaults to 200 arc-length divisions no matter how many control
  // points there are, which distributes tube segments unevenly on long runs.
  curve.arcLengthDivisions = Math.min(2000, points.length * 8);
  return curve;
}

/**
 * Adhesive fixing tabs.
 *
 * On a real mat the cable is bonded to the scrim at intervals, it doesn't
 * float. The tabs are small and mostly read as a rhythm of dark ticks along
 * the run, but that rhythm is a strong "this is a manufactured assembly"
 * cue. One InstancedMesh, so they cost a single draw call.
 */
function FixingTabs({ curve, count = 130 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const tangent = new THREE.Vector3();
    const ahead = new THREE.Vector3();
    const point = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      const t = (i + 0.5) / count;
      curve.getPointAt(t, point);
      curve.getTangentAt(t, tangent);
      // Small enough that the lookahead stays inside one pass, so a tab in
      // the middle of a straight run isn't rejected by the bend after it.
      curve.getTangentAt(Math.min(1, t + 0.0008), ahead);

      /**
       * Skip tabs that land on a return bend, on a real mat they're applied
       * to the straight runs and one wrapped around a tight turn looks wrong.
       *
       * Measured as local curvature rather than "is the tangent parallel to
       * X". The passes on a mat run across the strip, not along the mat, so
       * an axis test answers for the wrong axis; this one holds whichever way
       * the run is oriented.
       */
      const straightness = tangent.dot(ahead);

      dummy.position.copy(point);
      dummy.position.y -= 0.0045;
      dummy.quaternion.setFromUnitVectors(up, tangent.clone().normalize());
      dummy.rotateX(Math.PI / 2);
      dummy.scale.setScalar(straightness > 0.995 ? 1 : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [curve, count]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      {/* Small and dim on purpose. At the previous size and near-white
          colour these read as confetti scattered over the mat, they should
          be a quiet rhythm of ticks you notice only on close inspection. */}
      <boxGeometry args={[0.016, 0.004, 0.011]} />
      <meshStandardMaterial color="#8d8578" roughness={0.9} metalness={0.05} />
    </instancedMesh>
  );
}

/**
 * The heating cable.
 *
 * Proportions follow real product spec rather than modelling convenience:
 * mats run 50mm cable spacing with a 1.8–3.4mm cable, so the run is dense
 * and thin rather than a few fat loops.
 *
 * The premium read comes from three things layered on that:
 *  - a braided sheath map, so it has surface construction rather than being
 *    a smooth extrusion
 *  - an emissive map scrolled along the run, so heat visibly travels through
 *    the cable instead of the whole thing blinking in unison
 *  - an additive outer shell, which fakes the light bleed a bloom pass would
 *    give at a fraction of the cost
 *
 * All animation mutates material/object properties in useFrame, this mounts
 * once and never re-renders.
 *
 * `levelRef` is an optional 0→1 ref scaling how powered the cable looks, for
 * callers that need it to go genuinely cold and light up again (the About
 * story rail). Omitting it pins the level at 1, which is the original
 * behaviour exactly, `intensity * 1` is the expression that was there.
 *
 * `curve` overrides the built-in serpentine. The heating mat passes one in
 * (see mat-layout.js) because a mat's run is strip-by-strip rather than a
 * single sweep of the whole floor; callers that just want a plain serpentine,
 * like the hero's pipe network, omit it and get the same path as before.
 */
function CableModel({
  width,
  length,
  spacing = 0.088,
  radius = 0.005,
  intensity = 0.9,
  pulses = 2,
  levelRef = null,
  curve: curveProp = null,
}) {
  const materialRef = useRef(null);
  const shellRef = useRef(null);
  const pulseRefs = useRef([]);

  const glow = useMemo(() => radialGlow(), []);
  const sheath = useMemo(() => cableSheath(), []);
  const heat = useMemo(() => cableHeat(), []);

  const curve = useMemo(
    () => curveProp ?? createSerpentinePath({ width, length, spacing }),
    [curveProp, width, length, spacing]
  );

  /**
   * Segment count scales with cable length so curvature stays smooth at any
   * spacing, a fixed count goes polygonal on the U-turns once the run gets
   * long. Radial segments stay low: at this diameter the silhouette is a
   * couple of pixels wide.
   *
   * The density is set by the tightest feature on the run, which is the
   * return bend: half a circle of radius spacing/2, so ~0.12 units of arc
   * that needs ~10 segments to stop looking chamfered. At the old 12 per unit
   * a bend got under two segments and every turn on the mat was a visible
   * corner. 46 per unit is ~35k triangles on the mat's run, which is cheap in
   * a scene with no shadow maps and no post-processing.
   */
  const { geometry, shellGeometry } = useMemo(() => {
    const segments = Math.min(3400, Math.max(400, Math.round(curve.getLength() * 46)));
    return {
      geometry: new THREE.TubeGeometry(curve, segments, radius, 6, false),
      // Coarser: it's a soft blur, nobody resolves its silhouette.
      shellGeometry: new THREE.TubeGeometry(curve, Math.round(segments / 2.5), radius * 2.8, 5, false),
    };
  }, [curve, radius]);

  useEffect(() => {
    // Three does not garbage collect GPU resources.
    const sheathTexture = sheath;
    const heatTexture = heat;
    return () => {
      geometry.dispose();
      shellGeometry.dispose();
      // Textures are shared + cached, so they're released by disposeTextures.
      void sheathTexture;
      void heatTexture;
    };
  }, [geometry, shellGeometry, sheath, heat]);

  /**
   * Tiling is set here rather than in the texture factory because it depends
   * on this cable's length: the sheath braid must stay a constant physical
   * pitch regardless of how long the run is, so it scales with the curve.
   */
  useLayoutEffect(() => {
    if (sheath) {
      sheath.wrapS = THREE.RepeatWrapping;
      sheath.wrapT = THREE.RepeatWrapping;
      sheath.repeat.set(curve.getLength() * 1.1, 1);
      sheath.needsUpdate = true;
    }
    if (heat) {
      heat.wrapS = THREE.RepeatWrapping;
      heat.repeat.set(3.5, 1);
      heat.needsUpdate = true;
    }
  }, [curve, sheath, heat]);

  const glowColor = useMemo(
    () => new THREE.Color(PALETTE.heat400).multiplyScalar(1.8),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    const level = levelRef ? clamp(levelRef.current, 0, 1) : 1;

    // Scroll the heat map along the cable. Offset rather than a shader
    // uniform, so this needs no custom material and can't break across
    // three.js versions.
    if (heat) heat.offset.x = (heat.offset.x - dt * 0.055) % 1;

    if (materialRef.current) {
      // Slow breath on top of the travelling gradient.
      materialRef.current.emissiveIntensity = intensity * level * (1 + Math.sin(t * 1.4) * 0.28);
    }
    if (shellRef.current) {
      shellRef.current.material.opacity = (0.1 + Math.sin(t * 1.4) * 0.035) * level;
    }

    for (let i = 0; i < pulseRefs.current.length; i += 1) {
      const sprite = pulseRefs.current[i];
      if (!sprite) continue;
      const phase = (t * 0.11 + i / pulses) % 1;
      curve.getPointAt(phase, sprite.position);
      sprite.position.y += 0.02;
      // Scaled by level rather than faded: at level 0 the sprite collapses to
      // nothing, so an unpowered cable has no travelling highlight crawling
      // along it at zero opacity.
      sprite.scale.setScalar((0.14 + Math.sin(phase * Math.PI) * 0.09) * level);
    }
  });

  return (
    <group>
      {/* Soft outer shell, additive, backside, so it reads as light bleeding
          off the cable rather than a second solid tube around it. */}
      <mesh ref={shellRef} geometry={shellGeometry}>
        <meshBasicMaterial
          color={PALETTE.heat600}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh geometry={geometry}>
        {/* toneMapped={false} keeps the emissive from being crushed by the
            ACES curve, so the cable stays saturated orange rather than
            washing toward white. */}
        <meshStandardMaterial
          ref={materialRef}
          map={sheath}
          emissiveMap={heat}
          color="#c05a1e"
          emissive={PALETTE.heat500}
          emissiveIntensity={intensity}
          roughness={0.38}
          metalness={0.25}
          envMapIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      <FixingTabs curve={curve} />

      {/* Travelling highlights. Sprites: one camera-facing quad each,
          additive, so they read as light rather than geometry. */}
      {Array.from({ length: pulses }).map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <spriteMaterial
            map={glow}
            color={glowColor}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
            toneMapped={false}
            opacity={0.7}
          />
        </sprite>
      ))}
    </group>
  );
}

export default memo(CableModel);
