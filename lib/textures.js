import * as THREE from 'three';

/**
 * Procedural materials, drawn to an offscreen canvas at runtime.
 *
 * Why not image files: a flat `color` on a material is the biggest reason CG
 * props read as cheap, real surfaces vary. But shipping 4K PBR maps would
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

/**
 * Bakes a normal map from a grayscale height canvas via a Sobel-style
 * central-difference gradient. Lets pile/fibre bump detail be authored as a
 * plain height painting (the same canvas-drawing vocabulary as every other
 * texture here) rather than hand-writing tangent-space vectors, while still
 * producing a real normal map the standard PBR lighting will shade with.
 */
function heightToNormalCanvas(heightCanvas, strength = 2) {
  const { width, height } = heightCanvas;
  const src = heightCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  const out = document.createElement('canvas');
  out.width = width;
  out.height = height;
  const outCtx = out.getContext('2d');
  const img = outCtx.createImageData(width, height);

  const heightAt = (x, y) => {
    const xx = (x + width) % width;
    const yy = (y + height) % height;
    return src[(yy * width + xx) * 4] / 255;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = (heightAt(x - 1, y) - heightAt(x + 1, y)) * strength;
      const dy = (heightAt(x, y - 1) - heightAt(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * width + x) * 4;
      img.data[i] = Math.round((dx / len) * 0.5 * 255 + 127.5);
      img.data[i + 1] = Math.round((dy / len) * 0.5 * 255 + 127.5);
      img.data[i + 2] = Math.round((1 / len) * 0.5 * 255 + 127.5);
      img.data[i + 3] = 255;
    }
  }
  outCtx.putImageData(img, 0, 0);
  return out;
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

/* ══ Large-format porcelain / marble, the visible floor ══════════ */

export function marbleAlbedo() {
  return memo('marble-albedo', () => {
    const size = 512;
    const [canvas, ctx] = createCtx(size);

    // Warm off-white base, not pure grey, grey stone reads as concrete.
    ctx.fillStyle = '#e6e1d8';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 20, 170, '214,208,197', 0.55, 11);
    blotches(ctx, size, 12, 110, '250,248,243', 0.6, 23);

    // Marble veining: a few strong veins with hairline branches, which is
    // what real stone does, not a uniform scatter of scratches.
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

/* ══ Kashmiri carpet, hand-knotted wool ═══════════════════════════
 *
 * Baked as a single non-repeating 512px sheet rather than a tiled pattern:
 * a medallion-and-corner layout doesn't tile without visible seams, and
 * this is the hero surface for the first quarter of the sequence, so it
 * earns the one-shot bake other layers don't need.
 *
 * Procedural rather than a photographed asset, same reasoning as the rest
 * of this file: this project ships zero external texture files, and a real
 * carpet photo would be the first departure from that. This is a stylised
 * approximation of the paisley/medallion motifs typical of Kashmiri weaves,
 * not a photographic reproduction. If photographic authenticity is wanted
 * later, swap this call for drei's useTexture() against a supplied image;
 * everything downstream (UVs, repeat=1) already assumes a single
 * non-tiled sheet, so nothing else would need to change.
 */

/** One paisley/boteh teardrop, the repeating motif of the allover field. */
function boteh(ctx, x, y, scale, rot, fill) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(10, -12, 12, 2, 4, 10);
  ctx.bezierCurveTo(0, 14, -4, 8, -2, 2);
  ctx.bezierCurveTo(-8, -4, -6, -14, 0, -14);
  ctx.fill();
  ctx.restore();
}

export function kashmiriCarpetAlbedo() {
  return memo('kashmiri-carpet-albedo', () => {
    const size = 512; // design coordinate space every measurement below is tuned against
    const resolution = 1024; // physical bake resolution, doubled for a crisper hero surface
    const [canvas, ctx] = createCtx(resolution);
    ctx.scale(resolution / size, resolution / size);

    // Deep maroon field, wool pile catches light unevenly rather than flat.
    ctx.fillStyle = '#5c1620';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 40, 60, '90,30,34', 0.35, 401);
    blotches(ctx, size, 30, 45, '40,10,16', 0.3, 403);

    const gold = '#c99a44';
    const cream = '#e9d9ab';
    const rand = mulberry32(409);

    // Outer guard border: a thick gold band, then a thin cream hairline
    // just inside it, the layered-frame look every real piece has.
    const margin = 22;
    ctx.strokeStyle = gold;
    ctx.lineWidth = 14;
    ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2);
    ctx.strokeStyle = cream;
    ctx.lineWidth = 2;
    ctx.strokeRect(margin + 20, margin + 20, size - (margin + 20) * 2, size - (margin + 20) * 2);

    // Minor guard stripe: a run of small ticks around the inner border, the
    // repeating dash pattern that separates field from frame.
    const inner = margin + 34;
    for (let x = inner; x < size - inner; x += 16) {
      ctx.fillStyle = rand() > 0.5 ? gold : cream;
      ctx.fillRect(x, inner - 5, 8, 3);
      ctx.fillRect(x, size - inner + 2, 8, 3);
    }
    for (let y = inner; y < size - inner; y += 16) {
      ctx.fillStyle = rand() > 0.5 ? gold : cream;
      ctx.fillRect(inner - 5, y, 3, 8);
      ctx.fillRect(size - inner + 2, y, 3, 8);
    }

    // Allover boteh lattice across the field, the repeat pattern that
    // reads as "woven" rather than printed.
    const field0 = inner + 20;
    const field1 = size - inner - 20;
    let row = 0;
    for (let y = field0; y < field1; y += 34) {
      const offset = (row % 2) * 17;
      for (let x = field0 + offset; x < field1; x += 34) {
        boteh(ctx, x, y, 0.55 + rand() * 0.1, (rand() - 0.5) * 0.3, rand() > 0.4 ? gold : cream);
      }
      row += 1;
    }

    // Central medallion: concentric diamonds and a rosette, the anchor
    // motif a medallion-and-corner layout is built around.
    const cx = size / 2;
    const cy = size / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = gold;
    for (let r = 0; r < 3; r += 1) {
      const s = 70 - r * 18;
      ctx.lineWidth = 3 - r * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s, 0);
      ctx.closePath();
      ctx.stroke();
    }
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      boteh(ctx, Math.cos(a) * 34, Math.sin(a) * 34, 0.4, a, cream);
    }
    ctx.fillStyle = cream;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Corner spandrels: a quarter-medallion arc in each corner, the
    // layout's other signature.
    [[0, 0], [size, 0], [0, size], [size, size]].forEach(([x, y]) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(cy - y, cx - x) - Math.PI / 4);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 44, -0.35, 0.35 + Math.PI / 2);
      ctx.stroke();
      ctx.restore();
    });

    speckle(ctx, size, 4000, 0.04);
    return finish(canvas, { repeat: 1 });
  });
}

