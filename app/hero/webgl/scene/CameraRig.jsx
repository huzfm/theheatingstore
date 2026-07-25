'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from '../../lib/ease';
import { heroState } from '../../lib/signals';
import { sampleCameraPath } from '../../lib/cameraPath';
import { calmAt } from '../../lib/sceneTimeline';

/**
 * The cinematic camera. Samples `cameraPath` at the current scroll progress,
 * then damps toward that sample every frame rather than snapping to it, the
 * lag is what turns a scrubbed value into something that reads as a camera
 * operator rather than a progress bar.
 *
 * Two things ride on top of the path itself: a boot settle (mirrors the DOM
 * hero's camera-overscan-resolving-on-load, so the very first frame is
 * already arriving rather than static) and a pointer parallax so the room
 * keeps acknowledging the visitor the way the old photographic hero did. Both
 * fade out across `calmAt` toward the end of the scroll, the closing shot
 * needs the camera to read as having actually stopped, not just as having
 * run out of path to follow.
 */

const targetPos = new THREE.Vector3();
const targetLook = new THREE.Vector3();
const currentLook = new THREE.Vector3(0, 0.76, 0);

export default function CameraRig({ reduced = false }) {
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const { camera } = state;
    if (!camera.isPerspectiveCamera) return;

    const fov = sampleCameraPath(heroState.sceneProgress, targetPos, targetLook);

    // Settle in from a higher, further-back establishing position, the 3D
    // equivalent of the DOM hero's camera resolving from a 4.5% overscan.
    const bootOffset = (1 - heroState.boot) * 0.85;
    targetPos.y += bootOffset;
    targetPos.z += bootOffset * 1.25;

    camera.position.x = damp(camera.position.x, targetPos.x, 2.4, dt);
    camera.position.y = damp(camera.position.y, targetPos.y, 2.4, dt);
    camera.position.z = damp(camera.position.z, targetPos.z, 2, dt);
    camera.fov = damp(camera.fov, fov, 2.2, dt);
    camera.updateProjectionMatrix();

    currentLook.x = damp(currentLook.x, targetLook.x, 2.8, dt);
    currentLook.y = damp(currentLook.y, targetLook.y, 2.8, dt);
    currentLook.z = damp(currentLook.z, targetLook.z, 2.8, dt);

    if (!reduced) {
      // Breathing, not exploring, kept small enough that it registers as
      // "alive" without ever reading as the camera moving through space.
      // Damped toward zero across the closing shot, so the very last frames
      // read as genuinely still rather than quietly still swaying.
      const stillness = 1 - calmAt(heroState.sceneProgress);
      elapsed.current += dt;
      const sway = Math.sin(elapsed.current * 0.14) * 0.028 * stillness;
      camera.position.x += sway + heroState.px * 0.07 * stillness;
      camera.position.y += heroState.py * -0.03 * stillness;
    }

    camera.lookAt(currentLook);
  });

  return null;
}
