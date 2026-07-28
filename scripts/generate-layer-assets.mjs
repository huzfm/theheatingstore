/**
 * Cross-section layer assets, run with `node scripts/generate-layer-assets.mjs`.
 *
 * Every other surface in the floor-reveal scene is drawn procedurally at
 * runtime (see lib/textures.js, and the reasoning at the top of that file).
 * The Kashmiri carpet is the one layer that cannot be: a hand-knotted wool
 * pile is thousands of individually dyed knots resolving into a medallion,
 * and any canvas approximation of that reads as wrapping paper.
 *
 * So the *field* is a photograph. The border and fringe are not, because no
 * single top-down stock frame exists that shows a complete rug including its
 * border on all four sides and its fringe, every candidate is either a crop
 * of the field or a rug in a room at an angle. Rather than stitch two
 * different carpets together, which is what made the first pass look broken,
 * the border and fringe are drawn around the one photograph in a palette
 * sampled from it. Vector, so the corners mitre cleanly instead of showing
 * the rotational seam a composited photo strip leaves.
 *
 * Outputs (public/images/layers/):
 *   kashmiri-carpet.webp        albedo, sRGB
 *   kashmiri-carpet-alpha.webp  opacity, cuts the fringe into strands
 *   kashmiri-carpet-rough.webp  roughness, linear, derived from luminance
 */

import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images', 'layers');

/**
 * sharp is a transitive dependency of Next's image optimiser rather than a
 * direct one, so it is not always linked at the project root under pnpm's
 * strict node_modules layout. Fall back to the content-addressed store.
 * (Same shim as scripts/generate-hero-assets.mjs.)
 */
function loadSharp() {
  try {
    return require('sharp');
  } catch {
    const [hit] = globSync('node_modules/.pnpm/sharp@*/node_modules/sharp', { cwd: ROOT });
    if (!hit) throw new Error('sharp not found, run `pnpm add -D sharp` and retry.');
    return require(path.join(ROOT, hit));
  }
}

/**
 * Source plate: a hand-knotted Bijar-style carpet shot square-on, deep madder
 * field, turquoise-ground hexagonal medallion, gold and ivory herati lattice.
 * From Unsplash's `persian-rug` set, 4000 x 6000, under the Unsplash Licence
 * (free for commercial use, attribution not required). The CDN ID is the only
 * stable handle Unsplash exposes here, the photographer's name could not be
 * resolved from it, so it is deliberately not asserted.
 *
 * Chosen because it is a genuine top-down frame of the weave with a single
 * coherent motif, not a rug in a room: anything with floor or furniture in
 * shot would have that background painted onto the mesh along with the rug.
 */
const SOURCE = 'https://images.unsplash.com/photo-1693332559291-380f10cd2253';

/* ── Layout ───────────────────────────────────────────────────────────
   The carpet spans the whole floor slab, so the texture has to be cut to the
   slab's aspect or the weave arrives stretched on one axis.

   MAT_W/MAT_L mirror components/3d/constants.js and the +0.5 mirrors the
   slab inset in FloorLayers.jsx. Duplicated rather than imported because
   this is a build script and those are client modules, but derived from the
   same primitives so the two cannot silently drift, if the scene's footprint
   changes, re-run this script and the crop follows. */
const MAT_W = 3.6;
const MAT_L = 2.6;
const ASPECT = (MAT_W + 0.5) / (MAT_L + 0.5);

const TEX_W = 1024;
const TEX_H = Math.round(TEX_W / ASPECT);
const FRINGE = 34; // strand band, top and bottom edges
const BORDER = 68; // main border plus guard stripes
const FIELD_W = TEX_W - BORDER * 2;
const FIELD_H = TEX_H - BORDER * 2 - FRINGE * 2;

/** Sampled off the source plate, so the drawn border cannot drift in hue. */
const PALETTE = {
  madder: '#7d1113',
  navy: '#101f2c',
  teal: '#2e7c86',
  gold: '#d99b28',
  ivory: '#e9dcc0',
  wool: '#ddd0b4',
};

