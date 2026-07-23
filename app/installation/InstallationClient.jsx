'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

/* ---------------- DATA ---------------- */

// const steps = [
//   {
//     title: 'Install Insulation',
//     image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
//     desc: 'High-density insulation boards are secured across the entire subfloor before any heating element is laid. This critical layer prevents downward thermal loss, redirecting all generated heat upward into the living space. Edge insulation strip is fitted at all perimeter walls to allow for natural screed expansion during heating cycles.',
//     points: [
//       'High-density boards eliminate downward heat loss',
//       'Perimeter edge strip fitted for screed expansion',
//     ],
//   },
//   {
//     title: 'Concrete Screed Base',
//     image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
//     desc: 'A precisely measured concrete screed base is applied over the insulation layer to create a flat, debris-free surface at the correct build-up height. The compound is levelled and tamped to remove voids, ensuring uniform contact with the heating cable above and consistent heat transfer across the entire floor area.',
//     points: [
//       'Subfloor levelled and prepared to correct depth',
//       'Screed compound tamped for full surface contact',
//     ],
//   },
//   {
//     title: 'Install the System',
//     image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
//     desc: 'Certified technicians lay the heating cable at manufacturer-specified spacing across the insulated surface, using fixing staples or galvanised steel profiles to secure each run. Cables are routed to maintain even coverage across all active zones, with cold tails terminated back to the designated thermostat position. The system undergoes a full continuity and resistance test before any screed is applied.',
//     points: [
//       'Cable fixed at precise spacing for uniform heat distribution',
//       'Full resistance and continuity test completed before covering',
//     ],
//   },
//   {
//     title: 'Encapsulation Screed',
//     image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
//     desc: 'A self-levelling encapsulation screed is carefully poured over the installed cable system to the manufacturer-recommended depth — typically 65–75mm — fully embedding the heating element. The screed is allowed to cure for a minimum of seven days before any commissioning begins, with temperature gradually raised in incremental stages to prevent surface cracking and ensure long-term structural integrity.',
//     points: [
//       'Self-levelling screed poured to 65–75mm recommended depth',
//       'Curing period observed before gradual thermostat commissioning',
//     ],
//   },
//   {
//     title: 'Register Warranty',
//     image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
//     desc: 'Upon completion, the system undergoes a full electrical safety validation and thermostat commissioning check. Floor temperature sensor placement is verified, and the programmer is configured to the client\'s schedule. All test results are documented, the manufacturer warranty is formally registered, and a handover certificate is issued confirming the installation meets CE certification and IEC 60335 safety standards.',
//     points: [
//       'Full electrical safety validation and sensor placement verified',
//       'Manufacturer warranty registered and handover certificate issued',
//     ],
//   },
// ];


