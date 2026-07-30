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
 * `anisotropy` defaults to the 4 every map here shipped with. The product
 * viewer asks for more: it holds a still camera on a slowly turning flat
 * surface, which is the worst case for anisotropic blur, and unlike the
 * scroll scenes the visitor has time to stare at it. three.js clamps to the
 * device's real maximum, so asking for 16 is safe on hardware that can't.
 */
function finish(canvas, { repeat = 1, srgb = true, anisotropy = 4 } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = anisotropy;
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

/* ══ Tile adhesive, combed with a notched trowel ═════════════════ */

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

/* ══ Fibreglass mesh, what the cable is actually bonded to ═══════ */

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

/* ══ ProWarm sticky mat, for the standalone product viewer ═══════ */

/**
 * The maps below are a second, higher-fidelity set of mat materials sitting
 * alongside meshAlpha() and cableSheath() rather than replacing them, because
 * the two jobs genuinely differ:
 *
 *  - meshAlpha/cableSheath dress a mat seen from 6 units away inside a moving
 *    stack of floor layers, with the cable emissive and glowing to say "this
 *    is the thing that makes heat". 256px and a plain crosshatch is the right
 *    budget for that.
 *  - these dress the same mat as a *product*, held still, close, and turned
 *    slowly by hand. So: a real plain weave with over/under crossings rather
 *    than two sets of lines, 512px, and a red FEP jacket with no emission,
 *    because a mat you can buy is red and unlit, not orange and glowing.
 *
 * Colours come from the ProWarm product guide (public/PDFs/prowarm.pdf): the
 * mat roll on p.40 and the cable cutaway on p.7.
 */

/** Weave cells per texture tile. Even, so the over/under checker wraps. */
const SCRIM_CELLS = 8;

/**
 * Strand width as a fraction of the cell pitch, and therefore how open the
 * scrim is: the cutout leaves (1 - this)² of each cell clear, so 0.34 was a
 * 44% open weave and 0.19 is a 66% one.
 *
 * Thinned deliberately. A real sticky mat is a loose scrim - it has to be, both
 * so adhesive keys through it and so the installer can see the substrate - and
 * at 44% the mesh was solid enough to hide the element wherever the mat's back
 * faced the camera. Half a turn of a product viewer spends as much time showing
 * the back as the front, so a mat whose cable disappears for half the rotation
 * loses the thing it is being shown for. At 66% the serpentine reads through
 * the weave from behind, slightly veiled, which is what looking through mesh at
 * a cable actually looks like.
 */
const SCRIM_STRAND = 0.19;

/**
 * One tile of plain weave, shared by the alpha and albedo maps so the two can
 * never drift out of register.
 *
 * The over/under pass at the end is what does the work. Drawing warp and weft
 * as two full-length sets leaves a flat grid that reads as printed hatching;
 * putting the weft back on top at half the crossings produces the checkerboard
 * of alternating crossings the eye actually uses to identify woven cloth.
 */
function weave(ctx, size, { gap, warp, weft, sheen }) {
  const pitch = size / SCRIM_CELLS;
  const strand = pitch * SCRIM_STRAND;
  const off = (pitch - strand) / 2;

  ctx.fillStyle = gap;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = weft;
  for (let j = 0; j < SCRIM_CELLS; j += 1) {
    ctx.fillRect(0, j * pitch + off, size, strand);
  }
  ctx.fillStyle = warp;
  for (let i = 0; i < SCRIM_CELLS; i += 1) {
    ctx.fillRect(i * pitch + off, 0, strand, size);
  }

  ctx.fillStyle = weft;
  for (let j = 0; j < SCRIM_CELLS; j += 1) {
    for (let i = 0; i < SCRIM_CELLS; i += 1) {
      if ((i + j) % 2) continue;
      ctx.fillRect(i * pitch + off, j * pitch + off, strand, strand);
    }
  }

  // A lighter line down the middle of every strand, so each one reads as a
  // round bundle catching the key light rather than a flat ribbon. Skipped on
  // the alpha map, where brightness means coverage and this would punch holes.
  if (!sheen) return;
  ctx.fillStyle = sheen;
  // Proportionally wider than it was, because the strand it sits on is now
  // thinner: a 30% highlight on a 12px strand is under 4px and vanishes under
  // minification, taking the roundness cue with it.
  const lit = strand * 0.42;
  const litOff = off + (strand - lit) / 2;
  for (let j = 0; j < SCRIM_CELLS; j += 1) {
    ctx.fillRect(0, j * pitch + litOff, size, lit);
  }
  for (let i = 0; i < SCRIM_CELLS; i += 1) {
    ctx.fillRect(i * pitch + litOff, 0, lit, size);
  }
}

/**
 * Glass-fibre scrim cutout. An open weave with real holes, so the studio
 * backdrop shows between the strands and the mat reads as mesh you could
 * push adhesive through rather than a sheet of dark card.
 */
export function matScrimAlpha() {
  return memo('mat-scrim-alpha', () => {
    const size = 512;
    const [canvas, ctx] = createCtx(size);
    weave(ctx, size, { gap: '#000000', warp: '#ffffff', weft: '#f2f2f2' });
    return finish(canvas, { srgb: false, anisotropy: 16 });
  });
}

/**
 * Scrim colour. Amber's installation guide calls it "the grey mesh" in the line
 * telling installers to cut it and never the cable, and grey is what it is:
 * mid, faintly cool, the colour of resin-coated glass fibre. Warp and weft are
 * given slightly different tones, which is most of what separates woven from
 * moulded.
 *
 * Read as black, and taken off the olive the old values carried. The strands
 * are not flat black - a single value would kill the weave stone dead, and at
 * this tile size the weave is the only thing saying "mesh" rather than "sheet".
 * Warp, weft and the sheen down each strand's centre span a narrow range just
 * off black, which is enough to hold the over/under against a light backdrop
 * while the mat still reads as black at a glance.
 */
export function matScrimAlbedo() {
  return memo('mat-scrim-albedo', () => {
    const size = 512;
    const [canvas, ctx] = createCtx(size);
    weave(ctx, size, {
      gap: '#0c0c0d',
      warp: '#2c2c2e',
      weft: '#202022',
      sheen: 'rgba(112,112,118,0.34)',
    });
    speckle(ctx, size, 4200, 0.055, 91);
    return finish(canvas, { anisotropy: 16 });
  });
}

/**
 * Cream reinforcement tape.
 *
 * Print is drawn as a rhythm of warm ticks rather than as lettering. At the
 * scale one of these strips occupies on screen the real branding resolves to
 * exactly that, and unreadable glyphs would read as a texturing mistake.
 */
export function matTapeAlbedo() {
  return memo('mat-tape-albedo', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#e2dac7';
    ctx.fillRect(0, 0, size, size);

    // u runs along the tape, v across it, so threads spanning its width are
    // vertical here and the print reads left to right.
    ctx.strokeStyle = 'rgba(196,187,168,0.55)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < size; x += 5) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, size);
      ctx.stroke();
    }

    // Two hairlines along the edges, the selvedge of the tape.
    ctx.fillStyle = 'rgba(168,158,138,0.5)';
    ctx.fillRect(0, 0, size, 6);
    ctx.fillRect(0, size - 6, size, 6);

    ctx.fillStyle = 'rgba(214,92,44,0.62)';
    const rand = mulberry32(311);
    for (let i = 0; i < 11; i += 1) {
      const x = 22 + i * 20 + rand() * 4;
      ctx.fillRect(x, size * 0.36, 5 + rand() * 9, size * 0.26);
    }

    speckle(ctx, size, 1600, 0.05, 53);
    return finish(canvas, { anisotropy: 16 });
  });
}

