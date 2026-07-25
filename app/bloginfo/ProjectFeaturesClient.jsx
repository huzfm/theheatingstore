'use client';

import { motion, useReducedMotion } from 'framer-motion';

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.14 },
	},
};

const item = {
	hidden: { opacity: 0, y: 26 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
	},
};

const features = [
	{
		title: 'Kashmir First Installation Expertise',
		desc: 'Real on-site visuals from Kashmir installations, workforce, floor preparation, layered concrete method, and heat retention testing. Focused on execution, not marketing renders.',
	},
	{
		title: 'Intelligent Project Cost Calculator',
		desc: 'Area-based system calculation with Kashmir pricing, labour estimation, thermostat inclusion, and power cut heat retention analysis.',
	},
	{
		title: 'End to End Project Guidance',
		desc: 'Clear explanation of workflow, safety standards, energy efficiency and long-term reliability, helping clients understand what they are investing in.',
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
	},
};

export default function ProjectFeatures() {
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
			{/* SOFT HEAT GLOW */}
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

			{/* PREMIUM GRAIN */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage: "url('/noise.png')",
					opacity: 0.02,
				}}
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-6 py-32'>
				{/* HEADER */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='max-w-3xl'>
					<motion.div
						variants={fadeUp}
						className='
    inline-flex items-center
    rounded-full

    px-6 py-2.5
    sm:px-8

    backdrop-blur-xl
    bg-white/[0.08]

    border border-white/[0.18]

    shadow-[0_10px_30px_rgba(0,0,0,0.18)]
  '>
						<p
							className='
      text-[10px] sm:text-[11px]
      font-medium uppercase

      tracking-[0.35em]
      text-[#4FA3D1]

      whitespace-nowrap
    '>
							Electric Hamam in Kashmir
						</p>
					</motion.div>

					<motion.h2
						variants={item}
						className='
              mt-6
              text-4xl sm:text-5xl
              font-serif font-semibold
              leading-tight
              text-[#3C2A25]
            '>
						Built for Kashmir
						<br />
						<span className='font-light text-[#B86B45]'>
							Electric Hamam Projects
						</span>
					</motion.h2>

					<motion.p
						variants={item}
						className="mt-6 max-w-xl text-lg leading-relaxed text-[#3C2B27]">
						We don't just sell systems, we deliver Kashmir installation expertise, technically transparent project experience, and systems built for -15C winters and power cuts.
						<a href='/installation' className="text-[#B86B45] underline underline-offset-2 hover:text-[#E8933A] transition-colors">See our Kashmir installation process</a> or
						<a href='/about' className="text-[#B86B45] underline underline-offset-2 hover:text-[#E8933A] transition-colors"> learn about our Kashmir expertise</a>.
					</motion.p>
				</motion.div>

				{/* FEATURES */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='mt-20 grid gap-12 lg:grid-cols-3'>
					{features.map((f) => (
						<motion.div
							key={f.title}
							variants={item}
							whileHover={reduce ? {} : { y: -8 }}
							className='
                relative rounded-[28px]
                bg-white/75 backdrop-blur-sm
                border border-black/10
                p-8
                shadow-[0_40px_90px_-55px_rgba(0,0,0,0.45)]
                transition
              '>
							{/* <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[28px] bg-[#B86B45]/70" /> */}

							<p className='text-xl font-serif font-semibold text-[#3C2A25]'>
								{f.title}
							</p>

							<p className='mt-4 text-sm leading-relaxed text-[#4A342E]'>
								{f.desc}
							</p>
						</motion.div>
					))}
				</motion.div>

				<p className='mt-8 text-center text-sm text-[#4A342E]'>
					Want to see our systems in action?{' '}
					<a href='/product' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>View our Kashmir electric hamam portfolio and brand partners</a>
					{' '}or{' '}
					<a href='/contact' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>get in touch for a consultation</a>.
				</p>

				{/* <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="
            mt-24
            max-w-4xl
            rounded-[32px]
            bg-white/70 backdrop-blur-sm
            border border-black/10
            p-10
          "
        >
          <p className="text-xl font-serif font-semibold text-[#3C2A25]">
            Need technical clarity before starting?
          </p>

          <p className="mt-3 max-w-xl text-sm text-[#4A342E]">
            Get project-specific documentation, system recommendations,
            and installation guidance directly from our engineering team.
          </p>

          <a
            href="/contact"
            className="
              mt-8 inline-flex items-center justify-center
              rounded-full
              px-10 py-3.5
              text-sm font-semibold
              text-white
              bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C]
              shadow-[0_22px_70px_rgba(184,107,69,0.45)]
              transition hover:scale-[1.05]
            "
          >
            Request Technical Guidance
          </a>
        </motion.div> */}

				<motion.div
					variants={item}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='mt-24 max-w-4xl'>
					<div className='rounded-[32px] bg-white/70 backdrop-blur-sm border border-black/10 p-10 sm:p-14'>
						<p className='text-[11px] uppercase tracking-[0.3em] text-[#B86B45]/70 font-semibold mb-4'>
							Our Commitment
						</p>
						<h3 className='text-2xl sm:text-3xl font-serif font-semibold text-[#3C2A25] leading-snug'>
							Built for Kashmir winters.
							<br />
							<span className='text-[#B86B45] font-light'>
								Backed by our warranty.
							</span>
						</h3>
						<p className='mt-4 text-sm text-[#4A342E] max-w-lg leading-relaxed'>
							Every electric hamam installation we deliver in Kashmir is backed by precision engineering, the layered concrete sandwich method for heat retention, and a team that holds itself accountable from first survey to final handover.
						</p>
						<p className='mt-10 text-xs uppercase tracking-[0.3em] text-black/40 font-medium'>
							Every project measured &nbsp;·&nbsp; Every detail
							engineered
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