/**
 * The border: a navy ground carrying a repeating rosette-and-diamond run,
 * fenced by thin ivory guard stripes on both sides. Real Persian borders are
 * busier than this, but at the size this renders, 23° above the floor and on
 * screen for the first eighth of the scroll, more detail turns to mush. What
 * has to read is the *rhythm*, a repeating motif inside guard lines, because
 * that is what separates a rug from a printed mat.
 */
function borderSvg() {
  const parts = [];
  const push = (s) => parts.push(s);

  // Guard stripes, drawn as four nested rectangles: outer selvedge, then the
  // navy ground, then the ivory fences either side of it.
  const frame = (inset, width, stroke) =>
    push(
      `<rect x="${FRINGE + inset}" y="${FRINGE + inset}" ` +
        `width="${TEX_W - (FRINGE + inset) * 2 + (FRINGE - FRINGE)}" ` +
        `height="${TEX_H - FRINGE * 2 - inset * 2}" ` +
        `fill="none" stroke="${stroke}" stroke-width="${width}" />`
    );

  // Navy ground for the main band.
  push(
    `<rect x="0" y="${FRINGE}" width="${TEX_W}" height="${TEX_H - FRINGE * 2}" fill="${PALETTE.navy}" />`
  );

  // Motif run. Spacing is chosen so a whole number of repeats fits each edge,
  // which is what stops the corners from cutting a rosette in half.
  const band = BORDER / 2 + FRINGE;
  const step = 52;
  const rosette = (cx, cy) =>
    `<g transform="translate(${cx} ${cy})">` +
      `<path d="M0,-15 L4.5,-4.5 L15,0 L4.5,4.5 L0,15 L-4.5,4.5 L-15,0 L-4.5,-4.5 Z" fill="${PALETTE.gold}"/>` +
      `<circle r="4.2" fill="${PALETTE.ivory}"/>` +
      `<circle r="1.8" fill="${PALETTE.madder}"/>` +
    `</g>`;
  const lozenge = (cx, cy) =>
    `<g transform="translate(${cx} ${cy})">` +
      `<path d="M0,-9 L7,0 L0,9 L-7,0 Z" fill="none" stroke="${PALETTE.teal}" stroke-width="2.6"/>` +
    `</g>`;

  const runH = (y) => {
    const n = Math.round((TEX_W - BORDER * 2) / step);
    const pitch = (TEX_W - BORDER * 2) / n;
    for (let i = 0; i < n; i += 1) {
      const cx = BORDER + pitch * (i + 0.5);
      push(i % 2 ? lozenge(cx, y) : rosette(cx, y));
    }
  };
  const runV = (x) => {
    const top = FRINGE + BORDER;
    const n = Math.round((TEX_H - FRINGE * 2 - BORDER * 2) / step);
    const pitch = (TEX_H - FRINGE * 2 - BORDER * 2) / n;
    for (let i = 0; i < n; i += 1) {
      const cy = top + pitch * (i + 0.5);
      push(i % 2 ? lozenge(x, cy) : rosette(x, cy));
    }
  };

  runH(band);
  runH(TEX_H - band);
  runV(BORDER / 2);
  runV(TEX_W - BORDER / 2);

  // Ivory guard fences, inner and outer edge of the navy band.
  frame(2, 3, PALETTE.ivory);
  frame(BORDER - 4, 3, PALETTE.ivory);
  frame(BORDER - 10, 1.5, PALETTE.gold);

  return parts.join('');
}

/**
 * Fringe: the warp ends, on the two edges the carpet rolls from.
 *
 * Deliberately irregular. A fringe of evenly spaced identical strands is an
 * instant tell, real warp ends splay, clump and vary in length, so each
 * strand gets a deterministic jitter (a fixed seed, so the texture is
 * byte-identical on every run and diffs stay clean).
 */