/**
 * Red FEP jacket.
 *
 * Deliberately much flatter than cableSheath(): there the braided screen is
 * the visible surface, here it sits *under* a solid extruded fluoropolymer
 * jacket (p.7 calls it "Advanced Fluoropolymer insulation (FEP) known as
 * Teflon"), so the braid only telegraphs through as a faint helical sheen. Too
 * much contrast and it stops looking like a moulded jacket.
 *
 * This map is now the cable's only source of colour - the material carries no
 * tint - so the base is the jacket's actual colour rather than half of a
 * product of two reds. Pushed toward orange: a warm red-orange is both what the
 * element photographs as under studio light and what ties it to the heat
 * palette the rest of the page runs on. Far enough round the wheel to read as
 * orange, and still short of the yellow that would make it a hazard marker.
 */
export function matCableSheath() {
  return memo('mat-cable-sheath', () => {
    const size = 256;
    const [canvas, ctx] = createCtx(size);

    ctx.fillStyle = '#d2521c';
    ctx.fillRect(0, 0, size, size);

    // A diagonal on a tube's UVs is a true helix on the mesh, since u runs
    // along the cable and v wraps around it.
    ctx.lineWidth = 5;
    for (let i = -size; i < size * 2; i += 17) {
      ctx.strokeStyle = 'rgba(244,132,58,0.26)';
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(142,52,14,0.16)';
      ctx.beginPath();
      ctx.moveTo(i + 7, 0);
      ctx.lineTo(i + 7 + size, size);
      ctx.stroke();
    }

    /**
     * Round-shading across v: dark at the silhouette, bright along the
     * centreline, so the cable stays round where the lighting goes flat.
     *
     * Eased off at the edges. Half-black terminators were tuned to keep the
     * cable separated from a dark backdrop; over cream the surroundings do that
     * job on their own, and this much of it just drains the red out of the two
     * or three pixels the cable is actually wide.
     */
    const shade = ctx.createLinearGradient(0, 0, 0, size);
    shade.addColorStop(0, 'rgba(0,0,0,0.34)');
    shade.addColorStop(0.5, 'rgba(255,236,225,0.22)');
    shade.addColorStop(1, 'rgba(0,0,0,0.34)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    return finish(canvas, { anisotropy: 16 });
  });
}

/* ══ Photographic maps ════════════════════════════════════════════ */

/**
 * The one exception to the procedural rule at the top of this file.
 *
 * Canvas primitives can fake stone veining and a trowel comb because both are
 * a handful of strokes with variation. A hand-knotted carpet is not: the whole
 * point of it is thousands of individually dyed knots resolving into a
 * medallion, and any procedural version reads as printed wrapping paper. So
 * the carpet gets a photograph, prepared by scripts/generate-layer-assets.mjs.
 *
 * Loading is fire-and-forget rather than Suspense-based. TextureLoader returns
 * the Texture object synchronously and fills in its image on arrival, which
 * means this keeps the same `useMemo(() => someMap(), [])` call shape as every
 * procedural map above, and a slow network delays the carpet's pattern rather
 * than suspending the entire canvas. Going through memo() also puts it in the
 * shared cache, so the retain/release refcount below disposes it like any
 * other map, an image texture leaked here would be far more expensive than a
 * leaked 256px canvas.
 */
function imageTexture(key, url, { srgb = true, anisotropy = 8 } = {}) {
  return memo(key, () => {
    const texture = new THREE.TextureLoader().load(url);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    // Higher than the procedural maps' 4: the carpet is the topmost layer and
    // the camera sits ~23° above it, so it is seen at a shallower angle than
    // anything else in the stack and shows anisotropic blur soonest.
    texture.anisotropy = anisotropy;
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return texture;
  });
}

export function carpetAlbedo() {
  return imageTexture('carpet-albedo', '/images/layers/kashmiri-carpet.webp');
}

/**
 * Cuts the fringe into separate threads. Without this the warp ends render as
 * a solid pale bar along each edge, which is worse than having no fringe at
 * all, it reads as an unfinished border rather than as loose thread.
 */
export function carpetAlpha() {
  return imageTexture('carpet-alpha', '/images/layers/kashmiri-carpet-alpha.webp', {
    srgb: false,
  });
}

/** Luminance-derived, compressed into 0.72–0.97, see the generator script. */
export function carpetRoughness() {
  return imageTexture('carpet-rough', '/images/layers/kashmiri-carpet-rough.webp', {
    srgb: false,
    anisotropy: 4,
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
