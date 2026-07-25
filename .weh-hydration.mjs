import { chromium } from 'playwright';

const browser = await chromium.launch();

for (const pass of [1, 2]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('http://localhost:3000/landing', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(7000);
  const hydration = errs.filter(e => e.includes('Hydration'));
  console.log(`pass ${pass}: pageerrors=${errs.length} hydration=${hydration.length}`);
  if (hydration.length) {
    const m = hydration[0].match(/[+-]\s+\{"[^\n]*/g);
    console.log((m || []).join('\n'));
  }
  await page.close();
}

await browser.close();
