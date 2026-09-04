/**
 * Guards the metadata rules that Phase 2 established, against the BUILT output
 * rather than against the source, because the App Router's metadata
 * inheritance is where the original bugs came from: a page that declares
 * `openGraph` without `twitter` silently keeps the parent's twitter block, and
 * that is how 48 of 55 routes ended up sharing one twitter:description.
 * Checking source objects would not have caught it. Checking the HTML does.
 *
 * Run after `next build`:
 *   node scripts/check-metadata.mjs
 *
 * Exits non-zero on any violation, so it can gate a deploy.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const BUILT = path.join(ROOT, '.next', 'server', 'app');

/* Routes exempt from the content rules. Each is exempt for a stated reason,
   not because it was inconvenient. */
const EXEMPT = new Set([
  '/_global-error',
  '/_not-found',
  '/AboutSection',   // renders nothing; flagged for deletion
  '/admin',          // internal dashboard, flagged for noindex
  '/experience/foundation-check', // noindex tool page
  '/hero',           // legacy demo, copy left as authored pending noindex
  '/landing',        // Google Ads landing page, noindex by design
  '/local-experience',   // 308s to /why-choose-us
  '/global-experience',  // 308s to /why-choose-us
]);

const MAX_TITLE = 60;
const DESC_MIN = 140;
const DESC_MAX = 160;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const decode = (s) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const pick = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};

if (!fs.existsSync(BUILT)) {
  console.error(`No build found at ${BUILT}. Run "pnpm build" first.`);
  process.exit(1);
}

const problems = [];
const seen = { title: new Map(), description: new Map(), twitter: new Map() };

for (const file of walk(BUILT).sort()) {
  const route =
    file.slice(BUILT.length).split(path.sep).join('/').replace(/\.html$/, '').replace(/^\/index$/, '/') || '/';
  if (EXEMPT.has(route)) continue;

  const html = fs.readFileSync(file, 'utf8');
  const fail = (msg) => problems.push(`${route}: ${msg}`);

  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const tw = pick(html, /<meta name="twitter:description" content="([^"]*)"/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const ogImage = pick(html, /<meta property="og:image" content="([^"]*)"/);
  const keywords = pick(html, /<meta name="keywords" content="([^"]*)"/);

  if (!title) fail('no <title>');
  else if (title.length > MAX_TITLE) fail(`title ${title.length} > ${MAX_TITLE} chars`);

  if (!desc) fail('no meta description');
  else if (desc.length < DESC_MIN || desc.length > DESC_MAX)
    fail(`description ${desc.length} chars, want ${DESC_MIN}-${DESC_MAX}`);

  if (!canonical) fail('no canonical');
  if (!ogImage) fail('no og:image');
  else if (!/^https?:\/\/theheatingstore\.in\//.test(ogImage))
    fail(`og:image is not a local URL: ${ogImage}`);

  if (keywords) fail('has a keywords meta tag');

  // Uniqueness. This is the check that would have caught the original bug.
  for (const [k, v] of [['title', title], ['description', desc], ['twitter', tw]]) {
    if (!v) continue;
    if (seen[k].has(v)) fail(`duplicate ${k} shared with ${seen[k].get(v)}`);
    else seen[k].set(v, route);
  }

  // One h1, and no skipped levels.
  const levels = [...html.matchAll(/<h([1-6])[ >]/g)].map((m) => +m[1]);
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) fail(`${h1s} h1 elements, want exactly 1`);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      fail(`heading level skips h${levels[i - 1]} -> h${levels[i]}`);
      break;
    }
  }
}

if (problems.length) {
  console.error(`\nMetadata check FAILED, ${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('Metadata check passed.');
