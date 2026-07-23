'use client';

import { motion, useReducedMotion } from 'framer-motion';

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.18, delayChildren: 0.2 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
	},
};

export default function AboutSectionPremium() {
	const reduce = useReducedMotion();

	return (
		<section
			className='relative isolate overflow-hidden'
			style={{
				backgroundImage: `
          linear-gradient(
            180deg,
            #FFFFFF 0%,
            #FFF4E8 35%,
            #FFE0C2 70%,
            #F5B97A 100%
          )
        `,
			}}>
			{/* SOFT HEAT GLOW — SAME DNA AS HERO */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { opacity: [0.25, 0.4, 0.25] }}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)',
				}}
			/>

			{/* SUBTLE PREMIUM GRAIN */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage: "url('/noise.png')",
					opacity: 0.02,
				}}
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-22 lg:py-24'>
				<div className='grid gap-8 sm:gap-12 lg:gap-20 lg:grid-cols-[1.05fr_0.95fr] items-center'>
					{/* LEFT CONTENT */}
					<motion.div
						variants={container}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true }}>
						<motion.div
							variants={fadeUp}
							className='relative inline-flex'>
							{/* Glass highlight layer */}
							<span
								aria-hidden
								className='
      pointer-events-none absolute inset-0
      rounded-full
      bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))]
      opacity-70
    '
							/>

							<p
								className='
      relative inline-flex items-center
      whitespace-nowrap

      px-6 py-2
      sm:px-7 sm:py-2.5

      text-[10px] sm:text-[11px]
      font-medium uppercase

      tracking-[0.28em] sm:tracking-[0.45em]
      text-[#4FA3D1]

      rounded-full

      bg-[rgba(255,255,255,0.22)]
      backdrop-blur-xl

      border border-white/30
      shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_rgba(15,23,42,0.22)]
    '>
								India #1 Seller · Since 2011
							</p>
						</motion.div>

						<motion.h1
							variants={fadeUp}
							style={{ fontSize: 'clamp(1.625rem, 4vw, 3rem)' }}
					className='mt-4 sm:mt-6 font-serif font-semibold leading-tight text-[#3C2A25] '>
							Electric Hamam &<br />
							<span className='text-[#B86B45] font-darker'>
								Underfloor Heating Installation.
							</span>
						</motion.h1>

						<motion.p
							variants={fadeUp}
							className='mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#3C2B27]'
							style={{ fontWeight: 500 }}>
							We install most trusted electric hamam systems engineered specifically for sub zero winters, daily power cuts. Every layer, every wire, every warranty is designed with one goal: keep your home warm when it matters most.
						</motion.p>

						{/* PREMIUM BULLETS */}
						<motion.div
							variants={fadeUp}
							className='mt-10 space-y-4 text-sm text-[#4A342E]'>
							{[
								'Certified safe for wet areas, sub zero floors, and high humidity.',
								'The only heating system in Kashmir that gets more useful the moment the power goes out.',
								'Built for power cuts: Heat retention up to 8-10 hours after power cut.',
							].map((text, i) => (
								<div key={i} className='flex items-start gap-4'>
									{/* <span className='mt-2 h-2.5 w-2.5 rounded-full bg-[#B86B45]' /> */}
									<p>{text}</p>
								</div>
							))}
						</motion.div>

						{/* CTA */}
						<motion.div
							variants={fadeUp}
							className='mt-10 sm:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-6'>
							<a
								href='/SpaceVerification'
								className='
                  relative inline-flex items-center justify-center
                  rounded-full
                  px-10 py-3.5
                  text-sm font-semibold
                  text-white
                  bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C]
                  shadow-[0_22px_70px_rgba(184,107,69,0.45)]
                  transition-all duration-300
                  hover:scale-[1.05]
                '>
								Talk to Expert
							</a>

							<a
								href='/how-it-works'
								className='
                   relative inline-flex items-center justify-center
                  rounded-full
                  border border-[#FFD6A6]
                  bg-white/70
                  px-10 py-3.5
                  text-sm font-medium
                  text-[#3C2B27]
                  transition
                  hover:bg-[#FFE8CF]
                '>
								View Process
								<span className='text-[#B86B45]'>→</span>
							</a>
						</motion.div>
					</motion.div>

					{/* RIGHT VISUAL */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 1, ease: 'easeOut' }}
						className='relative'>
						<div className='relative overflow-hidden rounded-[32px] bg-[#FFF8F0] shadow-[0_50px_140px_rgba(0,0,0,0.18)]'>
							<img
								src='/images/about.png'
								alt='Electric Hamam installation in Kashmir by The Heating Store team'
								className='h-[240px] sm:h-[320px] lg:h-[520px] w-full object-cover'
							/>
						</div>

						{/* FLOATING TRUST BADGE */}
						
					</motion.div>
				</div>
			</div>
		</section>
	);
}
