'use client';

import './certifications.css';
import Hero from './components/Hero';
import PartnerStrip from './components/PartnerStrip';
import ComplianceSystem from './components/ComplianceSystem';
import StandardsTimeline from './components/StandardsTimeline';
import WaterSystems from './components/WaterSystems';
import SafetySequence from './components/SafetySequence';
import Warranty from './components/Warranty';
import TrackRecord from './components/TrackRecord';
import ProjectIntelligence from './components/ProjectIntelligence';
import KashmirExpertise from './components/KashmirExpertise';
import SupportCTA from './components/SupportCTA';

export default function CertificationsClient() {
	return (
		<>
			<Hero />
			<PartnerStrip />
			<ComplianceSystem />
			<StandardsTimeline />
			<WaterSystems />
			<SafetySequence />
			<Warranty />
			<TrackRecord />
			<ProjectIntelligence />
			<KashmirExpertise />
			<SupportCTA />
		</>
	);
}
