import { chromium } from 'playwright';

const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:3000/about';

const shots = [
  { name: 'mobile-390', width: 390, height: 844, dsf: 2, mobile: true },
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1, mobile: false },
];

const browser = await chromium.launch();

for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.dsf,
    isMobile: s.mobile,
    hasTouch: s.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });
  // Let the hero reveals settle.
  await page.waitForTimeout(3500);

  // First viewport only — the fold is the thing under test.
  await page.screenshot({ path: `${OUT}/${s.name}-fold.png` });

  // Measured fold report.
  const report = await page.evaluate(() => {
    const vh = window.innerHeight;
    const q = (sel) => document.querySelector(sel);
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
    };
    const hero = q('main > section');
    const h1 = q('h1');
    const panel = h1?.closest('div')?.parentElement?.parentElement?.querySelector('.aspect-square');
    return {
      innerHeight: vh,
      heroHeight: box(hero)?.h,
      h1: box(h1),
      panel: box(panel),
      panelFullyVisible: panel ? panel.getBoundingClientRect().bottom <= vh : null,
    };
  });
  console.log(s.name, JSON.stringify(report, null, 2));

  // Whole page too, for context.
  await page.screenshot({ path: `${OUT}/${s.name}-full.png`, fullPage: false });
  await ctx.close();
}

await browser.close();
