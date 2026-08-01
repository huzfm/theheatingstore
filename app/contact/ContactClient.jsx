'use client';

import './contact.css';
import Hero from './components/Hero';
import ContactMethods from './components/ContactMethods';
import ConsultationForm from './components/ConsultationForm';
import RegionalCoverage from './components/RegionalCoverage';
import ShowroomSection from './components/ShowroomSection';
import TrustStrip from './components/TrustStrip';
import FinalCta from './components/FinalCta';

export default function ContactPage() {
	return (
		<section className='ct-root brand-section'>
			{/* atmospheric field */}
			<div aria-hidden className='ct-aura'>
				<span className='ct-orb ct-orb-1' />
				<span className='ct-orb ct-orb-2' />
				<span className='ct-orb ct-orb-3' />
			</div>
			<div aria-hidden className='ct-vignette' />

			{/* ═══ 01 HERO ═══ */}
			<Hero />

			{/* ═══ 02 CONTACT METHODS ═══ */}
			<ContactMethods />

			{/* ═══ 03 CONSULTATION / PROJECT INTAKE ═══ */}
			<ConsultationForm />

			{/* ═══ 04 REGIONAL COVERAGE ═══ */}
			<RegionalCoverage />

			{/* ═══ 05 SHOWROOM / LOCATION ═══ */}
			<ShowroomSection />

			{/* ═══ 06 TRUST / RESPONSE SIGNAL ═══ */}
			<TrustStrip />

			{/* ═══ 07 FINAL CTA ═══ */}
			<FinalCta />
		</section>
	);
}