function fringeSvg(colour) {
  const parts = [];
  let seed = 20260728;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const strand = (x, yTop, dir) => {
    const len = FRINGE * (0.55 + rand() * 0.42);
    const drift = (rand() - 0.5) * 5;
    const w = 1.5 + rand() * 1.4;
    return (
      `<path d="M${x},${yTop} q${drift * 0.4},${(len * dir) / 2} ${drift},${len * dir}" ` +
      `stroke="${colour}" stroke-width="${w}" stroke-linecap="round" fill="none" />`
    );
  };

  // A knotted selvedge bar the strands hang off, which is what stops the
  // fringe reading as loose hair floating beside the rug.
  parts.push(
    `<rect x="0" y="${FRINGE - 4}" width="${TEX_W}" height="5" fill="${colour}" />`,
    `<rect x="0" y="${TEX_H - FRINGE - 1}" width="${TEX_W}" height="5" fill="${colour}" />`
  );

  for (let x = 3; x < TEX_W; x += 5) {
    parts.push(strand(x + (rand() - 0.5) * 2, FRINGE - 3, -1));
    parts.push(strand(x + (rand() - 0.5) * 2, TEX_H - FRINGE + 3, 1));
  }
  return parts.join('');
}

const svgDoc = (body, background) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TEX_W}" height="${TEX_H}">` +
      (background ? `<rect width="100%" height="100%" fill="${background}"/>` : '') +
      body +
      `</svg>`
  );

async function main() {
  const sharp = loadSharp();
  await mkdir(OUT, { recursive: true });

  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`source fetch failed: ${response.status}`);
  const plate = Buffer.from(await response.arrayBuffer());

  /* Field: the photograph, cropped to the field's aspect rather than squashed.
     The saturation lift compensates for the scene's 0.85 tone-mapping
     exposure, which otherwise pulls the madder red toward brown. */
  const field = await sharp(plate)
    .resize(FIELD_W, FIELD_H, { fit: 'cover', position: 'centre' })
    .modulate({ saturation: 1.1 })
    .toBuffer();

  /* ── Albedo ─────────────────────────────────────────────────────── */
  const albedo = await sharp({
    create: {
      width: TEX_W,
      height: TEX_H,
      channels: 3,
      background: PALETTE.navy,
    },
  })
    .composite([
      { input: svgDoc(borderSvg()), top: 0, left: 0 },
      { input: field, top: FRINGE + BORDER, left: BORDER },
      { input: svgDoc(fringeSvg(PALETTE.wool)), top: 0, left: 0 },
    ])
    .webp({ quality: 72, effort: 6 })
    .toBuffer();

  await writeFile(path.join(OUT, 'kashmiri-carpet.webp'), albedo);

  /* ── Alpha ───────────────────────────────────────────────────────
     White over the woven rug, strand-shaped over the fringe bands, black in
     between. This is what turns the fringe from a pale rectangle into
     separate threads with daylight between them. */
  const alpha = await sharp({
    create: { width: TEX_W, height: TEX_H, channels: 3, background: '#000000' },
  })
    .composite([
      {
        input: svgDoc(
          `<rect x="0" y="${FRINGE}" width="${TEX_W}" height="${TEX_H - FRINGE * 2}" fill="#ffffff"/>` +
            fringeSvg('#ffffff')
        ),
        top: 0,
        left: 0,
      },
    ])
    .greyscale()
    .webp({ quality: 88, effort: 6 })
    .toBuffer();

  await writeFile(path.join(OUT, 'kashmiri-carpet-alpha.webp'), alpha);

  /* ── Roughness ───────────────────────────────────────────────────
     Wool is uniformly matte in the sense that none of it is glossy, but a
     flat roughness constant is what makes CG fabric read as plastic. Pile
     lies in different directions across a knotted carpet, so luminance is a
     decent free proxy: linear() compresses it into roughly 0.72–0.97 rather
     than the full range, and the blur keeps it a surface property instead of
     a second copy of the pattern. Half width, it carries no detail the eye
     resolves. */
  const rough = await sharp(albedo)
    .resize(TEX_W / 2)
    .greyscale()
    .linear(0.25, 184)
    .blur(1.2)
    .webp({ quality: 72, effort: 6 })
    .toBuffer();

  await writeFile(path.join(OUT, 'kashmiri-carpet-rough.webp'), rough);

  const kb = (b) => `${(b.length / 1024).toFixed(0)} kB`;
  console.log(`texture           ${TEX_W}x${TEX_H}`);
  console.log(`  albedo          ${kb(albedo)}`);
  console.log(`  alpha           ${kb(alpha)}`);
  console.log(`  roughness       ${kb(rough)}`);
  console.log(`fringe band       ${(FRINGE / TEX_H).toFixed(4)} of height, each end`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