const steps = [
  {
    title: 'Install Insulation',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    desc: 'Clean the subfloor thoroughly. Our expert will install high-density insulation boards across the entire surface, directing all generated heat upward into the living space — leading to quicker heat-up times and significant cost savings.',
    points: [
      'High-density boards eliminate downward heat loss',
      'Perimeter edge strip fitted for screed expansion',
    ],
  },
  {
    title: 'Concrete Screed',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    desc: 'Once the insulation is in place, our expert will proceed to lay a concrete screed layer approximately 20–25mm thick. This layer ensures even distribution of heat from the underfloor heating system across the entire floor area.',
    points: [
      'Subfloor levelled and prepared to correct depth',
      'Screed compound tamped for full surface contact',
    ],
  },
  {
    title: 'Install the System',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
    desc: 'Our expert will install the underfloor heating system, tailored precisely to the room size and number of zones. Various quality checks are conducted throughout the installation process to ensure optimal performance and safety.',
    points: [
      'Cable fixed at precise spacing for uniform heat distribution',
      'Full resistance and continuity test completed before covering',
    ],
  },
  {
    title: 'Final Layer',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    desc: 'Our expert will first install thermostat probes for precise temperature control. Following this, a final smooth layer of concrete, typically 25–30mm thick, is poured to provide an even surface for the final flooring and ensure heat is evenly spread across the floor.',
    points: [
      'Thermostat probes installed for precise temperature control',
      'Final concrete layer poured to 25–30mm depth',
    ],
  },
  {
    title: 'Register Guarantee',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    desc: 'Finally, our expert will register the system, activating a 10-year worry-free guarantee. After this period, the system continues to be covered by a lifetime warranty — providing you with enduring support and complete peace of mind.',
    points: [
      'Full electrical safety validation and sensor placement verified',
      'Manufacturer warranty registered and handover certificate issued',
    ],
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
/* ---------------- MAIN ---------------- */

export default function InstallationContent() {
	const ref = useRef(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0.85', 'end 0.25'],
	});

	const lineHeight = useTransform(
		scrollYProgress,
		[0, 1],
		['0%', '100%'],
	);

	return (
		<section
			ref={ref}
			className='relative overflow-hidden bg-[#FFF8F0] py-16 sm:py-28'>
			{/* BACKGROUND */}

			<div className='absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF4E8_45%,#FFE8D0_100%)]' />

			<div className='relative max-w-6xl mx-auto px-6'>
				{/* HEADER */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className='max-w-3xl mb-12 sm:mb-20'>
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
							Electric Hamam Installation
						</p>
					</motion.div>

					<h1 className='mt-6 font-serif font-semibold leading-tight text-[#3C2A25]' style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
						How We Install
						<br />
						<span className='text-[#B86B45] font-light'>
							Electric Hamam Systems.
						</span>
					</h1>

					<p className='mt-6 text-base sm:text-lg leading-relaxed text-[#4A342E]'>
						Every stage is engineered to the highest installation standard, from subfloor preparation and insulation selection to cable laying, screed depth, and thermostat commissioning. Our layered installation method maximises thermal mass, delivering sustained warmth long after the system powers down. Built for reliability, backed by manufacturer warranties, and completed by certified technicians on every project.
					</p>
				</motion.div>

				{/* TIMELINE */}
				<div className='relative max-w-4xl mx-auto'>
					{/* STATIC LINE */}
					<div className='absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-slate-200' />

					{/* ANIMATED BLUE LINE */}
					<motion.div
						style={{ height: lineHeight }}
						className='absolute left-4 sm:left-5 top-0 w-px bg-[#4FA3D1]'
					/>

					<div className='space-y-20 sm:space-y-28'>
						{steps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 32 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-120px' }}
								transition={{
									duration: 0.7,
									ease: [0.22, 1, 0.36, 1],
								}}
								className='relative flex gap-6 sm:gap-10 items-start'>
								{/* STEP DOT */}
								<div className='relative z-10 flex-shrink-0'>
									<div
										className='flex h-11 w-11 items-center justify-center
                               rounded-full bg-white
                               ring-2 ring-[#4FA3D1]
                               shadow-sm'>
										<span className='text-sm font-semibold text-[#4FA3D1]'>
											{String(index + 1).padStart(2, '0')}
										</span>
									</div>
								</div>

								{/* CARD */}
								<div
									className='flex-1 rounded-3xl bg-white
                             p-5 sm:p-9
                             border border-slate-200
                             shadow-[0_25px_70px_rgba(15,23,42,0.08)]'>
									<div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center'>
										{/* TEXT */}
										<div>
											<h3 className='font-semibold text-[#3C2A25]' style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
												{step.title}
											</h3>

											<p className='mt-4 text-sm sm:text-[15px] leading-relaxed text-[#4A342E]'>
												{step.desc}
											</p>

											<div className='mt-5 space-y-3 text-sm text-[#4A342E]'>
												{step.points.map((p) => (
													<div key={p} className='flex gap-3'>
														<span className='mt-2 h-2 w-2 rounded-full bg-[#4FA3D1]' />
														<span>{p}</span>
													</div>
												))}
											</div>
										</div>

										{/* IMAGE – DESKTOP ONLY */}
										<div className='relative hidden lg:flex items-center justify-center'>
											<Image
												src={step.image}
												alt={step.title}
												width={600}
												height={260}
												className='h-[260px] w-full object-cover rounded-2xl'
												unoptimized
											/>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* CLIMATE NOTE */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className='mt-16 sm:mt-24 max-w-3xl mx-auto'>
					<div className='relative rounded-2xl bg-gradient-to-r
						from-[#FDF4E8] to-[#FEF0E0]
						border border-[#4FA3D1]/20 p-6 sm:p-8'>
						<div className='absolute -top-3 left-8'>
							<div className='inline-flex items-center gap-2
								bg-[#4FA3D1] text-white px-4 py-1.5
								rounded-full text-xs font-semibold uppercase tracking-wide'>
								Kashmir Climate Note
							</div>
						</div>
						<p className='mt-4 text-[#5A4030] leading-relaxed'>
							Using insulation ensures heat retention for 6–8 hours even
							during electricity cut offs (load shedding) optimized for
							Kashmir climate.
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
