'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import HeatingMatModel from './HeatingMatModel';
import StudioEnvironment from './StudioEnvironment';
import {
  ROLL_CORE,
  ROLL_THICKNESS,
  ROLL_LENGTH,
  ROLL_FLAT,
  ROLL_WIDTH,
} from './constants';
import { damp, clamp, smoothstep } from '@/lib/three-utils';
import { retainTextures, releaseTextures, groundShadow } from '@/lib/textures';

/** Idle spin, rad/s. Slow enough to read detail on, fast enough to notice. */
const AUTO_SPEED = 0.16;

/** Seconds of no input before the idle spin creeps back in. */
const RESUME_AFTER = 2.4;

/** Seconds the idle spin takes to reach full speed, so it never snaps on. */
const RESUME_RAMP = 1.4;

/** Fling decay. Higher settles sooner. */
const INERTIA_DECAY = 3.4;

/**
 * The roll's outer radius, mirroring the derivation in createRoll(). Needed out
 * here to size the product for framing and to place the shadow under it, and
 * cheap enough to recompute that threading it out of the model would cost more
 * than it saved.
 */
const ROLL_OUTER = Math.sqrt(
  ROLL_CORE ** 2 + (ROLL_THICKNESS * (ROLL_LENGTH - ROLL_FLAT)) / Math.PI
);

/**
 * Standing on its face, the sheet's 500 mm width is what runs vertically, so
 * this is simply half of it.
 */
const PRODUCT_HALF_H = ROLL_WIDTH / 2;

/**
 * Half the product's length: the unrolled flap, plus the roll standing proud of
 * the tangent line at the right.
 *
 * The coiled cold lead used to add a third term here and it was the dominant
 * one - a 0.28 reach hung off the left end, which is why the mat sat small in
 * the middle of a frame sized for a coil of flex. With the lead gone the fit is
 * against the mat itself.
 */
const PRODUCT_HALF_L = (ROLL_FLAT + ROLL_OUTER) / 2;

/**
 * How far it reaches from the turn axis.
 *
 * The length is the long side and the roll's diameter is the depth, so the
 * widest sweep is the corner of that footprint rather than either on its own.
 * It has to be the *swept* radius and not the face-on half-width: hold framing
 * that only fits the product square-on and a quarter of the way round the turn
 * its ends are outside the viewport.
 */
const PRODUCT_RADIUS = Math.hypot(PRODUCT_HALF_L, ROLL_OUTER);

const FOV = 34;

/**
 * Camera elevation. Low, because the subject is now a face rather than a plan:
 * enough to look down onto the roll so it reads as a cylinder and to catch the
 * light along the cable's top, but shallow enough that the flap's serpentine is
 * seen close to square instead of foreshortened.
 */
const ELEVATION = (20 * Math.PI) / 180;

/**
 * How much of the viewport's tighter constraint the product fills.
 *
 * The fit is solved against the *swept* radius, so this is the margin left at
 * the widest point of the turn - which means the product looks smaller than the
 * number suggests for most of the spin, and filling the panel edge to edge
 * crowds it. Held a little under the frame so the shadow has somewhere to fall.
 */
const FRAME_FILL = 0.86;

/**
 * Solve the camera distance that frames the product at a given viewport aspect.
 *
 * Fitting to a single design aspect and dollying back by the ratio - which is
 * what the scroll scenes do - assumes one dimension always binds. Here neither
 * does: the product is about 1.6 long and 0.87 tall, so a wide panel runs out
 * of *height* first and a narrow phone runs out of *width*. Solving for
 * whichever is actually tighter fills the frame on both, instead of framing to
 * one and leaving the product adrift in the middle of the other.
 *
 * A perspective camera's fov is vertical, so the visible half-width at distance
 * d is d·tan(fov/2)·aspect; requiring the swept radius to fit that is the same
 * as requiring radius/aspect to fit the half-height, which is why both terms
 * below can be compared in half-height units.
 */
