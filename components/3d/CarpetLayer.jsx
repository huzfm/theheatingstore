'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep, clamp } from '@/lib/three-utils';
import { carpetAlbedo, carpetAlpha, carpetRoughness, groundShadow } from '@/lib/textures';
import { LAYER_W, LAYER_L, TILE_Y, TILE_H } from './FloorLayers';

/**
 * Layer 01, a Kashmiri carpet laid over the finished floor, which rolls itself
 * up to reveal the tile beneath.
 *
 * The one layer here that isn't part of the build-up: everything below is
 * installed once and never seen again, and this is what actually gets walked
 * on. It doesn't span the full slab, a rug that ran wall to wall would read
 * as another layer of flooring rather than as furnishing.
 *
 * Why a rolled reveal and not the lift-and-dissolve the layers below use:
 * a slab of screed can plausibly rise and fade, a rug cannot. Cloth has one
 * honest way to leave a floor, and faking it with opacity was what made the
 * first pass read as a sticker.
 *
 * Note this rolls *up* as the visitor scrolls down, matching the section's
 * top-to-bottom peel. Scrubbing back up unrolls it, which is the same
 * animation run backwards, and is why the maths below is written as an
 * absolute function of scroll progress with no accumulated state.
 */

/* ── Footprint ────────────────────────────────────────────────────────
   The full floor slab, identical to the tile layer below it, so the stack
   reads as one uniform block of layers rather than a rug sitting on a
   plinth. generate-layer-assets.mjs crops the texture to this exact aspect
   (it derives it from the same MAT_W/MAT_L primitives), so the weave lands
   unstretched, change one and the other has to follow. */
const CARPET_W = LAYER_W;
const PLANE_L = LAYER_L;

/**
 * Heights, measured off the finished floor.
 *
 * TILE_Y + half TILE_H puts the tile's top face at 0.1005, and both planes
 * here clear it by several millimetres: the first pass had the contact shadow
 * 0.001 above the tile, which z-fought and rendered as flat dark blocks
 * punched through the carpet. Read off the tile's own constants rather than
 * written down, because they moved once already when the adhesive bed was
 * removed and the tiles dropped onto the mat, and a copied number would have
 * left the rug hovering 70mm above its floor.
 */
const CARPET_Y = TILE_Y + TILE_H / 2 + 0.0125;
const SHADOW_Y = TILE_Y + TILE_H / 2 + 0.0055;

/**
 * Pile thickness, used only to grow the roll. The rug renders as a single
 * plane, a real slab would need its own side faces, and those are exactly
 * what produced the striped edge in the first pass: a box gives all six faces
 * the full 0–1 UV range, so a 0.032-tall side face squashed the whole 1024px
 * carpet into a sliver and rendered it as horizontal smear.
 */
const PILE = 0.03;

/** Radius of the roll before any carpet is wound onto it. */
const CORE_R = 0.026;

/**
 * Segments along the roll axis.
 *
 * The roll's circumference at its fattest is ~1 world unit against a 2.6-unit
 * rug, so the carpet makes roughly two and a half turns. 96 segments puts
 * ~35 of them around each turn, which is past the point where the silhouette
 * reads as faceted. Across the width 1 segment is enough, nothing deforms on
 * that axis. 194 vertices total, so rebuilding both attributes every frame is
 * cheaper than the uniform upload it would take to do this in a shader.
 */
const SEG = 96;

