/**
 * Hero asset pipeline, run with `node scripts/generate-hero-assets.mjs`.
 *
 * The source plate ships as a 2.4 MB lossless PNG of a 1.6 MP photograph, and
 * it is the LCP element of the home page. That single file costs more perceived
 * quality on a mid-range Android connection than any amount of motion work can
 * buy back, so it gets converted to a responsive AVIF/WebP set here.
 *
 * This script also authors the channel-packed mask the WebGL layer samples.
 * Packing three masks into one RGB image means one request, one texture upload,
 * and one place where the scene's understanding of the photograph lives:
 *
 *   R, nearness   0 = far field (window, mountains), 1 = foreground coil bed
 *   G, coil emission  where the heating loops glow (drives ignition + bloom)
 *   B, firelight      the flame, plus its reflection in the polished stone
 *
 * The masks are hand-authored as maths rather than painted by hand so they stay
 * editable: every constant below is a normalised coordinate read off the plate,
 * so if the photograph is ever re-shot or re-cropped, retune the numbers here
 * instead of re-painting a PNG in an external editor.
 */

import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * sharp is a transitive dependency of Next's image optimiser rather than a
 * direct one, so it is not always linked at the project root under pnpm's
 * strict node_modules layout. Fall back to the content-addressed store.
 */
function loadSharp() {
  try {
    return require('sharp');
  } catch {
    const [hit] = globSync('node_modules/.pnpm/sharp@*/node_modules/sharp', { cwd: ROOT });
    if (!hit) {
      throw new Error('sharp not found, run `pnpm add -D sharp` and retry.');
    }
    return require(path.join(ROOT, hit));
  }
}

const sharp = loadSharp();

const SRC = path.join(ROOT, 'public/images/elecr.png');
const OUT = path.join(ROOT, 'public/images/hero');

// The plate is 1649px wide. Upscaling past native invents detail the photograph
// does not contain, so native is the ceiling and the rest are honest steps down.
const WIDTHS = [1649, 1280, 960, 640];

const MASK_W = 256;

/* ── mask maths ────────────────────────────────────────────────────────── */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

const lerp = (a, b, t) => a + (b - a) * t;

/** Radial falloff with a soft gaussian shoulder, in normalised UV space. */
function blob(u, v, cx, cy, rx, ry) {
  const dx = (u - cx) / rx;
  const dy = (v - cy) / ry;
  return Math.exp(-(dx * dx + dy * dy));
}

/**
 * R, nearness. Drives depth-separated parallax: the far field drifts with the
 * pointer, the coil bed drifts against it, and that opposition is what reads as
 * dimension rather than as a sliding photograph.
 */
function nearnessAt(u, v) {
  // The floor horizon sits around v=0.34; below it the room comes toward camera.
  const base = smoothstep(0.34, 0.96, v);

  // The timber cladding runs off the left edge of frame, so its left-most
  // sliver is physically closest to the lens even though it sits high in frame.
  const wall = (1 - smoothstep(0.02, 0.26, u)) * (1 - smoothstep(0.55, 0.95, v)) * 0.35;

  // The glazing is effectively at infinity; pin it to zero so the mountains
  // never inherit foreground drift from the vertical ramp.
  const window = smoothstep(0.6, 0.66, u) * (1 - smoothstep(0.3, 0.38, v));

  return clamp01(clamp01(base + wall) * (1 - window));
}

/**
 * G, coil emission. The heating bed is a trapezoid in perspective: narrow
 * where it recedes, wide at the bottom of frame.
 */
function coilAt(u, v) {
  const enter = smoothstep(0.54, 0.64, v);
  if (enter <= 0) return 0;

  const t = clamp01((v - 0.56) / 0.44);
  const left = lerp(0.3, 0.06, t);
  const right = lerp(0.82, 1.02, t);

  const inside =
    smoothstep(left, left + 0.07, u) * (1 - smoothstep(right - 0.07, right, u));

  // Ease off against the very bottom edge so the glow does not terminate on a
  // hard line when the plate is cropped by a short viewport.
  const bottom = 1 - smoothstep(0.97, 1.0, v) * 0.35;

  return clamp01(enter * inside * bottom);
}

