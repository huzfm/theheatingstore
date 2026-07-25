'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

// ── Framer variants, same easing as About section ───────────────────────────
const container = {
	hidden: {},
	show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariant = {
	hidden: { opacity: 0, y: 32 },
	show: (i) => ({
		opacity: 1, y: 0,
		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
	}),
};

// ── YouTube embed helper ──────────────────────────────────────────────────────
function getYoutubeEmbed(url) {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/shorts\/([^&\n?#]+)/,
	];
	for (const r of patterns) {
		const m = url?.match(r);
		if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&modestbranding=1`;
	}
	return null;
}

// ── Video Popup ───────────────────────────────────────────────────────────────
function VideoPopup({ video, onClose }) {
	const embedUrl = getYoutubeEmbed(video.videoUrl);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		const onKey = (e) => { if (e.key === 'Escape') onClose(); };
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKey);
		};
	}, []);

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className='fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-10'
				style={{ background: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(12px)' }}
				onClick={onClose}>

				<motion.div
					initial={{ opacity: 0, scale: 0.94, y: 16 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.96, y: 8 }}
					transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
					className='w-full max-w-3xl'
					onClick={e => e.stopPropagation()}>

					{/* Header */}
					<div className='flex items-start justify-between mb-4 px-1'>
						<div className='flex-1 min-w-0 pr-4'>
							<h3
								className='font-serif font-semibold text-lg leading-snug line-clamp-2'
								style={{ color: '#FFF4E8' }}>
								{video.title}
							</h3>
							{video.description && (
								<p className='text-xs mt-1 font-medium' style={{ color: 'rgba(255,244,232,0.45)' }}>
									{video.description}
								</p>
							)}
						</div>
						<button
							onClick={onClose}
							className='w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0 mt-0.5'
							style={{
								border: '1px solid rgba(245,185,122,0.25)',
								background: 'rgba(245,185,122,0.08)',
								color: 'rgba(255,244,232,0.6)',
							}}>
							<X size={16} />
						</button>
					</div>

					{/* Video */}
					<div
						className='w-full rounded-[24px] overflow-hidden'
						style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,185,122,0.12)' }}>
						{embedUrl ? (
							<div className='relative w-full bg-black' style={{ paddingBottom: '56.25%' }}>
								<iframe
									src={embedUrl}
									className='absolute inset-0 w-full h-full'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
									allowFullScreen
									title={video.title}
									style={{ border: 'none' }}
								/>
							</div>
						) : (
							<div className='relative bg-black' style={{ paddingBottom: '56.25%' }}>
								{video.thumbnailUrl && (
									<Image src={video.thumbnailUrl} alt={video.title} fill className='object-cover opacity-40' sizes="100vw" />
								)}
								<div className='absolute inset-0 flex flex-col items-center justify-center gap-5'>
									<a
										href={video.videoUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-white text-sm transition-all hover:scale-105'
										style={{ background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)', boxShadow: '0 16px 40px rgba(184,107,69,0.5)' }}>
										<Play size={16} className='fill-white' />
										Watch on {video.platform === 'instagram' ? 'Instagram' : 'Facebook'}
									</a>
									<p style={{ color: 'rgba(255,244,232,0.3)', fontSize: 11 }}>Opens in a new tab</p>
								</div>
							</div>
						)}
					</div>

					<p className='text-center text-xs mt-3' style={{ color: 'rgba(255,244,232,0.25)' }}>
						Press Esc or click outside to close
					</p>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VideoGallery() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeVideo, setActiveVideo] = useState(null);
	const [activeCategory, setActiveCategory] = useState('All');
	const prevIdsRef = useRef(null);
	const reduce = useReducedMotion();

	// ── Real-time fetch, every 2 seconds ────────────────────────────────────
	const fetchVideos = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/api/videos/public`, { cache: 'no-store' });
			if (!res.ok) return;
			const data = await res.json();
			const incoming = Array.isArray(data) ? data : [];

			// Only update state if something actually changed
			const newIds = incoming.map(v => `${v._id}-${v.published}-${v.updatedAt}`).join(',');
			if (newIds !== prevIdsRef.current) {
				prevIdsRef.current = newIds;
				setVideos(incoming);
			}
		} catch { }
		finally { setLoading(false); }
	}, []);

	useEffect(() => {
		fetchVideos();
	}, [fetchVideos]);

	const categories = ['All', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];
	const filtered = activeCategory === 'All' ? videos : videos.filter(v => v.category === activeCategory);

	if (loading) return (
		<section style={{
			background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
			padding: '96px 24px',
		}}>
			<div className='flex items-center justify-center'>
				<div className='w-8 h-8 rounded-full border-2 animate-spin' style={{ borderColor: '#FFD6A6', borderTopColor: '#B86B45' }} />
			</div>
		</section>
	);

	if (!videos.length) return null;

	return (
		<section
			className='relative isolate overflow-hidden'
			style={{
				backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
			}}>

			{/* Same heat glow as About */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { opacity: [0.2, 0.35, 0.2] }}
				transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
				className='absolute inset-0 pointer-events-none'
				style={{
					background: 'radial-gradient(60% 40% at 50% 0%, rgba(245,185,122,0.3), transparent 70%)',
				}}
			/>

			{/* Noise grain */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{ backgroundImage: "url('/noise.png')", opacity: 0.02 }}
			/>

			{/* Video Popup */}
			{activeVideo && (
				<VideoPopup video={activeVideo} onClose={() => setActiveVideo(null)} />
			)}

			<div className='relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32'>

				{/* ── Section Header, same style as About ── */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='text-center mb-16'>

					{/* Pill badge, same as About */}
					<motion.div variants={fadeUp} className='inline-flex justify-center mb-6'>
						<p className='
							relative inline-flex items-center
							whitespace-nowrap
							px-6 py-2 sm:px-7 sm:py-2.5
							text-[10px] sm:text-[11px] font-medium uppercase
							tracking-[0.28em] sm:tracking-[0.45em]
							text-[#4FA3D1]
							rounded-full
							bg-[rgba(255,255,255,0.22)]
							backdrop-blur-xl
							border border-white/30
							shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_rgba(15,23,42,0.22)]
						'>
						Customer Reviews & Installations
						</p>
					</motion.div>

					<motion.h2
						variants={fadeUp}
						className='font-serif font-semibold leading-tight'
						style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: '#3C2A25' }}>
						{/* Watch How It Works */}Real Installations.
						<br />
						<span className='font-light' style={{ color: '#B86B45' }}>
							{/* Step-by-Step Video Guides */}Real Results.
						</span>
					</motion.h2>

					<motion.p
						variants={fadeUp}
						className='mt-5 mx-auto max-w-xl text-base leading-relaxed'
						style={{ color: '#3C2B27' }}>
						Explore videos shared by our customers and installation teams, showcasing the comfort, craftsmanship, and performance of Electric Hammam systems in everyday homes.
					</motion.p>

					{/* Category tabs */}
					{categories.length > 2 && (
						<motion.div variants={fadeUp} className='flex items-center justify-center gap-2 mt-8 flex-wrap'>
							{categories.map(cat => (
								<button
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className='px-5 py-2 rounded-full text-sm font-medium transition-all duration-200'
									style={activeCategory === cat
										? {
											background: 'linear-gradient(135deg, #B86B45, #C8744D)',
											color: '#fff',
											boxShadow: '0 4px 16px rgba(184,107,69,0.35)',
										}
										: {
											background: 'rgba(255,255,255,0.55)',
											color: '#4A342E',
											border: '1px solid rgba(255,214,166,0.6)',
											backdropFilter: 'blur(8px)',
										}}>
									{cat}
								</button>
							))}
						</motion.div>
					)}
				</motion.div>

				{/* ── Video Grid ── */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7'>
					{filtered.map((video, i) => (
						<motion.div
							key={video._id}
							custom={i}
							variants={cardVariant}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true }}
							onClick={() => setActiveVideo(video)}
							className='group cursor-pointer'>

							<div
								className='rounded-[24px] overflow-hidden transition-all duration-500 group-hover:-translate-y-2'
								style={{
									background: '#FFF8F0',
									boxShadow: '0 8px 32px rgba(60,42,37,0.1), 0 2px 8px rgba(60,42,37,0.06)',
									border: '1px solid rgba(255,214,166,0.4)',
								}}>

								{/* Thumbnail */}
								<div className='relative overflow-hidden' style={{ paddingBottom: '56.25%' }}>
									{video.thumbnailUrl ? (
										<Image
											src={video.thumbnailUrl}
											alt={video.title}
											fill
											className='object-cover transition-transform duration-700 group-hover:scale-105'
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										/>
									) : (
										<div
											className='absolute inset-0 flex items-center justify-center'
											style={{ background: 'linear-gradient(135deg, #3C2A25, #4A342E)' }}>
											<Play size={32} style={{ color: 'rgba(245,185,122,0.4)' }} />
										</div>
									)}

									{/* Hover overlay */}
									<div
										className='absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100'
										style={{ background: 'rgba(60,42,37,0.45)' }}>
										<div
											className='w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 scale-75 group-hover:scale-100'
											style={{
												background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
												boxShadow: '0 12px 40px rgba(184,107,69,0.6)',
											}}>
											<Play size={22} className='text-white fill-white ml-1' />
										</div>
									</div>
								</div>

								{/* Card Info */}
								<div className='p-5'>
									<h3
										className='font-serif font-semibold text-sm leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#B86B45]'
										style={{ color: '#3C2A25' }}>
										{video.title}
									</h3>
									{video.description && (
										<p className='text-xs mt-2 leading-relaxed line-clamp-2' style={{ color: '#6B4A2D' }}>
											{video.description}
										</p>
									)}
									<div className='flex items-center justify-between mt-4'>
										{video.category && (
											<span
												className='text-[10px] font-medium px-3 py-1 rounded-full'
												style={{
													background: 'rgba(184,107,69,0.1)',
													color: '#B86B45',
													border: '1px solid rgba(184,107,69,0.2)',
												}}>
												{video.category}
											</span>
										)}
										<span
											className='flex items-center gap-1.5 text-[11px] font-semibold ml-auto transition-colors group-hover:text-[#B86B45]'
											style={{ color: '#C8744D' }}>
											<Play size={9} className='fill-current' /> Watch Now
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}