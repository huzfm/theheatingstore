'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host'
  : 'http://localhost:5050';

const COLORS = ['#C4623A', '#E88C2A', '#8B3A2A'];

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function StatCard({ label, value, sub, color }) {
	return (
		<div style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 22, padding: '28px 24px', boxShadow: '0 8px 32px rgba(60,42,37,0.07)' }}>
			<p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4A2D', marginBottom: 12 }}>{label}</p>
			<p style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: color, lineHeight: 1, marginBottom: 6 }}>{value}</p>
			<p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D', lineHeight: 1.5 }}>{sub}</p>
		</div>
	);
}

function CustomTooltip({ active, payload }) {
	if (active && payload && payload.length) {
		return (
			<div style={{ background: 'rgba(20,10,8,0.92)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '10px 16px', border: '1px solid rgba(245,185,122,0.3)' }}>
				<p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: '#F5B97A' }}>{payload[0].payload.name}</p>
				<p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{payload[0].value} selections</p>
			</div>
		);
	}
	return null;
}

export default function AdminDashboard() {
	const [sizes, setSizes] = useState([
		{ name: '50 sq ft', value: 0, color: COLORS[0] },
		{ name: '70 sq ft', value: 0, color: COLORS[1] },
		{ name: '80 sq ft', value: 0, color: COLORS[2] },
	]);
	const [total, setTotal] = useState(0);
	const [leads, setLeads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState(null);

	const fetchData = async () => {
		try {
			const res = await fetch(`${API_URL}/api/analytics/sizes`, { cache: 'no-store' });
			if (res.ok) {
				const data = await res.json();
				const updated = sizes.map((s) => ({
					...s,
					value: data[s.name] || 0,
				}));
				setSizes(updated);
				setTotal(updated.reduce((acc, s) => acc + s.value, 0));
			}
		} catch {
			// Use seeded demo data if API unavailable
			const demo = [
				{ name: '50 sq ft', value: 34, color: COLORS[0] },
				{ name: '70 sq ft', value: 52, color: COLORS[1] },
				{ name: '80 sq ft', value: 28, color: COLORS[2] },
			];
			setSizes(demo);
			setTotal(114);
		}
		setLastUpdated(new Date());
	};

	const fetchLeads = async () => {
		try {
			const res = await fetch(`${API_URL}/api/leads`, { cache: 'no-store' });
			if (res.ok) {
				const data = await res.json();
				setLeads(Array.isArray(data) ? data.slice(0, 10) : []);
			}
		} catch {
			setLeads([]);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
		fetchLeads();
		const interval = setInterval(fetchData, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<style>{`
				.adm-page { min-height: 100vh; background: linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 50%,#FFE8D0 100%); font-family: var(--font-body); }
				.adm-card { background: rgba(255,255,255,0.80); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.5); border-radius: 22px; box-shadow: 0 12px 48px rgba(60,42,37,0.10); }
				.adm-badge { display: inline-block; padding: 3px 10px; border-radius: 999; font-size: 9px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; }
				.adm-content { max-width: 1280px; margin: 0 auto; padding: 40px 40px 80px; }
				.adm-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16; margin-bottom: 40px; }
				.adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
				.adm-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
				@media (max-width: 1024px) { .adm-grid { grid-template-columns: 1fr; } .adm-grid-3 { grid-template-columns: 1fr 1fr; } }
				@media (max-width: 768px) { .adm-content { padding: 24px 20px 80px; } .adm-grid-3 { grid-template-columns: 1fr; } }
				@keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
			`}</style>

			<div className='adm-page'>
				<div className='adm-content'>
					{/* Header */}
					<div className='adm-header'>
						<div>
							<h1 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#2C1810', margin: 0, lineHeight: 1.1 }}>
								Installation Analytics
							</h1>
							<p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D', marginTop: 6 }}>
								The Heating Store · Demand Insights
								{lastUpdated && <span style={{ color: '#4FA3D1', marginLeft: 12 }}>Updated {lastUpdated.toLocaleTimeString()}</span>}
							</p>
						</div>
						<button
							onClick={fetchData}
							style={{ padding: '10px 20px', borderRadius: 999, border: '1px solid rgba(184,107,69,0.3)', background: 'rgba(255,255,255,0.7)', fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#8B3A2A', cursor: 'pointer' }}>
							Refresh Data
						</button>
					</div>

					{/* Stat cards */}
					<div className='adm-grid-3' style={{ marginBottom: 28 }}>
						<StatCard label='Total Size Selections' value={total} sub='All time across all presets' color='#B86B45' />
						<StatCard label='Most Popular Size' value={sizes.reduce((a, b) => a.value > b.value ? a : b, sizes[0]).name} sub='Highest demand segment' color='#8B3A2A' />
						<StatCard label='Data Points' value={sizes.length} sub='Size categories tracked' color='#E88C2A' />
					</div>

					<div className='adm-grid'>
						{/* Bar Chart */}
						<motion.div variants={fadeUp} initial='hidden' animate='show' className='adm-card' style={{ padding: '28px 28px 20px' }}>
							<h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: '#2C1810', marginBottom: 4 }}>Size Demand Distribution</h3>
							<p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D', marginBottom: 24 }}>Number of times each preset was selected in the cost calculator</p>
							<div style={{ height: 280 }}>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={sizes} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
										<XAxis dataKey='name' tick={{ fontFamily: "var(--font-body)", fontSize: 12, fill: '#6B4A2D' }} axisLine={false} tickLine={false} />
										<YAxis tick={{ fontFamily: "var(--font-body)", fontSize: 11, fill: '#6B4A2D' }} axisLine={false} tickLine={false} />
										<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(184,107,69,0.06)' }} />
										<Bar dataKey='value' radius={[8, 8, 0, 0]} maxBarSize={80}>
											{sizes.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</motion.div>

						{/* Pie Chart */}
						<motion.div variants={fadeUp} initial='hidden' animate='show' transition={{ delay: 0.1 }} className='adm-card' style={{ padding: '28px 28px 20px' }}>
							<h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: '#2C1810', marginBottom: 4 }}>Market Share by Size</h3>
							<p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D', marginBottom: 24 }}>Percentage breakdown of size selections</p>
							<div style={{ height: 280 }}>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie data={sizes} cx='50%' cy='50%' innerRadius={60} outerRadius={100} paddingAngle={4} dataKey='value'>
											{sizes.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip content={<CustomTooltip />} />
									</PieChart>
								</ResponsiveContainer>
							</div>
							{/* Legend */}
							<div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
								{sizes.map((s) => (
									<div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
										<span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
										<span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: '#6B4A2D' }}>
											{s.name} — {total > 0 ? Math.round((s.value / total) * 100) : 0}%
										</span>
									</div>
								))}
							</div>
						</motion.div>
					</div>

					{/* Recent Leads */}
					<motion.div variants={fadeUp} initial='hidden' animate='show' transition={{ delay: 0.2 }} className='adm-card' style={{ padding: '28px', marginTop: 24 }}>
						<h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: '#2C1810', marginBottom: 20 }}>Recent Installation Inquiries</h3>
						{loading ? (
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0' }}>
								<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B86B45', animation: 'adm-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
								<span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D' }}>Loading inquiries...</span>
							</div>
						) : leads.length === 0 ? (
							<div style={{ padding: '20px 0', textAlign: 'center' }}>
								<p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D' }}>No leads data available. Connect to the backend API to track inquiries.</p>
							</div>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ borderBottom: '1px solid rgba(184,107,69,0.12)' }}>
											{['Name', 'Phone', 'Location', 'Source', 'Date'].map((h) => (
												<th key={h} style={{ padding: '10px 12px', fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B4A2D', textAlign: 'left' }}>{h}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{leads.map((lead, i) => (
											<tr key={i} style={{ borderBottom: '1px solid rgba(184,107,69,0.06)' }}>
												<td style={{ padding: '12px 12px', fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: '#2C1810' }}>{lead.name || '—'}</td>
												<td style={{ padding: '12px 12px', fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D' }}>{lead.phone || '—'}</td>
												<td style={{ padding: '12px 12px', fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D' }}>{lead.location || '—'}</td>
												<td style={{ padding: '12px 12px' }}>
													<span className='adm-badge' style={{ background: 'rgba(79,163,209,0.12)', color: '#4FA3D1' }}>{lead.source || 'Form'}</span>
												</td>
												<td style={{ padding: '12px 12px', fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D' }}>
													{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</motion.div>

					{/* Footer note */}
					<div style={{ marginTop: 24, textAlign: 'center' }}>
						<p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: '#6B4A2D', opacity: 0.6 }}>
							Data auto-refreshes every 30 seconds. Analytics tracked from the Project Cost Calculator presets.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