function CarpetLayerImpl({ progressRef }) {
  const meshRef = useRef(null);
  const shadowRef = useRef(null);
  const rollShadowRef = useRef(null);

  const albedo = useMemo(() => carpetAlbedo(), []);
  const alpha = useMemo(() => carpetAlpha(), []);
  const roughness = useMemo(() => carpetRoughness(), []);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(CARPET_W, PLANE_L, 1, SEG),
    []
  );

  /**
   * The flat rest pose. Deformation is computed from this every frame rather
   * than from the live attribute, so scrubbing backwards reproduces the
   * original geometry exactly instead of accumulating float drift.
   */
  const restY = useMemo(
    () => Float32Array.from(geometry.attributes.position.array.filter((_, i) => i % 3 === 1)),
    [geometry]
  );

  /* Built outside JSX so the rest pose can be read off it before first frame,
     which also means R3F won't dispose it for us on unmount. */
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = smoothstep(stageProgress(progressRef.current, ...TIMELINE.carpet));

    const mesh = meshRef.current;
    if (!mesh) return;

    /* The roll consumes the rug over the first 82% of the window; the last
       18% lifts the finished roll clear so the tile below is unobstructed
       when its own stage begins. */
    const roll = clamp(t / 0.82);
    const exit = clamp((t - 0.82) / 0.18);

    /* Roll front, as a fraction of the rug's depth, measured from the near
       edge. Eased, so the roll starts and finishes gently rather than
       snapping into motion the instant the section is touched. */
    const f = smoothstep(roll);
    const rolled = f * PLANE_L;

    /**
     * Outer radius of the roll.
     *
     * Area, not guesswork: winding a length `rolled` of a sheet `PILE` thick
     * into an annulus around a core of radius CORE_R gives
     * πR² = πCORE_R² + rolled·PILE. So the roll thickens the way a real one
     * does, quickly at first and then ever more slowly, instead of growing
     * linearly and ending up the size of a barrel.
     */
    const R = Math.sqrt(CORE_R * CORE_R + (rolled * PILE) / Math.PI);

    /* Where the roll meets the floor, in the plane's local coordinates. */
    const contact = rolled - PLANE_L / 2;

    const position = mesh.geometry.attributes.position;
    const normal = mesh.geometry.attributes.normal;
    const pos = position.array;
    const nrm = normal.array;

    for (let i = 0; i < restY.length; i += 1) {
      const y0 = restY[i];
      const o = i * 3;

      /* Distance from the near edge, 0→PLANE_L. Everything nearer than the
         roll front has already been wound on. */
      const u = y0 + PLANE_L / 2;

      if (u < rolled) {
        // Arc length from the contact line, backwards along the material.
        const theta = (rolled - u) / R;
        const s = Math.sin(theta);
        const c = Math.cos(theta);

        pos[o + 1] = contact - R * s;
        pos[o + 2] = R - R * c;

        /* Winding an end up and over puts the pile face inward, so the
           surface normal is the inward radial. At theta = 0 that is (0,0,1),
           which is exactly the flat sheet's normal, so the two halves meet
           without a lighting seam at the contact line. */
        nrm[o] = 0;
        nrm[o + 1] = s;
        nrm[o + 2] = c;
      } else {
        pos[o + 1] = y0;
        pos[o + 2] = 0;
        nrm[o] = 0;
        nrm[o + 1] = 0;
        nrm[o + 2] = 1;
      }
    }

    position.needsUpdate = true;
    normal.needsUpdate = true;

    /* The finished roll lifts away and fades, the way the tiles below do.
       Deliberately a short lift against an early fade: carried further it
       reached the top of the viewport and got guillotined by the frame edge
       while still fully opaque, which reads as a glitch rather than an exit. */
    mesh.position.y = damp(mesh.position.y, CARPET_Y + exit * 1.5, 6, dt);
    mesh.position.z = damp(mesh.position.z, -exit * 0.45, 6, dt);
    mesh.rotation.z = damp(mesh.rotation.z, exit * 0.12, 6, dt);
    mesh.material.opacity = 1 - clamp((exit - 0.05) / 0.95);
    mesh.visible = mesh.material.opacity > 0.01;

    /* Contact shadow under the part still lying flat. It shortens as the roll
       eats into it, which is the whole point, a shadow spanning the original
       footprint would keep describing a rug that is no longer there. */
    const flat = shadowRef.current;
    if (flat) {
      const remain = 1 - f;
      flat.scale.y = Math.max(0.001, remain);
      // Local +Y maps to world -Z once the plane is laid down, so the centre
      // of what's left sits at the midpoint of [contact, PLANE_L/2], negated.
      flat.position.z = -(contact + PLANE_L / 2) / 2;
      flat.material.opacity = 0.42 * remain * (1 - exit);
      flat.visible = flat.material.opacity > 0.01;
    }

    /* A second, tighter shadow travelling with the roll. Without it the roll
       reads as hovering, because the flat shadow has already retreated past
       the point the roll is standing on. */
    const under = rollShadowRef.current;
    if (under) {
      under.position.z = -contact;
      const w = Math.max(0.001, R * 3.4);
      under.scale.set(1, w, 1);
      under.material.opacity = 0.5 * f * (1 - exit);
      under.visible = under.material.opacity > 0.01;
    }
  });

  const shadowMap = useMemo(() => groundShadow(), []);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0, CARPET_Y, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* Wool: fully rough, no metalness, almost no environment reflection.
            The studio rig's envMap is what gives the tile its polish, and
            letting it touch the carpet at the same strength was what made the
            first pass look like printed vinyl.

            DoubleSide because a rolled sheet shows its own underside on the
            outside of every turn. A real rug's back is a muted version of the
            face, and reproducing that properly would need a second material
            and a split mesh for a surface visible from one angle for under a
            second. */}
        <meshStandardMaterial
          map={albedo}
          alphaMap={alpha}
          roughnessMap={roughness}
          color="#ffffff"
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.18}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>

      <mesh
        ref={shadowRef}
        position={[0, SHADOW_Y, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* Matched to the footprint rather than oversized: now the rug spans
            the whole slab, a shadow larger than it would hang off the edge
            into open air. groundShadow fades to nothing well before its own
            border, so an exact match still reads as soft. */}
        <planeGeometry args={[CARPET_W, PLANE_L]} />
        <meshBasicMaterial
          map={shadowMap}
          transparent
          opacity={0.42}
          depthWrite={false}
          color="#000000"
        />
      </mesh>

      <mesh
        ref={rollShadowRef}
        position={[0, SHADOW_Y, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[CARPET_W, 1]} />
        <meshBasicMaterial
          map={shadowMap}
          transparent
          opacity={0}
          depthWrite={false}
          color="#000000"
        />
      </mesh>
    </group>
  );
}

export default memo(CarpetLayerImpl);
