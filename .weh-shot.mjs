import { chromium } from 'playwright';

const OUT = '/private/tmp/claude-501/-Users-user-theheatingstore/b0c0f15c-0e6e-4965-b0a9-087b473d8925/scratchpad';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function shoot(name, width, height, reduce) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  page.on('pageerror', e => console.log('PAGE ERROR:', String(e).slice(0, 300)));
  page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE:', m.text().slice(0, 200)); });

  await page.goto('http://localhost:3000/landing', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('#why-electric-hamam', { timeout: 60000 });
  await page.waitForTimeout(2500);

  await page.evaluate(() => {
    const el = document.querySelector('#why-electric-hamam');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
  });
  await page.waitForTimeout(3500);

  const el = await page.$('#why-electric-hamam');
  await el.screenshot({ path: `${OUT}/${name}.png`, timeout: 60000 });
  console.log('captured', name);

  // Report the live transforms so we can verify the 3D math actually applied.
  const report = await page.evaluate(() => {
    const wraps = [...document.querySelectorAll('.weh-card-wrap')];
    return {
      count: wraps.length,
      perspective: getComputedStyle(document.querySelector('.weh-carousel')).perspective,
      preserve3d: getComputedStyle(document.querySelector('.weh-carousel-track')).transformStyle,
      transforms: wraps.map(w => getComputedStyle(w).transform.slice(0, 90)),
      shadows: wraps.map(w => getComputedStyle(w.querySelector('.weh-card')).boxShadow.slice(0, 60)),
      headingText: document.querySelector('#why-electric-hamam h2').textContent,
    };
  });
  console.log(name, JSON.stringify(report, null, 1));
  await page.close();
}

await shoot('weh-desktop', 1440, 900, false);
await shoot('weh-reduced', 1440, 900, true);
await shoot('weh-mobile', 390, 844, false);
await browser.close();
