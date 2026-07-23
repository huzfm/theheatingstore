'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `You are the helpful assistant for Electric Hamam, a premium underfloor heating (hamam) installation company serving Kashmir — specifically Srinagar, Anantnag, and Baramulla.

Your job is to help potential customers understand:
What Electric Hamam is (underfloor radiant heating system)
How installation works and what it involves
Pricing guidance (give ranges, not exact — final quote needs site visit)
Which areas/cities we serve
How to book a consultation or site visit
Benefits over traditional heating methods (bukhari, room heaters)
Installation timeline (typically 1–2 days per room)
Warranty and after-sales support
Suitable room types (bathroom, bedroom, living room, hall, etc.)
Flooring compatibility (tile, stone, concrete best; wooden possible with correct system)
Key facts:
We serve: Srinagar, Anantnag, Baramulla and surrounding areas
Installation is professional and non-invasive
System goes beneath the flooring — no visible pipes or radiators
Ideal for Kashmiri winters — consistent, even warmth
Free site survey available — customer just needs to fill the contact form or WhatsApp us

Be warm, helpful, concise, and professional. Speak like a knowledgeable local expert. Answer in the same language the user writes in — if they write in English, respond in English; if they mix Urdu/Hindi, you can mix too. Keep responses short — 2–4 sentences max unless a detailed question is asked. Never make up specific prices. If unsure about something technical, direct them to contact us.`;

export default function AIChatbot() {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(true);
	const bottomRef = useRef(null);
	const inputRef = useRef(null);

	const SUGGESTIONS = [
		'What is Electric Hamam?',
		'How much does installation cost?',
		'Which areas do you serve?',
		'How long does installation take?',
	];

	useEffect(() => {
		if (open && messages.length === 0) {
			setMessages([{
				role: 'assistant',
				content: "Assalam o Alaikum! 👋 I'm here to help with any questions about Electric Hamam installation. What would you like to know?",
			}]);
		}
	}, [open]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	useEffect(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 300);
	}, [open]);

	const sendMessage = async (text) => {
		const userText = text || input.trim();
		if (!userText || loading) return;

		setInput('');
		setShowSuggestions(false);
		const newMessages = [...messages, { role: 'user', content: userText }];
		setMessages(newMessages);
		setLoading(true);

		try {
			const res = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens: 1000,
					system: SYSTEM_PROMPT,
					messages: newMessages.map(m => ({ role: m.role, content: m.content })),
				}),
			});

			const data = await res.json();
			const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";
			setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
		} catch {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Sorry, I\'m having trouble connecting. Please WhatsApp us directly at +91 9070907035.',
			}]);
		} finally {
			setLoading(false);
		}
	};

	const handleKey = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
	};

	return (
		<>
			{/* ── Chat Window ── */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.92, y: 16 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.92, y: 16 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className="fixed z-50 w-[calc(100vw-2rem)] max-w-[370px] flex flex-col rounded-3xl overflow-hidden lg:bottom-28 lg:right-8 lg:w-auto lg:max-w-none"
						style={{
							boxShadow: '0 32px 80px rgba(60,42,37,0.25), 0 0 0 1px rgba(184,107,69,0.12)',
							background: '#FEFCF9',
							maxHeight: 'min(580px, calc(100vh - 120px))',
							bottom: 'calc(64px + 16px + 48px + 12px + env(safe-area-inset-bottom))',
							right: '1rem',
						}}>

						{/* Header */}
						<div className="px-5 py-4 flex items-center gap-3 shrink-0"
							style={{ background: 'linear-gradient(135deg, #3C2A25, #5C3D2E)' }}>
							<div className="relative">
								<div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
									style={{ background: 'linear-gradient(135deg, #B86B45, #D4854F)' }}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 2C6.48 2 2 6.02 2 11c0 2.29.87 4.38 2.28 5.98L3 21l4.27-1.36A9.9 9.9 0 0012 20c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
										<path d="M8 10h8M8 14h5"/>
									</svg>
								</div>
								<span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#3C2A25]" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-white font-bold text-sm tracking-tight">Hammam Assistant</p>
								<p className="text-[#D4A06A] text-[11px] font-medium">Electric Hamam · Online</p>
							</div>
							<button onClick={() => setOpen(false)}
								className="w-8 h-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition shrink-0">
								<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
							style={{ background: 'linear-gradient(180deg, #FEFCF9 0%, #FFF8F2 100%)' }}>

							{messages.map((msg, i) => (
								<motion.div key={i}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.25 }}
									className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
									{msg.role === 'assistant' && (
										<div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mr-2 mt-0.5"
											style={{ background: 'linear-gradient(135deg, #B86B45, #D4854F)' }}>
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
												<path d="M12 2C6.48 2 2 6.02 2 11c0 2.29.87 4.38 2.28 5.98L3 21l4.27-1.36A9.9 9.9 0 0012 20c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
											</svg>
										</div>
									)}
									<div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
										msg.role === 'user'
											? 'text-white rounded-br-sm'
											: 'text-[#3C2A25] rounded-bl-sm'
									}`}
										style={msg.role === 'user'
											? { background: 'linear-gradient(135deg, #B86B45, #C97A50)', boxShadow: '0 4px 12px rgba(184,107,69,0.25)' }
											: { background: 'white', border: '1px solid rgba(184,107,69,0.12)', boxShadow: '0 2px 8px rgba(60,42,37,0.06)' }}>
										{msg.content}
									</div>
								</motion.div>
							))}

							{/* Typing indicator */}
							{loading && (
								<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
									<div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mr-2"
										style={{ background: 'linear-gradient(135deg, #B86B45, #D4854F)' }}>
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
											<path d="M12 2C6.48 2 2 6.02 2 11c0 2.29.87 4.38 2.28 5.98L3 21l4.27-1.36A9.9 9.9 0 0012 20c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
										</svg>
									</div>
									<div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border"
										style={{ border: '1px solid rgba(184,107,69,0.12)', boxShadow: '0 2px 8px rgba(60,42,37,0.06)' }}>
										<div className="flex items-center gap-1.5">
											{[0, 0.2, 0.4].map(d => (
												<motion.div key={d} className="w-1.5 h-1.5 rounded-full"
													style={{ background: '#B86B45' }}
													animate={{ y: [-2, 2, -2] }}
													transition={{ duration: 0.8, repeat: Infinity, delay: d }} />
											))}
										</div>
									</div>
								</motion.div>
							)}

							{/* Suggestion chips */}
							{showSuggestions && messages.length === 1 && !loading && (
								<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
									className="flex flex-wrap gap-2 pt-1">
									{SUGGESTIONS.map(s => (
										<button key={s} onClick={() => sendMessage(s)}
											className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
											style={{ background: 'rgba(184,107,69,0.08)', color: '#B86B45', border: '1px solid rgba(184,107,69,0.2)' }}>
											{s}
										</button>
									))}
								</motion.div>
							)}

							<div ref={bottomRef} />
						</div>

						{/* Input */}
						<div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid rgba(184,107,69,0.1)', background: '#FEFCF9' }}>
							<div className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
								style={{ background: 'white', border: '1.5px solid rgba(184,107,69,0.2)', boxShadow: '0 2px 8px rgba(60,42,37,0.06)' }}>
								<input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
									placeholder="Ask anything about installation..."
									className="flex-1 text-sm outline-none bg-transparent text-[#3C2A25] placeholder-[#B86B45]/40 min-w-0" />
								<button onClick={() => sendMessage()} disabled={!input.trim() || loading}
									className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95 shrink-0"
									style={{ background: input.trim() ? 'linear-gradient(135deg, #B86B45, #D4854F)' : 'rgba(184,107,69,0.1)' }}>
									<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={input.trim() ? 'white' : '#B86B45'} strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
									</svg>
								</button>
							</div>
							<p className="text-center text-[10px] text-[#B86B45]/40 mt-2 font-medium">Powered by AI · Electric Hamam</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* ── Floating Button ── */}
			<motion.button
				onClick={() => setOpen(o => !o)}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 1 }}
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.94 }}
				aria-label="Open AI Chat Assistant"
				className="fixed z-50 flex items-center justify-center rounded-full text-white w-12 h-12 lg:w-[52px] lg:h-[52px]"
				style={{
					background: 'linear-gradient(135deg, #B86B45, #D4854F)',
					boxShadow: open
						? '0 4px 20px rgba(184,107,69,0.45), 0 0 0 4px rgba(184,107,69,0.2)'
						: '0 4px 20px rgba(184,107,69,0.45)',
					border: '1px solid rgba(255,255,255,0.15)',
					bottom: 'calc(14px + 16px + env(safe-area-inset-bottom))',
					right: '1rem',
				}}>

				<AnimatePresence mode="wait">
					{open ? (
						<motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.2 }} width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
						</motion.svg>
					) : (
						<motion.svg key="chat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
							transition={{ duration: 0.2 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 2C6.48 2 2 6.02 2 11c0 2.29.87 4.38 2.28 5.98L3 21l4.27-1.36A9.9 9.9 0 0012 20c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
							<path d="M8 10h8M8 14h5"/>
						</motion.svg>
					)}
				</AnimatePresence>

				{/* Pulse ring when closed */}
				{!open && (
					<motion.span
						className="absolute rounded-full"
						style={{ inset: 0, }}
						animate={{ boxShadow: ['0 0 0 0 rgba(184,107,69,0.4)', '0 0 0 10px rgba(184,107,69,0)'] }}
						transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} />
				)}
			</motion.button>
		</>
	);
}
