'use client';

import '@/components/sections/GlobalExperience/styles/global.css';
import Hero from '@/components/sections/GlobalExperience/sections/Hero';
import GlobalFootprint from '@/components/sections/GlobalExperience/sections/GlobalFootprint';
import InstallationTimeline from '@/components/sections/GlobalExperience/sections/InstallationTimeline';
import TechnologySection from '@/components/sections/GlobalExperience/sections/TechnologySection';
import PartnerShowcase from '@/components/sections/GlobalExperience/sections/PartnerShowcase';
import ProjectsPortfolio from '@/components/sections/GlobalExperience/sections/ProjectsPortfolio';
import WarrantySection from '@/components/sections/GlobalExperience/sections/WarrantySection';
import FAQSection from '@/components/sections/GlobalExperience/sections/FAQSection';

export default function GlobalExperienceClient() {
	return (
		<main className='ge-root w-full'>
			<Hero />
			<GlobalFootprint />
			<InstallationTimeline />
			<TechnologySection />
			<PartnerShowcase />
			<ProjectsPortfolio />
			<WarrantySection />
			<FAQSection />
		</main>
	);
}
