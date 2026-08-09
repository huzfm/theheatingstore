/**
 * Renders /public/og/default.jpg, the site's Open Graph card.
 *
 * Run: node scripts/build-og-image.mjs
 *
 * Why a script rather than a checked-in binary nobody can regenerate: the card
 * carries the company name and the positioning line, both of which change. This
 * keeps the source of the image in the repo as markup, so editing the wording
 * is a text edit and a re-run.
 *
 * Why not next/og (ImageResponse): that generates the card per-request at the
 * edge, which is the right tool when the card is dynamic (per-post, per-brand).
 * Ours is one static card for every route, so a build-time JPEG is one file,
 * zero runtime cost, and works when the crawler ignores query strings.
 *
 * Palette and type are lifted from the site footer so the card is recognisably
 * the same brand: ink gradient, amber accent (#E8933A), the wordmark set with
 * "Heating" carrying the accent.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'og');
const OUT_FILE = path.join(OUT_DIR, 'default.jpg');

const WIDTH = 1200;
const HEIGHT = 630;

/* System font stacks only. This runs offline in CI; a webfont that fails to
   load would silently render the card in Times New Roman. */
const HTML = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 76px 84px;
    background:
      radial-gradient(72% 46% at 50% 0%, rgba(184,107,69,0.34), transparent 68%),
      radial-gradient(46% 44% at 90% 104%, rgba(232,147,58,0.16), transparent 72%),
      linear-gradient(170deg, #2B1E1A 0%, #17100D 100%);
    color: #F0E8E1;
    font-family: "Segoe UI", -apple-system, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }
  /* Hairline of light along the top edge, the seam used in the site footer. */
  .seam {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(232,147,58,0.75) 50%, transparent);
  }
  .eyebrow {
    font-size: 21px; font-weight: 600; letter-spacing: 0.30em; text-transform: uppercase;
    color: rgba(232,147,58,0.95);
    display: flex; align-items: center; gap: 20px;
  }
  .eyebrow::before { content: ""; width: 62px; height: 2px; background: rgba(232,147,58,0.65); }
  .wordmark { font-size: 96px; line-height: 1.0; letter-spacing: -0.022em; }
  .wordmark .thin  { font-weight: 300; color: rgba(255,255,255,0.90); }
  .wordmark .accent{ font-weight: 700; color: #E8933A; }
  .lede {
    margin-top: 30px; font-size: 35px; line-height: 1.42; font-weight: 400;
    color: rgba(232,220,210,0.90); max-width: 21ch;
  }
  .foot {
    display: flex; align-items: center; gap: 22px;
    font-size: 23px; font-weight: 500; letter-spacing: 0.035em;
    color: rgba(240,232,225,0.62);
  }
  .dot { width: 6px; height: 6px; border-radius: 999px; background: rgba(232,147,58,0.85); }
</style></head>
<body>
  <div class="seam"></div>

  <div class="eyebrow">Since 2011 &middot; Srinagar, Kashmir</div>

  <div>
    <div class="wordmark">
      <span class="thin">The</span> <span class="accent">Heating</span> <span class="thin">Store</span>
    </div>
    <div class="lede">Electric hamam &amp; underfloor heating, engineered for the Kashmiri winter.</div>
  </div>

  <div class="foot">
    <span>theheatingstore.in</span>
    <span class="dot"></span>
    <span>UK-imported systems</span>
    <span class="dot"></span>
    <span>Lifetime warranty</span>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2, // render at 2x, then downscale, so type edges stay clean
});
await page.setContent(HTML, { waitUntil: 'load' });

await mkdir(OUT_DIR, { recursive: true });
await page.screenshot({
  path: OUT_FILE,
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  scale: 'css', // honour the clip in CSS pixels, so the file is exactly 1200x630
});

await browser.close();
console.log(`wrote ${path.relative(ROOT, OUT_FILE)} (${WIDTH}x${HEIGHT})`);
