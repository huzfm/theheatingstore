'use client';

import MeasuringUpHero from '@/components/sections/MeasuringUp/MeasuringUpHero';
import MeasureSteps from '@/components/sections/MeasuringUp/MeasureSteps';
import AreaCalculator from '@/components/sections/MeasuringUp/AreaCalculator';
import SystemComparison from '@/components/sections/MeasuringUp/SystemComparison';
import MeasuringUpCTA from '@/components/sections/MeasuringUp/MeasuringUpCTA';

/**
 * /measuring-up, dark cinematic redesign. Composed from per-section components
 * in components/sections/MeasuringUp/, matching every other route: the same
 * heat/ink/bone tokens, Bebas Neue display face, and RevealText / HeroCTAs
 * primitives. Reduced motion honoured throughout.
 *
 * This replaced a 1,658-line self-contained client component with its own
 * inline palette, a large inline <style> block, seven hand-rolled SVG icons,
 * and light-on-dark form fields that were the only white input surfaces on the
 * site.
 *
 * The calculator's arithmetic is carried across untouched, it is the only
 * interactive tool on the site and the only thing here a customer might act
 * on. See the header comment in AreaCalculator for the formula.
 *
 * Three corrections went in with the rewrite, all noted at their site:
 *   - Step 2 claimed a "standard deduction of 20% for fixed furniture" that
 *     the calculator has never applied, and the 10% it does apply (perimeter
 *     and mat spacing) was never explained. See data.js.
 *   - The electric card linked to /electric-underfloor-heating, which is not a
 *     route in this app. Now /product.
 *   - The four trust badges (next-day delivery, price-smash promise, 60-day
 *     money back) were UK e-commerce claims with no counterpart anywhere else
 *     on this site, and are dropped rather than restyled.
 */
export default function MeasuringUpClient() {
  return (
    <main className="bg-ink-950">
      <MeasuringUpHero />
      <MeasureSteps />
      <AreaCalculator />
      <SystemComparison />
      <MeasuringUpCTA />
    </main>
  );
}
