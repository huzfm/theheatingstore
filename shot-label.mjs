import { chromium } from 'playwright';
const OUT = process.env.TEMP + '/shots';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3012/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4500);

// Nuke any lead-capture / chat overlay so it can't cover the canvas.
await page.evaluate(() => {
  document.querySelectorAll('body *').forEach(el => {
    const s = getComputedStyle(el);
    if (s.position === 'fixed' && el.offsetWidth > 300 && el.offsetHeight > 200 &&
        !el.querySelector('canvas')) el.remove();
  });
});

const box = await page.evaluate(() => {
  const el = document.querySelector('[data-section="floor-reveal"]');
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
});
const scrollable = box.height - box.vh;

// 0.95 shows card 02 (right side); 0.72 shows card 01 (right side)
for (const [p, clip] of [
  [0.95, { x: 860, y: 300, width: 460, height: 420 }],
  [0.72, { x: 820, y: 380, width: 470, height: 400 }],
]) {
  await page.evaluate((y) => window.scrollTo(0, y), box.top + scrollable * p);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    document.querySelectorAll('body *').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && el.offsetWidth > 300 && el.offsetHeight > 200 &&
          !el.querySelector('canvas')) el.remove();
    });
  });
  await page.screenshot({ path: `${OUT}/card_full_${String(p).replace('.','_')}.png` });
  await page.screenshot({ path: `${OUT}/card_${String(p).replace('.','_')}.png`, clip });
}
await browser.close();
console.log('card shots done');
