'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep, clamp, mapRange } from '@/lib/three-utils';
import {
  kashmiriCarpetAlbedo,
  kashmiriCarpetRoughness,
  kashmiriCarpetNormal,
  carpetFringeAlpha,
  carpetFringeNormal,
} from '@/lib/textures';
import { MAT_W, MAT_L } from './constants';

const W = MAT_W + 0.5;
const L = MAT_L + 0.5;
const HALF_L = L / 2;
const CARPET_Y = 0.085;

/* Roll geometry constants, shared between the JS-side visibility gates and
   the GLSL spiral below, kept in one place so the two can't drift apart. */
const ROLL_R0 = 0.05; // starting coil radius
const ROLL_B = 0.05; // radius growth per radian, the coil thickens turn to turn
const ROLL_OVERRUN = 0.35; // extra travel so the front sweeps clear past the far edge

/**
 * Vertex-shader carpet roll, injected into a stock MeshStandardMaterial via
 * onBeforeCompile rather than a bespoke ShaderMaterial.
 *
 * Why onBeforeCompile and not a raw shader: a from-scratch material would
 * have to reimplement PBR lighting and environment-map reflection by hand to
 * match the rest of the scene, which StudioEnvironment depends on for every
 * other surface to read as "real" rather than flat. Patching the standard
 * chunks keeps all of that and only touches vertex position/normal.
 *
 * The math: `uProgress` sweeps a roll front from the carpet's start edge to
 * its far edge. Material behind the front is untouched (still flat on the
 * floor). Material the front has already passed is walked along an
 * Archimedean spiral, arc length in = arc length along the spiral, so the
 * fabric doesn't stretch or compress as it winds, and each additional turn
 * sits at a larger radius than the last, exactly like paper or fabric
 * actually rolls. The starting tangent of that spiral matches the flat
 * plane's tangent exactly, so there's no crease at the roll front.
 */
function patchCarpetRollShader(shader) {
  shader.uniforms.uProgress = { value: 0 };
  shader.vertexShader = `uniform float uProgress;\n${shader.vertexShader}`;

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    vec3 objectNormal = vec3( normal );

    float halfL = ${HALF_L.toFixed(4)};
    float rollFront = halfL - uProgress * (2.0 * halfL + ${ROLL_OVERRUN.toFixed(4)});
    float carpetCoord = position.y;
    bool carpetRolled = carpetCoord >= rollFront;
    float carpetTheta = 0.0;
    if (carpetRolled) {
      float d = carpetCoord - rollFront;
      float R0 = ${ROLL_R0.toFixed(4)};
      float B = ${ROLL_B.toFixed(4)};
      carpetTheta = (-R0 + sqrt(R0 * R0 + 2.0 * B * d)) / B;
      objectNormal = vec3(0.0, -sin(carpetTheta), cos(carpetTheta));
    }
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    vec3 transformed = vec3( position );
    if (carpetRolled) {
      float R0 = ${ROLL_R0.toFixed(4)};
      float B = ${ROLL_B.toFixed(4)};
      float R = R0 + B * carpetTheta;
      transformed.y = rollFront + R * sin(carpetTheta);
      transformed.z = R * (1.0 - cos(carpetTheta));
    }
    `
  );
}

/**
 * Fringe, a thin alpha-cut strip of individual strands along each end (the
 * edges perpendicular to the roll axis, so the roll consumes them naturally
 * rather than cutting through them). Not deformed by the roll shader, that
 * math only holds for the flat weave; instead each strip's own opacity is
 * gated to the moment the roll front reaches it.
 */
function CarpetFringe({ side, rollRef, alphaMap, normalMap }) {
  const ref = useRef(null);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = rollRef.current;
    // The far edge (side -1) is where the roll starts, consumed almost
    // immediately. The near edge (side 1) survives until the roll finishes.
    const opacity = side < 0 ? 1 - smoothstep(t * 6) : 1 - smoothstep(mapRange(t, 0.82, 1, 0, 1));
    mesh.material.opacity = opacity;
    mesh.visible = opacity > 0.01;
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, CARPET_Y - 0.006, side * -(HALF_L + 0.07)]}
    >
      <planeGeometry args={[W * 0.95, 0.14, 24, 1]} />
      <meshStandardMaterial
        color="#e9d9ab"
        alphaMap={alphaMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.9, 0.9)}
        transparent
        opacity={1}
        roughness={0.85}
        metalness={0}
        envMapIntensity={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function CarpetLayerImpl({ progressRef }) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const shaderRef = useRef(null);
  const rollRef = useRef(0);

  const albedo = useMemo(() => kashmiriCarpetAlbedo(), []);
  const roughness = useMemo(() => kashmiriCarpetRoughness(), []);
  const normal = useMemo(() => kashmiriCarpetNormal(), []);
  const fringeAlpha = useMemo(() => carpetFringeAlpha(), []);
  const fringeNormal = useMemo(() => carpetFringeNormal(), []);

  const geometry = useMemo(() => new THREE.PlaneGeometry(W, L, 48, 36), []);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: albedo,
      roughnessMap: roughness,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.7, 0.7),
      color: '#ffffff',
      roughness: 0.92,
      metalness: 0.02,
      envMapIntensity: 0.6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    });
    // Own cache key: without it three can reuse a compiled program from a
    // material that never called onBeforeCompile, silently dropping the roll.
    mat.customProgramCacheKey = () => 'carpet-roll';
    mat.onBeforeCompile = (shader) => {
      patchCarpetRollShader(shader);
      shaderRef.current = shader;
    };
    return mat;
  }, [albedo, roughness, normal]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = smoothstep(stageProgress(progressRef.current, ...TIMELINE.carpetRoll));
    rollRef.current = damp(rollRef.current, target, 6, dt);

    if (shaderRef.current) {
      shaderRef.current.uniforms.uProgress.value = rollRef.current;
    }

    // Warm sheen during the pre-roll hold: envMapIntensity peaks while the
    // carpet sits still and the camera holds its establishing shot, so the
    // pile and medallion detail register as a hero surface before attention
    // shifts to the roll itself, then it settles back once rolling starts.
    const introHold = 1 - smoothstep(mapRange(progressRef.current, 0, TIMELINE.carpetRoll[0], 0, 1));
    material.envMapIntensity = 0.6 + introHold * 0.5;

    // Once fully coiled, the roll itself is a static tube taking up no
    // scroll-progress budget, so it's carried off screen and hidden rather
    // than left sitting mid-frame costing render time for nothing on view.
    const exitT = clamp(mapRange(rollRef.current, 0.9, 1, 0, 1));
    const group = groupRef.current;
    if (group) {
      group.position.y = damp(group.position.y, exitT * 1.8, 5, dt);
      group.position.x = damp(group.position.x, -exitT * 1.4, 5, dt);
      group.visible = exitT < 0.995;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, CARPET_Y, 0]} geometry={geometry}>
        <primitive object={material} attach="material" />
      </mesh>
      <CarpetFringe side={-1} rollRef={rollRef} alphaMap={fringeAlpha} normalMap={fringeNormal} />
      <CarpetFringe side={1} rollRef={rollRef} alphaMap={fringeAlpha} normalMap={fringeNormal} />
    </group>
  );
}

export const CarpetLayer = memo(CarpetLayerImpl);
export { W as LAYER_W, L as LAYER_L };
