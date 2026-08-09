'use client';

import MeasuringUpHero from '@/components/sections/MeasuringUp/MeasuringUpHero';
import MeasureSteps from '@/components/sections/MeasuringUp/MeasureSteps';
import AreaCalculator from '@/components/sections/MeasuringUp/AreaCalculator';
import InstallationEconomics from '@/components/sections/MeasuringUp/InstallationEconomics';
import SystemComparison from '@/components/sections/MeasuringUp/SystemComparison';
import MeasuringUpCTA from '@/components/sections/MeasuringUp/MeasuringUpCTA';

/**
 * /measuring-up, dark cinematic redesign. Composed from per-section components
 * in components/sections/MeasuringUp/, matching every other route: the same
 * heat/ink/bone tokens, Bebas Neue display face, and RevealText / HeroCTAs
 * primitives. Reduced motion honoured throughout.
 *
 * This replaced a 1,658-line self-contained client component with its own
 * inline palette, a large inline <style> block, and seven hand-rolled SVG
 * icons.
 *
 * Two calculators sit in the middle of the page, both on warm bone worksheet
 * panels so the parts you work in read differently from the parts you read.
 * AreaCalculator answers "how much floor can I heat", InstallationEconomics
 * answers "what does that cost to install". Both carry their arithmetic across
 * untouched; see their header comments for the formulas.
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
      <InstallationEconomics />
      <SystemComparison />
      <MeasuringUpCTA />
    </main>
  );
}