/** Wool pile roughness: mottled, knot to knot, rather than uniformly matte. */
export function kashmiriCarpetRoughness() {
  return memo('kashmiri-carpet-rough', () => {
    const size = 256; // design coordinate space
    const resolution = 512; // physical bake resolution
    const [canvas, ctx] = createCtx(resolution);
    ctx.scale(resolution / size, resolution / size);
    ctx.fillStyle = '#8c8c8c';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 30, 70, '150,150,150', 0.35, 421);
    blotches(ctx, size, 24, 50, '60,60,60', 0.3, 431);
    return finish(canvas, { repeat: 1, srgb: false });
  });
}

/**
 * Pile-level bump detail: a dense field of individual knot tufts plus
 * broader crush/wear variation, baked as a height painting and converted to
 * a normal map. This is what turns the raking studio key light into visible
 * pile depth rather than a flat printed pattern.
 */
export function kashmiriCarpetNormal() {
  return memo('kashmiri-carpet-normal', () => {
    const size = 512;
    const [heightCanvas, ctx] = createCtx(size);
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const rand = mulberry32(911);
    const knotStep = 6;
    for (let y = knotStep / 2; y < size; y += knotStep) {
      for (let x = knotStep / 2; x < size; x += knotStep) {
        const v = 128 + Math.floor((rand() - 0.5) * 70);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.beginPath();
        ctx.arc(x + (rand() - 0.5) * 2, y + (rand() - 0.5) * 2, knotStep * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Broader crush/wear variation on top of the per-knot noise.
    blotches(ctx, size, 22, 80, '150,150,150', 0.18, 921);
    blotches(ctx, size, 16, 55, '90,90,90', 0.16, 933);

    return finish(heightToNormalCanvas(heightCanvas, 2.2), { repeat: 1, srgb: false });
  });
}

/**
 * Fringe alpha cut-out: individual tapered strands rather than a solid tab,
 * real fringe is loose cord with gaps between strands, and the gaps are
 * exactly what sells it as fringe instead of a hemmed edge.
 */
export function carpetFringeAlpha() {
  return memo('carpet-fringe-alpha', () => {
    const size = 128;
    const [canvas, ctx] = createCtx(size);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);

    const rand = mulberry32(517);
    const strands = 22;
    const step = size / strands;
    for (let i = 0; i < strands; i += 1) {
      const x = i * step + step * 0.2;
      const width = step * (0.35 + rand() * 0.3);
      const wobble = (rand() - 0.5) * step * 0.3;
      ctx.strokeStyle = '#e9e0cf';
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + wobble, size * 0.5, x + wobble * 1.6, size);
      ctx.stroke();
    }
    return finish(canvas, { repeat: 1, srgb: false });
  });
}

/**
 * Fringe bump detail: individual strand ridges rather than a flat cut-out,
 * so each strand reads as a loose cord catching light along its length.
 */
export function carpetFringeNormal() {
  return memo('carpet-fringe-normal', () => {
    const size = 128;
    const [heightCanvas, ctx] = createCtx(size);
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const rand = mulberry32(541);
    const strands = 22;
    const step = size / strands;
    for (let i = 0; i < strands; i += 1) {
      const x = i * step + step * 0.2;
      const width = step * (0.35 + rand() * 0.3);
      const wobble = (rand() - 0.5) * step * 0.3;
      const v = 150 + Math.floor(rand() * 50);
      ctx.strokeStyle = `rgb(${v},${v},${v})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + wobble, size * 0.5, x + wobble * 1.6, size);
      ctx.stroke();
    }
    return finish(heightToNormalCanvas(heightCanvas, 1.8), { repeat: 1, srgb: false });
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

/* ══ Fibreglass mesh, what the cable is actually bonded to ═══════ */

/**
 * The mat's woven backing: a dense charcoal fibreglass weave with wider pale
 * cross-strips bonded across it at intervals, the structural tape that pins
 * the cable's serpentine run in place. Baked as one opaque tileable sheet
 * rather than an alpha cut-out, at product-shot distance a real mat reads as
 * a solid matte fabric panel, not see-through gauze.
 *
 * Strips are drawn at every tile edge so adjacent tiles' edges coincide when
 * repeated, giving one strip per tile width in each direction rather than a
 * seam artefact, the interval is set by the `map-repeat` the caller applies.
 */
export function matMeshAlbedo() {
  return memo('mat-mesh-albedo', () => {
    const size = 1024;
    const [canvas, ctx] = createCtx(size);

    // Charcoal base, mottled rather than flat so it reads as fabric.
    ctx.fillStyle = '#303030';
    ctx.fillRect(0, 0, size, size);
    blotches(ctx, size, 24, 90, '58,58,58', 0.35, 601);
    blotches(ctx, size, 18, 60, '18,18,18', 0.4, 613);

    // Fine two-directional weave: tight alternating threads, the same braid
    // logic as cableSheath but orthogonal since this is a flat panel rather
    // than a wrapped tube.
    const cells = 64;
    const step = size / cells;
    ctx.lineWidth = 1;
    for (let i = 0; i <= cells; i += 1) {
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(74,74,74,0.5)' : 'rgba(16,16,16,0.4)';
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // Wide structural cross-strips, bonded tape reading as off-white against
    // the charcoal weave.
    const stripW = size * 0.045;
    ctx.fillStyle = 'rgba(198,192,180,0.55)';
    ctx.fillRect(0, 0, stripW, size);
    ctx.fillRect(size - stripW, 0, stripW, size);
    ctx.fillRect(0, 0, size, stripW);
    ctx.fillRect(0, size - stripW, size, stripW);

    speckle(ctx, size, 2600, 0.05, 617);
    return finish(canvas, { repeat: 1 });
  });
}

/* ══ Heating cable ════════════════════════════════════════════════ */

/**
 * Cable sheath.
 *
 * Real heating cable isn't a smooth rod, it's a braided screen under an
 * extruded outer jacket, which reads as a fine helical pattern running along
 * its length. On a tube's UVs, u runs along the cable and v wraps around it,
 * so a diagonal line here becomes a true helix on the mesh. That helix
 * catching the light is most of what separates "cable" from "orange tube".
 */
export function cableSheath() {
  return memo('cable-sheath', () => {
    const size = 128;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#7a1f47';
    ctx.fillRect(0, 0, size, size);

    // Braid: two opposing sets of diagonals, the way a real screen is woven.
    ctx.lineWidth = 3;
    for (let i = -size; i < size * 2; i += 9) {
      ctx.strokeStyle = 'rgba(196,70,124,0.5)';
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(58,14,32,0.35)';
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

    // Never fully dark, the whole cable is live, some parts just hotter.
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

/** Soft white radial, additive glow sprites, standing in for bloom. */
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

/**
 * Raises every cached texture to the renderer's real max anisotropy.
 * `finish()` bakes textures with a conservative default before any renderer
 * exists to ask; this is called once a GL context is available (see
 * FloorCutawayScene's AnisotropyTuner) so ground-plane-angled surfaces viewed
 * at a raking camera angle stop softening under mipmap minification.
 */
export function setMaxAnisotropy(max) {
  cache.forEach((texture) => {
    if (texture && texture.anisotropy !== max) {
      texture.anisotropy = max;
      texture.needsUpdate = true;
    }
  });
}

/** Frees every cached texture. Prefer releaseTextures(), see below. */
export function disposeTextures() {
  cache.forEach((texture) => texture?.dispose?.());
  cache.clear();
}

/**
 * Refcount around that cache.
 *
 * The cache is module-level and shared, so once more than one scene can be
 * alive at a time, the About page has both the hero panel and the story rail
 *, an unconditional dispose on unmount is a bug: whichever scene unmounts
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
