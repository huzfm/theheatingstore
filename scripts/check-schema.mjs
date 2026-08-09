/**
 * Validates every JSON-LD block in the built output.
 *
 * This is not a full schema.org validator, it checks the things that actually
 * go wrong and that Google's Rich Results Test flags:
 *
 *   - blocks that are not parseable JSON
 *   - missing @context / @type
 *   - required properties per type (Google's documented requirements)
 *   - Offer without price, which is what made the old Product blocks invalid
 *   - AggregateRating or Review anywhere, which this site must never emit
 *   - two nodes of a business type on one page with different @id, i.e. the
 *     page claiming to be two different companies
 *
 * Run after `next build`:
 *   node scripts/check-schema.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const BUILT = path.join(process.cwd(), '.next', 'server', 'app');

/** Google's required properties, by type. */
const REQUIRED = {
  LocalBusiness: ['name', 'address'],
  ProfessionalService: ['name'],
  Service: ['name'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  BreadcrumbList: ['itemListElement'],
  HowTo: ['name', 'step'],
  PostalAddress: ['addressLocality', 'addressCountry'],
};

const BUSINESS_TYPES = /^(LocalBusiness|Organization|ProfessionalService|HomeAndConstructionBusiness|Store)$/;
const BANNED = /^(AggregateRating|Review|Rating)$/;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** Depth-first walk of a schema object, yielding every node with an @type. */
function* nodes(obj) {
  if (Array.isArray(obj)) {
    for (const v of obj) yield* nodes(v);
    return;
  }
  if (!obj || typeof obj !== 'object') return;
  if (obj['@type']) yield obj;
  for (const v of Object.values(obj)) yield* nodes(v);
}

if (!fs.existsSync(BUILT)) {
  console.error('No build found. Run "pnpm build" first.');
  process.exit(1);
}

const problems = [];
let blockCount = 0;
let nodeCount = 0;

for (const file of walk(BUILT).sort()) {
  const route =
    file.slice(BUILT.length).split(path.sep).join('/').replace(/\.html$/, '').replace(/^\/index$/, '/') || '/';
  const html = fs.readFileSync(file, 'utf8');
  const fail = (m) => problems.push(`${route}: ${m}`);

  const businessIds = new Set();

  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    blockCount++;
    let parsed;
    try {
      parsed = JSON.parse(m[1].replace(/\\u003c/g, '<'));
    } catch (e) {
      fail(`unparseable JSON-LD: ${e.message}`);
      continue;
    }

    if (!parsed['@context']) fail('block has no @context');

    for (const node of nodes(parsed)) {
      nodeCount++;
      const types = [].concat(node['@type']);

      for (const type of types) {
        if (BANNED.test(type)) fail(`emits ${type}, which this site must not publish`);

        const required = REQUIRED[type];
        if (required) {
          for (const prop of required) {
            if (node[prop] === undefined) fail(`${type} missing required property "${prop}"`);
          }
        }

        if (BUSINESS_TYPES.test(type)) {
          businessIds.add(node['@id'] || '(no @id)');
        }

        // An Offer needs a price or a priceSpecification. priceCurrency alone
        // is the exact shape the old Product blocks had, and it is invalid.
        if (type === 'Offer' && node.price === undefined && node.priceSpecification === undefined) {
          fail('Offer has no price or priceSpecification');
        }

        if (type === 'BreadcrumbList') {
          const items = node.itemListElement || [];
          items.forEach((it, i) => {
            if (it.position !== i + 1) fail(`BreadcrumbList position ${it.position} out of order at index ${i}`);
            if (!it.item) fail('BreadcrumbList ListItem has no item URL');
          });
        }
      }
    }
  }

  if (businessIds.size > 1) {
    fail(`page declares ${businessIds.size} distinct business entities: ${[...businessIds].join(', ')}`);
  }
  if (businessIds.has('(no @id)') && businessIds.size === 1 && blockCount) {
    // A single business node without an @id is tolerable but not ideal; only
    // flag when the site-wide one should have supplied it.
    fail('business node has no @id');
  }
}

console.log(`Scanned ${blockCount} JSON-LD blocks, ${nodeCount} typed nodes.`);
if (problems.length) {
  console.error(`\nSchema check FAILED, ${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('Schema check passed.');