function fitDistance(aspect) {
  const halfH =
    Math.max(
      PRODUCT_HALF_H * Math.cos(ELEVATION) + PRODUCT_RADIUS * Math.sin(ELEVATION),
      PRODUCT_RADIUS / Math.max(0.4, aspect)
    ) / FRAME_FILL;

  return halfH / Math.tan(((FOV / 2) * Math.PI) / 180);
}

/** Starting distance, for the frame before the first resize is known. */
const CAM_D = fitDistance(1.4);

/**
 * Baked shadow pool, in place of drei's ContactShadows.
 *
 * ContactShadows re-renders a depth pass into a render target every frame. The
 * product only ever spins about Y above a fixed plane, so a single pre-drawn
 * radial gradient is visually equivalent and costs one textured quad. It does
 * not belong inside the rotating group: a shadow that turns with the object it
 * is cast by is the fastest way to break the illusion.
 *
 * Warm grey rather than black, and lighter than it was. Over the old near-black
 * backdrop the pool was barely visible and could afford to be dense; on cream it
 * is the most conspicuous thing in the frame after the product itself, and pure
 * black at that strength reads as a hole cut in the page rather than as light
 * being blocked. A shadow on a warm ground takes its colour from the ground.
 */
function GroundShadow() {
  const map = useMemo(() => groundShadow(), []);

  return (
    <mesh position={[0, -PRODUCT_HALF_H - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[PRODUCT_RADIUS * 5, PRODUCT_RADIUS * 4]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={0.34}
        depthWrite={false}
        color="#4a4036"
      />
    </mesh>
  );
}

/**
 * Rotation, damping and framing.
 *
 * The whole product is one rigid group so the mat, its element, the tape and
 * the cold lead turn together; only Y is ever written, which is what keeps a
 * flat product from being tumbled onto its back or viewed from underneath,
 * neither of which means anything for a mat.
 */
function MatRig({ controls, reduced }) {
  const spinRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  // The pointer handlers live on the DOM wrapper outside the Canvas, so they
  // cannot reach R3F's invalidate. Handing it out through the shared control
  // object is what lets a drag wake a frameloop parked on 'demand'.
  useEffect(() => {
    controls.current.invalidate = invalidate;
    return () => {
      controls.current.invalidate = null;
    };
  }, [controls, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const c = controls.current;
    const now = performance.now() / 1000;

    if (c.dragging) {
      if (c.pending !== 0) {
        c.angle += c.pending;
        /**
         * Damped rather than assigned. A flicked finger sampled at 240Hz
         * against a 60Hz frame can land four moves in one frame and one in the
         * next, so taking the last frame's delta as the release velocity
         * outright would occasionally fling the product across several turns
         * from a gentle drag.
         */
        c.velocity = damp(c.velocity, c.pending / dt, 12, dt);
        c.pending = 0;
      } else {
        // Finger down but still: bleed the stored velocity off, so pausing
        // mid-drag and letting go stops the product instead of resuming a
        // fling from wherever the last movement left it.
        c.velocity = damp(c.velocity, 0, 7, dt);
      }
    } else {
      c.angle += c.velocity * dt;
      c.velocity *= Math.exp(-INERTIA_DECAY * dt);
      if (Math.abs(c.velocity) < 0.0015) c.velocity = 0;

      const idle = now - c.lastInput;
      const gain = reduced ? 0 : smoothstep(clamp((idle - RESUME_AFTER) / RESUME_RAMP));
      c.angle += AUTO_SPEED * gain * dt;
    }

    if (spinRef.current) spinRef.current.rotation.y = c.angle;

    // Responsive framing. Reading state.size every frame means this tracks
    // window resize and device rotation with no extra listeners.
    const d = fitDistance(state.size.width / state.size.height);
    state.camera.position.y = damp(state.camera.position.y, d * Math.sin(ELEVATION), 4, dt);
    state.camera.position.z = damp(state.camera.position.z, d * Math.cos(ELEVATION), 4, dt);
    state.camera.lookAt(0, 0, 0);

    /**
     * On 'demand' the loop renders only when something asks it to, so anything
     * still moving has to request its own next frame. Without this the product
     * would freeze mid-fling the moment the drag ended.
     */
    if (c.demand && (c.dragging || c.velocity !== 0)) invalidate();
  });

  return (
    <>
      {/* ── Three-point studio rig ──────────────────────────────────
          Warm key high and left, cool fill low and right to keep the shadow
          side off black without flattening the weave, and a rim from behind
          that separates the mat's far edge from the backdrop. No shadow-casting
          lights: the environment map does the shaping and the baked pool below
          does the grounding.

          Retuned for a cream backdrop. The rim is down from 1.15 because a hot
          edge existed to lift the product off near-black and against pale paper
          it only blows the scrim's far side out; the ambient is up because a
          light surround physically bounces fill back into the shadow side, and
          without it a charcoal mesh on cream reads as a silhouette. */}
      <directionalLight position={[-4.2, 6.4, 4.2]} intensity={1.5} color="#fff2e2" />
      <directionalLight position={[5.2, 1.6, 3]} intensity={0.55} color="#a8c4ff" />
      <directionalLight position={[0.5, 3.4, -6]} intensity={0.8} color="#ffffff" />
      <ambientLight intensity={0.36} color="#fff6ea" />

      {/* Only Y is ever written, and the model centres itself on that axis (see
          HeatingMatModel), so the mat, its element, the tape, the core and the
          cold lead all turn together as one rigid object with no lean and no
          wobble - it stands square and spins on the spot. */}
      <group ref={spinRef}>
        <HeatingMatModel />
      </group>

      <GroundShadow />
    </>
  );
}

function TextureCleanup() {
  useEffect(() => {
    retainTextures();
    return () => releaseTextures();
  }, []);
  return null;
}

/**
 * Canvas wrapper.
 *
 * frameloop is three-way rather than the usual on/off:
 *
 *  - 'never' off screen, so an idle spin nobody can see costs nothing. This is
 *    the mount/active split FloorRevealSection already established.
 *  - 'demand' for prefers-reduced-motion, where there is no idle spin and the
 *    only thing that ever moves the product is a drag. Here demand + invalidate
 *    is a real win: the viewer renders on interaction and is otherwise idle.
 *  - 'always' otherwise, because the idle spin is a continuous animation and
 *    invalidating once per frame to drive it is just a continuous loop with
 *    extra steps.
 *
 * dpr is [1,2] rather than the 1.25-1.4 the scroll scenes settle for. This is
 * one scrim, one tube and a tail with no post-processing, no shadow maps and no
 * photographic textures, and it is examined at rest - which is exactly where a
 * lower pixel ratio shows as stair-stepping on the cable.
 */
export default function HeatingMatViewerScene({ controls, active = true, reduced = false }) {
  const frameloop = !active ? 'never' : reduced ? 'demand' : 'always';

  // Coming back on screen in demand mode needs one frame kicked off by hand,
  // otherwise the canvas shows whatever was in the buffer when it parked.
  const invalidateRef = controls;
  useEffect(() => {
    if (active) invalidateRef.current.invalidate?.();
  }, [active, invalidateRef]);

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={frameloop}
      camera={{
        position: [0, CAM_D * Math.sin(ELEVATION), CAM_D * Math.cos(ELEVATION)],
        fov: FOV,
        near: 0.1,
        far: 40,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        // Up from 0.92. Exposure is relative to what surrounds it: the same
        // render that looked correct floating on near-black looks under-lit
        // sitting on cream, because the eye adapts to the brightest thing in
        // frame and the backdrop is now that.
        toneMappingExposure: 1.02,
      }}
      // The section's own wrapper owns the drag, so the canvas takes no pointer
      // events and R3F never raycasts. Nothing in here is clickable.
      style={{ pointerEvents: 'none' }}
    >
      {/* Lightformers rather than <Environment preset="studio" />: the presets
          stream a multi-megabyte HDRI from a CDN at runtime, which on a
          marketing page is a slow load, a third-party request and a hard
          failure if the CDN is unreachable. See StudioEnvironment for the
          full reasoning. It bakes one 256px cubemap and ships in the bundle. */}
      <StudioEnvironment />

      <MatRig controls={controls} reduced={reduced} />
      <TextureCleanup />
    </Canvas>
  );
}
