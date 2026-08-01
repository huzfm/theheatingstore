'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { LOCATIONS, PROJECT_TYPES, FLOORING_TYPES, PHONE_DISPLAY, PHONE_TEL } from '../data';
import { Reveal, SectionKicker, MagneticAnchor } from './ui';
import { useIsDesktop } from '../hooks';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host' : 'http://localhost:5050';

const INITIAL = { name: '', phone: '', location: '', projectType: '', area: '', flooringType: '', message: '' };

function Field({ label, children, span }) {
	return (
		<div className={`ct-field${span ? ' ct-field--wide' : ''}`}>
			<label className='ct-field-label'>{label}</label>
			{children}
		</div>
	);
}

export default function ConsultationForm() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const pointerFxDisabled = !isDesktop || reduced;

	const [form, setForm] = useState(INITIAL);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.phone.length < 8) {
			setError('Please enter a valid phone number');
			return;
		}
		setLoading(true);
		setError('');

		// Project specifics are folded into the message body so the intake is
		// captured in full even though the backend's lead schema only reads
		// name / phone / message / source / location.
		const details = [
			form.projectType && `Project type: ${form.projectType}`,
			form.area && `Approx. area: ${form.area}`,
			form.flooringType && `Flooring: ${form.flooringType}`,
			form.message && `Notes: ${form.message}`,
		]
			.filter(Boolean)
			.join('\n');

		try {
			const res = await fetch(`${API_URL}/api/leads`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					phone: form.phone,
					message: details,
					source: 'Contact Form',
					location: LOCATIONS.includes(form.location) ? form.location : 'Unknown',
				}),
			});
			if (!res.ok) throw new Error();
			setSuccess(true);
			setForm(INITIAL);
		} catch {
			setError('Failed to submit. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section id='consultation' className='ct-section' aria-labelledby='consultation-heading'>
			<div className='ct-consultation-grid'>
				{/* LEFT — framing copy */}
				<Reveal amount={0.25}>
					<SectionKicker index='03' label='Project Intake' />
					<h2 id='consultation-heading' className='brand-h ct-h--section'>
						Tell us about <span className='brand-h-accent'>your project.</span>
					</h2>
					<p className='brand-sub' style={{ marginTop: 18, maxWidth: 440 }}>
						A few details on your space let our engineers give you a genuinely useful first answer, not a generic quote. Every enquiry is reviewed personally by our installation team.
					</p>

					<ul className='ct-consultation-points'>
						<li>
							<span className='ct-consultation-points-num'>01</span>
							Reviewed by a certified engineer, not a call centre
						</li>
						<li>
							<span className='ct-consultation-points-num'>02</span>
							Response within 24 hours, most enquiries sooner
						</li>
						<li>
							<span className='ct-consultation-points-num'>03</span>
							No obligation, a written scope before any commitment
						</li>
					</ul>

					<div className='ct-consultation-alt'>
						Prefer to talk now?{' '}
						<MagneticAnchor href={`tel:${PHONE_TEL}`} className='ct-link' disabled={pointerFxDisabled}>
							Call {PHONE_DISPLAY}
						</MagneticAnchor>
					</div>
				</Reveal>

				{/* RIGHT — the form itself */}
				<Reveal amount={0.2} delay={0.1}>
					<form onSubmit={handleSubmit} className='ct-form' noValidate>
						<div className='ct-form-row'>
							<Field label='Full Name'>
								<input name='name' type='text' value={form.name} onChange={handleChange} required placeholder=' ' className='ct-input' autoComplete='name' />
							</Field>
							<Field label='Phone / WhatsApp'>
								<input name='phone' type='tel' value={form.phone} onChange={handleChange} required placeholder=' ' className='ct-input' autoComplete='tel' />
							</Field>
						</div>

						<div className='ct-form-row'>
							<Field label='Project Location'>
								<div className='ct-select-wrap'>
									<select name='location' value={form.location} onChange={handleChange} required className='ct-input ct-select'>
										<option value=''>Select city</option>
										{LOCATIONS.map((loc) => (
											<option key={loc} value={loc}>
												{loc}
											</option>
										))}
									</select>
									<svg className='ct-select-caret' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
										<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
									</svg>
								</div>
							</Field>
							<Field label='Project Type'>
								<div className='ct-select-wrap'>
									<select name='projectType' value={form.projectType} onChange={handleChange} className='ct-input ct-select'>
										<option value=''>Select type</option>
										{PROJECT_TYPES.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
									<svg className='ct-select-caret' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
										<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
									</svg>
								</div>
							</Field>
						</div>

						<div className='ct-form-row'>
							<Field label='Approximate Area (sq ft)'>
								<input name='area' type='text' inputMode='numeric' value={form.area} onChange={handleChange} placeholder=' ' className='ct-input' />
							</Field>
							<Field label='Flooring Type'>
								<div className='ct-select-wrap'>
									<select name='flooringType' value={form.flooringType} onChange={handleChange} className='ct-input ct-select'>
										<option value=''>Select flooring</option>
										{FLOORING_TYPES.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
									<svg className='ct-select-caret' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
										<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
									</svg>
								</div>
							</Field>
						</div>

						<Field label='Project Details (optional)' span>
							<textarea name='message' value={form.message} onChange={handleChange} rows={3} placeholder=' ' className='ct-input ct-textarea' />
						</Field>

						{error && <p className='ct-form-error'>{error}</p>}
						{success && (
							<motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className='ct-form-success'>
								<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
									<polyline points='20 6 9 17 4 12' />
								</svg>
								<p>Request submitted. We&rsquo;ll reach out shortly.</p>
							</motion.div>
						)}

						<button type='submit' disabled={loading || success} className='ct-form-submit'>
							{success ? 'Submitted' : loading ? 'Submitting…' : 'Start Your Consultation'}
						</button>
					</form>
				</Reveal>
			</div>
		</section>
	);
}
