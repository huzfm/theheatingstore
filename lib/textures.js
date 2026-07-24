import * as THREE from 'three';

/**
 * Procedural materials, drawn to an offscreen canvas at runtime.
 *
 * Why not image files: a flat `color` on a material is the biggest reason CG
 * props read as cheap — real surfaces vary. But shipping 4K PBR maps would
 * add megabytes and a loading state to a marketing page. Canvas maps split
 * the difference: real surface variation, ~2ms to build, no network request,
 * nothing that can 404.
 *
 * Sizes are deliberately modest (256–512). These are seen at a distance on a
 * moving object; 2K maps would cost VRAM and upload bandwidth for detail no
 * one can resolve.
 */

const cache = new Map();

function memo(key, factory) {
  if (typeof document === 'undefined') return null;
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key);
}

function createCtx(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return [canvas, canvas.getContext('2d')];
}

/** Deterministic pseudo-random, so textures are identical on every load. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function speckle(ctx, size, count, alpha, seed = 1337) {
  const rand = mulberry32(seed);
  for (let i = 0; i < count; i += 1) {
    const v = Math.floor(rand() * 255);
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`;
    ctx.fillRect(rand() * size, rand() * size, 1.5, 1.5);
  }
}

function blotches(ctx, size, count, radius, color, alpha, seed = 7) {
  const rand = mulberry32(seed);
  for (let i = 0; i < count; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = radius * (0.4 + rand() * 0.9);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${color}, ${alpha})`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
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

/* ══ Large-format porcelain / marble — the visible floor ══════════ */

