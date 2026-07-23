import { chromium } from 'playwright';
const OUT = process.env.TEMP + '/shots';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
// iPhone 12/13/14 logical viewport
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await page.goto('http://localhost:3012/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4500);
await page.evaluate(() => {
  document.querySelectorAll('body *').forEach(el => {
    const s = getComputedStyle(el);
    if (s.position === 'fixed' && el.offsetWidth > 200 && el.offsetHeight > 150 && !el.querySelector('canvas')) el.remove();
  });
});
const box = await page.evaluate(() => {
  const el = document.querySelector('[data-section="floor-reveal"]');
  if(!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
});
console.log('section:', JSON.stringify(box));
const scrollable = box.height - box.vh;
for (const p of [0.05, 0.45, 0.95]) {
  await page.evaluate((y) => window.scrollTo(0, y), box.top + scrollable * p);
  await page.waitForTimeout(2800);
  await page.evaluate(() => {
    document.querySelectorAll('body *').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && el.offsetWidth > 200 && el.offsetHeight > 150 && !el.querySelector('canvas')) el.remove();
    });
  });
  await page.screenshot({ path: `${OUT}/m${String(p).replace('.','_')}.png` });
}
await browser.close();
console.log('mobile shots done');
