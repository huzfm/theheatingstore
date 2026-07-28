import { chromium } from 'playwright';

const OUT = process.argv[2] || 'shot';
const points = [0.0, 0.05, 0.09, 0.13, 0.17, 0.24];

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR', m.text()); });

await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(9000);

// The lead popup covers the viewport, blurs the page and locks body scroll.
await page.evaluate(() => {
  const hit = [...document.querySelectorAll('div,section,aside')].filter((n) => {
    const s = getComputedStyle(n);
    return (s.position === 'fixed' || s.position === 'absolute') &&
      /LET'S PLAN|Get Consultation/i.test(n.textContent || '');
  });
  hit.forEach((n) => n.remove());
  document.querySelectorAll('*').forEach((n) => {
    if (getComputedStyle(n).filter?.includes('blur')) n.style.filter = 'none';
  });
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});
await page.waitForTimeout(800);

const box = await page.evaluate(() => {
  const el = document.querySelector('[data-section="floor-reveal"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: el.offsetHeight };
});
console.log('section', JSON.stringify(box));
if (!box) { await browser.close(); process.exit(1); }

const span = box.height - 900;

for (const p of points) {
  const y = Math.round(box.top + span * p);
  await page.evaluate((v) => {
    if (window.lenis?.scrollTo) window.lenis.scrollTo(v, { immediate: true });
    window.scrollTo(0, v);
  }, y);
  await page.waitForTimeout(2600);
  const at = await page.evaluate(() => Math.round(window.scrollY));
  const file = `${OUT}-p${String(Math.round(p * 100)).padStart(3, '0')}.png`;
  await page.screenshot({ path: file });
  console.log('shot', file, 'want', y, 'got', at);
}

await browser.close();
