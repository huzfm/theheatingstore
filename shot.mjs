import { chromium } from 'playwright';

const OUT = process.env.TEMP + '/shots';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => console.log('PAGE ERROR:', String(e).slice(0,300)));
page.on('console', m => { if (m.type()==='error') console.log('CONSOLE:', m.text().slice(0,300)); });

await page.goto('http://localhost:3012/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

// Kill the lead-capture modal and the chat bubble so they don't cover the canvas
await page.addStyleTag({ content: `
  [class*="fixed"][class*="z-"] { }
  div[role="dialog"], .fixed.inset-0 { display: none !important; }
` }).catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});

const box = await page.evaluate(() => {
  const el = document.querySelector('[data-section="floor-reveal"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
});
console.log('floor-reveal section:', JSON.stringify(box));
if (!box) { await browser.close(); process.exit(1); }

const scrollable = box.height - box.vh;
for (const p of [0.05, 0.25, 0.45, 0.72, 0.95]) {
  await page.evaluate((y) => window.scrollTo(0, y), box.top + scrollable * p);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/r${String(p).replace('.','_')}.png`, timeout: 60000 });
  console.log('captured', p);
}
console.log(await page.evaluate(() => {
  const c = document.querySelector('canvas');
  if (!c) return 'NO CANVAS';
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  return `canvas ${c.width}x${c.height} webgl=${!!gl} renderer=${gl ? gl.getParameter(gl.RENDERER) : 'n/a'}`;
}));
await browser.close();
