import * as THREE from 'three';

/**
 * Procedural textures for the hero's pipe network.
 *
 * Same rationale as `lib/textures.js` (canvas maps over image files, no
 * network request, nothing that can 404, ~2ms to build) but kept in its own
 * module because these are hero-specific rather than shared with the
 * WhyElectricHamam floor scene: a heating *pipe* reads completely differently
 * from a heating *cable* and shares no texture with it.
 */

const cache = new Map();

function memo(key, factory) {
  if (typeof document === 'undefined') return null;
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key);
}

function createCtx(w, h = w) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return [canvas, canvas.getContext('2d')];
}

function finish(canvas, { repeat = 1, srgb = true } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 4;
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * PEX pipe sheath. Real underfloor pipe is an extruded plastic with a faint
 * co-extruded stripe running its length (the oxygen-barrier layer shows as a
 * subtle tonal seam) rather than a woven braid, the cable's texture would
 * read as electrical flex, which is the wrong product entirely.
 */
export function pipeSheath() {
  return memo('pipe-sheath', () => {
    const size = 128;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#d8d3c8';
    ctx.fillRect(0, 0, size, size);

    // Round-surface shading: dark at the silhouette edges (v=0, v=1), bright
    // along the centreline, this is what makes a flat UV read as a cylinder.
    const shade = ctx.createLinearGradient(0, 0, 0, size);
    shade.addColorStop(0, 'rgba(0,0,0,0.5)');
    shade.addColorStop(0.5, 'rgba(255,255,255,0.22)');
    shade.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    // The barrier-layer seam: one faint longitudinal line, not a pattern.
    ctx.strokeStyle = 'rgba(120,112,98,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.lineTo(size, size * 0.5);
    ctx.stroke();

    return finish(canvas);
  });
}

/**
 * Thermal flow map. Travels along the pipe's U axis (scrolled in `offset.x`
 * each frame) as an emissive map, so the water reads as *moving* rather than
 * the whole pipe glowing in unison.
 *
 * Softer and wider than the heating cable's equivalent map: water in a pipe
 * carries heat as a slow, broad thermal front rather than a resistive
 * element's tight hot spot, so the bands here are wide, soft-edged and
 * overlap rather than reading as three separate lights.
 */
export function thermalFlow() {
  return memo('thermal-flow', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    const band = (centre, width, peak) => {
      const grad = ctx.createLinearGradient(centre - width, 0, centre + width, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(255,255,255,${peak})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(centre - width, 0, width * 2, size);
    };

    band(size * 0.12, size * 0.16, 0.55);
    band(size * 0.42, size * 0.24, 1);
    band(size * 0.78, size * 0.18, 0.7);

    return finish(canvas, { srgb: false });
  });
}

/** Frees every cached hero texture. Called when the scene unmounts. */
export function disposeHeroTextures() {
  cache.forEach((texture) => texture?.dispose?.());
  cache.clear();
}
