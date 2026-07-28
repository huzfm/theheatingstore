import { chromium } from 'playwright';

const OUT = process.argv[2];
const BASE = 'http://localhost:3000/about';

// Fractions of the timeline section's own scroll range to capture.
const SHOTS = [0, 0.25, 0.5, 0.75, 1];

async function shoot(page, label, w, h) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const box = await page.evaluate(() => {
    const el = document.querySelector('[data-section="about-stair"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });

  if (!box) {
    console.log(`${label}: SECTION NOT FOUND`);
    return;
  }
  console.log(`${label}: top=${Math.round(box.top)} height=${Math.round(box.height)} (${Math.round(box.height / h * 100)}vh)`);

  const scrub = box.height - h; // sticky child is 100vh
  for (const f of SHOTS) {
    await page.evaluate((y) => window.scrollTo(0, y), box.top + scrub * f);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${label}-${String(f).replace('.', '')}.png` });
  }

  // Reverse pass: confirm it tracks back correctly.
  await page.evaluate((y) => window.scrollTo(0, y), box.top + scrub * 0.5);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${label}-reverse05.png` });
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 220));
});
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 220)));

await shoot(page, 'desktop', 1440, 900);
await shoot(page, 'mobile', 390, 844);

console.log('\nconsole errors:', errors.length ? '\n  ' + [...new Set(errors)].join('\n  ') : 'none');
await browser.close();