/**
 * B, firelight. Two lobes: the flame itself, and the smeared reflection it
 * throws across the polished stone. Modulating both together from one signal is
 * what makes a still photograph read as a live plate.
 */
function fireAt(u, v) {
  const flame = blob(u, v, 0.575, 0.275, 0.062, 0.055);
  const reflection = blob(u, v, 0.6, 0.46, 0.1, 0.13) * 0.55;
  return clamp01(flame + reflection);
}

/* ── pipeline ──────────────────────────────────────────────────────────── */

async function buildResponsiveSet(meta) {
  const results = [];

  for (const width of WIDTHS) {
    if (width > meta.width) continue;

    const resized = () =>
      sharp(SRC).resize({ width, withoutEnlargement: true, kernel: 'lanczos3' });

    // effort:6 is a deliberate build-time/size trade, this runs rarely and the
    // bytes ship to every visitor.
    const avif = await resized()
      .avif({ quality: 58, effort: 6, chromaSubsampling: '4:2:0' })
      .toBuffer();
    const webp = await resized().webp({ quality: 78, effort: 6 }).toBuffer();

    await writeFile(path.join(OUT, `plate-${width}.avif`), avif);
    await writeFile(path.join(OUT, `plate-${width}.webp`), webp);

    results.push({ width, avif: avif.length, webp: webp.length });
  }

  return results;
}

async function buildMask(meta) {
  const height = Math.round(MASK_W / (meta.width / meta.height));
  const data = Buffer.alloc(MASK_W * height * 3);

  for (let y = 0; y < height; y += 1) {
    // Sample at pixel centres so the mask stays symmetric when it is later
    // upscaled by the GPU's bilinear filter.
    const v = (y + 0.5) / height;
    for (let x = 0; x < MASK_W; x += 1) {
      const u = (x + 0.5) / MASK_W;
      const i = (y * MASK_W + x) * 3;
      data[i] = Math.round(nearnessAt(u, v) * 255);
      data[i + 1] = Math.round(coilAt(u, v) * 255);
      data[i + 2] = Math.round(fireAt(u, v) * 255);
    }
  }

  const png = await sharp(data, { raw: { width: MASK_W, height, channels: 3 } })
    // A light blur removes the stair-stepping that smoothstep leaves on near
    // vertical edges; the masks are all low-frequency by design so this costs
    // no meaningful detail.
    .blur(1.2)
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  await writeFile(path.join(OUT, 'masks.png'), png);
  return { width: MASK_W, height, bytes: png.length };
}

/**
 * A 24px-wide blurred placeholder, inlined as a data URI. It occupies the hero
 * for the handful of frames before the full plate decodes, so the cold open
 * begins on a warm-toned frame rather than on empty background.
 */
async function buildPlaceholder() {
  const buf = await sharp(SRC).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const uri = `data:image/webp;base64,${buf.toString('base64')}`;

  await writeFile(
    path.join(ROOT, 'app/hero/plate-placeholder.js'),
    `// Generated by scripts/generate-hero-assets.mjs, do not edit by hand.\n` +
      `export const PLATE_PLACEHOLDER =\n  '${uri}';\n`,
  );

  return uri.length;
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

async function main() {
  await mkdir(OUT, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log(`source  ${meta.width}×${meta.height} ${meta.format}  ${kb(meta.size ?? 0)}`);

  const set = await buildResponsiveSet(meta);
  for (const r of set) {
    console.log(`  ${String(r.width).padStart(4)}w   avif ${kb(r.avif).padStart(9)}   webp ${kb(r.webp).padStart(9)}`);
  }

  const mask = await buildMask(meta);
  console.log(`masks   ${mask.width}×${mask.height}  ${kb(mask.bytes)}`);

  const placeholder = await buildPlaceholder();
  console.log(`lqip    ${kb(placeholder)} inline`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
