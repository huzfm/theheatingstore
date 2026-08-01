'use client';

import './local-experience.css';
import Hero from './components/Hero';
import ProofRail from './components/ProofRail';
import Differentiation from './components/Differentiation';
import TechnologyBrands from './components/TechnologyBrands';
import KashmirEngineering from './components/KashmirEngineering';
import ServiceNetwork from './components/ServiceNetwork';
import FaqSection from './components/FaqSection';
import FinalCta from './components/FinalCta';

export default function LocalExperienceClient() {
	return (
		<main className='le-root w-full'>
			<div aria-hidden className='le-aura'>
				<span className='le-orb le-orb-1' />
				<span className='le-orb le-orb-2' />
				<span className='le-orb le-orb-3' />
			</div>

			<Hero />
			<ProofRail />
			<Differentiation />
			<TechnologyBrands />
			<KashmirEngineering />
			<ServiceNetwork />
			<FaqSection />
			<FinalCta />
		</main>
	);
}
