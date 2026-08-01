'use client';

import './how-it-works.css';
import Hero from './components/Hero';
import Overview from './components/Overview';
import Journey from './components/Journey';
import TechnicalPrecision from './components/TechnicalPrecision';
import CustomerExperience from './components/CustomerExperience';
import TrustProof from './components/TrustProof';
import HowItWorksCTA from './components/HowItWorksCTA';

export default function HowItWorksClient() {
	return (
		<>
			<Hero />
			<Overview />
			<Journey />
			<TechnicalPrecision />
			<CustomerExperience />
			<TrustProof />
			<HowItWorksCTA />
		</>
	);
}
