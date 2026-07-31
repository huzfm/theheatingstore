'use client';

import '@/components/sections/WhyChooseUs/styles/global.css';
import Hero from '@/components/sections/WhyChooseUs/sections/Hero';
import Stats from '@/components/sections/WhyChooseUs/sections/Stats';
import ReliabilityGlobal from '@/components/sections/WhyChooseUs/sections/ReliabilityGlobal';
import Process from '@/components/sections/WhyChooseUs/sections/Process';
import Brands from '@/components/sections/WhyChooseUs/sections/Brands';
import Testimonials from '@/components/sections/WhyChooseUs/sections/Testimonials';
import Cta from '@/components/sections/WhyChooseUs/sections/Cta';
import Marquee from '@/components/sections/WhyChooseUs/sections/Marquee';

export default function WhyChooseUsClient() {
	return (
		<section className='whc-root'>
			{/* atmospheric field */}
			<div aria-hidden className='whc-aura'>
				<span className='whc-orb whc-orb-1' />
				<span className='whc-orb whc-orb-2' />
				<span className='whc-orb whc-orb-3' />
			</div>
			<div aria-hidden className='whc-vignette' />

			{/* ═══ §1 HERO ═══ */}
			<Hero />

			{/* ═══ stat grid ═══ */}
			<Stats />

{/* ═══ §3 PROCESS ═══ */}
			<Process />

			{/* ═══ §4 BRANDS ═══ */}
			<Brands />


{/* ═══ §5 TESTIMONIALS ═══ */}
			<Testimonials />


			{/* ═══ §2 RELIABILITY + GLOBAL ═══ */}
			<ReliabilityGlobal />

			

			

			
			{/* ═══ §6 CTA ═══ */}
			<Cta />

			{/* ═══ MARQUEE ═══ */}
			<Marquee />
		</section>
	);
}
