'use client';

import WorkingHero from '@/components/sections/Working/WorkingHero';
import FloorRevealSection from '@/components/sections/FloorRevealSection';
import HeatPhysics from '@/components/sections/Working/HeatPhysics';
import ControlSection from '@/components/sections/Working/ControlSection';
import SpecStrip from '@/components/sections/Working/SpecStrip';
import WorkingCTA from '@/components/sections/Working/WorkingCTA';

/**
 * /working, the "how the heat actually works" route.
 *
 * Ordered as an argument rather than a feature list: state the premise, show
 * the stack, explain why it's stacked that way, show how it's controlled, then
 * put numbers to it and ask for the site visit. Questions are deliberately not
 * answered here, the sectioned FAQ on the home page already carries them.
 *
 * Two sections are shared rather than reimplemented:
 *  - FloorRevealSection is the scroll-driven 3D cutaway. It lazy-loads three.js
 *    itself and parks its render loop when off-screen, so it costs this route
 *    nothing until it's scrolled to. This is now its only home, it used to run
 *    on the home page too, which is why it lives in components/sections rather
 *    than under this route.
 *  - ThermostatDial (inside ControlSection) is the same SVG instrument that
 *    opens /about. Here it drives the copy beside it instead of standing alone.
 *
 * /how-it-works is untouched and still covers the installation process, this
 * page is the physics, that one is the procedure.
 */
export default function WorkingClient() {
  return (
    <main className="bg-ink-950">
      <WorkingHero />
      <FloorRevealSection />
      <HeatPhysics />
      <ControlSection />
      <SpecStrip />
      <WorkingCTA />
    </main>
  );
}
