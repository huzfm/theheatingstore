import * as THREE from 'three';
import { clamp, smoothstep } from './ease';

/**
 * The camera's path around the floating exhibit, as keyframes in world
 * space. Progress runs 0→1 across the whole pinned scroll.
 *
 * Deliberately restrained compared to an early pass at this scene, which
 * dove the camera down to floor level and in close, it read as a game
 * camera exploring a room, not a product being presented. Every position
 * here stays elevated and at a respectful distance; what moves is framing
 * and focus, not altitude. Narrower fov throughout (26–30° rather than the
 * previous 27–34°) reads closer to a long product-photography lens than a
 * wide establishing shot, which compresses the space and is most of what
 * makes an object read as staged rather than as architecture being toured.
 */
const KEYFRAMES = [
  { at: 0, position: [3.2, 2.2, 8.0], look: [0, 0.76, 0], fov: 30 },
  { at: 0.16, position: [2.1, 1.9, 6.7], look: [0, 0.73, 0], fov: 29 },
  { at: 0.34, position: [1.05, 1.6, 5.2], look: [0.05, 0.69, 0], fov: 27.5 },
  { at: 0.48, position: [0.35, 1.25, 4.3], look: [0.05, 0.67, 0], fov: 26.5 },
  { at: 0.64, position: [0.6, 1.35, 4.5], look: [0, 0.69, 0], fov: 27 },
  { at: 0.8, position: [1.75, 1.95, 6.35], look: [0, 0.73, 0], fov: 28.5 },
  { at: 1, position: [2.55, 2.35, 7.6], look: [-0.15, 0.78, 0], fov: 30 },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

function findSegment(progress) {
  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    if (progress <= KEYFRAMES[i + 1].at) return i;
  }
  return KEYFRAMES.length - 2;
}

/**
 * Samples the path at `progress`, writing into `outPosition` / `outLook` and
 * returning the interpolated fov. Takes output vectors rather than
 * allocating, since this runs once a frame.
 */
export function sampleCameraPath(progress, outPosition, outLook) {
  const p = clamp(progress);
  const i = findSegment(p);
  const from = KEYFRAMES[i];
  const to = KEYFRAMES[i + 1];
  const span = to.at - from.at || 1;
  const t = smoothstep(0, 1, (p - from.at) / span);

  tmpA.set(...from.position);
  tmpB.set(...to.position);
  outPosition.lerpVectors(tmpA, tmpB, t);

  tmpA.set(...from.look);
  tmpB.set(...to.look);
  outLook.lerpVectors(tmpA, tmpB, t);

  return from.fov + (to.fov - from.fov) * t;
}
