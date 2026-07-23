import FoundationDemo from './FoundationDemo';

/**
 * Phase 1 proof page.
 *
 * Deliberately thin — it will be replaced section by section as Phases 2-8
 * land (Hero, FloorReveal, Configurator, …). For now it renders a single
 * client component that exercises every foundation primitive so each one can
 * be verified in the browser before any 3D work starts.
 */
export default function ExperiencePage() {
  return <FoundationDemo />;
}
