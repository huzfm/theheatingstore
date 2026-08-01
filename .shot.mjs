import { chromium } from 'playwright';

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1500);

const canvas = await page.$('[data-section="origin-gallery"] canvas');
if (!canvas) {
  console.log('NO CANVAS');
} else {
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'shot-a.png' });

  const box = await canvas.boundingBox();
  const cy = box.y + box.height * 0.5;
  await page.mouse.move(box.x + box.width * 0.7, cy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, cy, { steps: 25 });
  await page.mouse.up();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shot-b.png' });
}

console.log('ERRORS:', errors.slice(0, 12).join('\n---\n') || 'none');
await browser.close();