export function marbleAlbedo() {
  return memo('marble-albedo', () => {
    const size = 512;
    const [canvas, ctx] = createCtx(size);

    // Warm off-white base, not pure grey — grey stone reads as concrete.
    ctx.fillStyle = '#e6e1d8';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 20, 170, '214,208,197', 0.55, 11);
    blotches(ctx, size, 12, 110, '250,248,243', 0.6, 23);

    // Marble veining: a few strong veins with hairline branches, which is
    // what real stone does — not a uniform scatter of scratches.
    const rand = mulberry32(3);
    const vein = (x0, y0, width, alpha, steps) => {
      ctx.strokeStyle = `rgba(146,138,126,${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      let x = x0;
      let y = y0;
      ctx.moveTo(x, y);
      for (let i = 0; i < steps; i += 1) {
        x += (rand() - 0.35) * 70;
        y += size / steps;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    for (let i = 0; i < 4; i += 1) vein(rand() * size, -20, 1.6 + rand() * 1.8, 0.3, 12);
    for (let i = 0; i < 12; i += 1) vein(rand() * size, -20, 0.5, 0.16, 16);

    speckle(ctx, size, 3000, 0.035);
    return finish(canvas);
  });
}

/** Gloss varies across polished stone; uniform shine is an instant tell. */
export function marbleRoughness() {
  return memo('marble-rough', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);
    ctx.fillStyle = '#4d4d4d';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 26, 80, '120,120,120', 0.45, 31);
    blotches(ctx, size, 18, 55, '26,26,26', 0.4, 47);
    return finish(canvas, { srgb: false });
  });
}

/* ══ Tile adhesive — combed with a notched trowel ═════════════════ */

/**
 * The ridged comb pattern a notched trowel leaves is one of the most
 * recognisable things on a real building site, and it instantly identifies
 * this layer as adhesive rather than generic grey filler.
 */
export function adhesiveAlbedo() {
  return memo('adhesive-albedo', () => {
    const size = 512;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#8b8378';
    ctx.fillRect(0, 0, size, size);

    // Comb ridges: a light crest and a dark trough per pass, so the ridge
    // reads as three-dimensional under raking light.
    const pitch = size / 26;
    for (let i = 0; i < 26; i += 1) {
      const x = i * pitch;
      ctx.fillStyle = 'rgba(168,158,144,0.85)';
      ctx.fillRect(x, 0, pitch * 0.42, size);
      ctx.fillStyle = 'rgba(88,82,73,0.75)';
      ctx.fillRect(x + pitch * 0.42, 0, pitch * 0.28, size);
    }

    blotches(ctx, size, 22, 90, '110,103,92', 0.3, 61);
    speckle(ctx, size, 6000, 0.05);
    return finish(canvas);
  });
}

/* ══ Insulation board ═════════════════════════════════════════════ */

export function insulationAlbedo() {
  return memo('insulation-albedo', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);
    ctx.fillStyle = '#9a9488';
    ctx.fillRect(0, 0, size, size);
    // Cement-coated board: fine aggregate, faint fibre.
    const rand = mulberry32(151);
    for (let i = 0; i < 1400; i += 1) {
      const v = 120 + Math.floor(rand() * 60);
      ctx.fillStyle = `rgba(${v},${v - 5},${v - 14},0.4)`;
      ctx.beginPath();
      ctx.arc(rand() * size, rand() * size, 0.5 + rand() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    blotches(ctx, size, 14, 60, '80,76,68', 0.28, 167);
    return finish(canvas);
  });
}

/* ══ Concrete subfloor ════════════════════════════════════════════ */

export function concreteAlbedo() {
  return memo('concrete-albedo', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);
    ctx.fillStyle = '#413d38';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 30, 80, '30,28,26', 0.5, 191);
    blotches(ctx, size, 16, 50, '78,73,66', 0.3, 211);
    const rand = mulberry32(223);
    for (let i = 0; i < 400; i += 1) {
      ctx.fillStyle = `rgba(20,19,17,${0.2 + rand() * 0.4})`;
      ctx.beginPath();
      ctx.arc(rand() * size, rand() * size, 0.5 + rand() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    speckle(ctx, size, 3000, 0.05, 5);
    return finish(canvas);
  });
}

/* ══ Fibreglass mesh — what the cable is actually bonded to ═══════ */

/**
 * Real mats are an open fibreglass scrim: thin pale strands on a roughly
 * 25-30mm grid, with big gaps you can see the substrate through. Modelled as
 * an alpha cut-out so light genuinely passes between strands.
 */
export function meshAlpha() {
  return memo('mesh-alpha', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#d8d8d8';
    ctx.lineWidth = 2;
    const cells = 12;
    const step = size / cells;
    for (let i = 0; i <= cells; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }
    return finish(canvas, { srgb: false });
  });
}

/* ══ Heating cable ════════════════════════════════════════════════ */

/**
 * Cable sheath.
 *
 * Real heating cable isn't a smooth rod — it's a braided screen under an
 * extruded outer jacket, which reads as a fine helical pattern running along
 * its length. On a tube's UVs, u runs along the cable and v wraps around it,
 * so a diagonal line here becomes a true helix on the mesh. That helix
 * catching the light is most of what separates "cable" from "orange tube".
 */
export function cableSheath() {
  return memo('cable-sheath', () => {
    const size = 128;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#6d3413';
    ctx.fillRect(0, 0, size, size);

    // Braid: two opposing sets of diagonals, the way a real screen is woven.
    ctx.lineWidth = 3;
    for (let i = -size; i < size * 2; i += 9) {
      ctx.strokeStyle = 'rgba(158,84,36,0.55)';
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(48,20,7,0.35)';
      ctx.beginPath();
      ctx.moveTo(i + 4, 0);
      ctx.lineTo(i + 4 + size, size);
      ctx.stroke();
    }

    // Shading around the circumference: dark at the silhouette edges (v = 0
    // and v = 1), bright along the centreline, so the cable reads as round
    // even where lighting is flat.
    const shade = ctx.createLinearGradient(0, 0, 0, size);
    shade.addColorStop(0, 'rgba(0,0,0,0.55)');
    shade.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    shade.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    return finish(canvas);
  });
}

/**
 * Heat gradient along the cable, used as an emissive map and scrolled each
 * frame so warmth appears to travel through the run.
 *
 * Long soft bands rather than hard stripes: heat conducts, so a sharp edge
 * would read as a light chase on a sign rather than a warming element.
 */
export function cableHeat() {
  return memo('cable-heat', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);

    // Never fully dark — the whole cable is live, some parts just hotter.
    ctx.fillStyle = '#6b6b6b';
    ctx.fillRect(0, 0, size, size);

    const band = (centre, width, peak) => {
      const grad = ctx.createLinearGradient(centre - width, 0, centre + width, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(255,255,255,${peak})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(centre - width, 0, width * 2, size);
    };

    band(size * 0.2, size * 0.16, 0.85);
    band(size * 0.62, size * 0.2, 0.6);
    band(size * 0.88, size * 0.1, 0.45);

    return finish(canvas, { srgb: false });
  });
}

/* ══ Utility maps ═════════════════════════════════════════════════ */

/** Soft white radial — additive glow sprites, standing in for bloom. */
export function radialGlow() {
  return memo('radial-glow', () => {
    const size = 128;
    const [canvas, ctx] = createCtx(size);
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return finish(canvas, { srgb: false });
  });
}

/**
 * Baked soft shadow, used instead of drei's ContactShadows.
 * ContactShadows re-renders a depth pass into a render target every single
 * frame; this is one texture uploaded once. Visually near-identical for a
 * stack that only ever moves vertically.
 */
export function groundShadow() {
  return memo('ground-shadow', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(0,0,0,0.85)');
    grad.addColorStop(0.45, 'rgba(0,0,0,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return finish(canvas, { srgb: false });
  });
}

/** Frees every cached texture. Prefer releaseTextures() — see below. */
export function disposeTextures() {
  cache.forEach((texture) => texture?.dispose?.());
  cache.clear();
}

/**
 * Refcount around that cache.
 *
 * The cache is module-level and shared, so once more than one scene can be
 * alive at a time — the About page has both the hero panel and the story rail
 * — an unconditional dispose on unmount is a bug: whichever scene unmounts
 * first frees textures the other is still rendering with, and the survivor
 * goes black. Scenes retain on mount and release on unmount; the last one out
 * does the disposing.
 *
 * memo() rebuilds lazily, so a later scene after a full release just pays the
 * ~2ms to redraw them.
 */
let users = 0;

export function retainTextures() {
  users += 1;
}

export function releaseTextures() {
  users = Math.max(0, users - 1);
  if (users === 0) disposeTextures();
}
