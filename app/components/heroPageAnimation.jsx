<motion.div
	variants={fadeUp}
	className='relative hidden lg:block h-[420px] w-full max-w-md mx-auto'>
	<div className='relative h-full w-full rounded-3xl overflow-hidden bg-[#FFF3E6] shadow-[0_40px_120px_rgba(0,0,0,0.35)]'>
		{/* SCREED */}
		<motion.div
			className='absolute top-20 inset-x-0 h-24 bg-[#FFCC9F]'
			initial={{ y: -30, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
		/>

		{/* HEATING LAYER */}
		<div className='absolute top-[118px] left-6 right-6 h-10'>
			{[...Array(7)].map((_, i) => (
				<motion.div
					key={i}
					className='absolute left-0 right-0 h-[3px] rounded-full bg-[#B86B45] shadow-[0_2px_10px_rgba(184,107,69,0.45)]'
					style={{ top: `${i * 6}px` }}
					initial={{ scaleX: 0, opacity: 0 }}
					animate={{
						scaleX: [0, 1.1, 1],
						opacity: [0, 1, 0.9],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: i * 0.15,
					}}
				/>
			))}
		</div>

		{/* INSULATION */}
		<motion.div
			className='absolute top-[180px] inset-x-0 h-24 bg-[#FFD6A6]'
			initial={{ y: 30, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
		/>

		{/* STRUCTURAL BASE */}
		<motion.div
			className='absolute bottom-0 inset-x-0 h-36 bg-[#FFB88C]'
			initial={{ y: 30, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
		/>

		{/* HEAT DIFFUSION */}
		<motion.div
			className='absolute top-12 inset-x-0 h-40 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,214,166,0.18),transparent_75%)]'
			animate={{
				opacity: [0.15, 0.35, 0.15],
				scaleY: [0.95, 1.05, 0.95],
			}}
			transition={{
				duration: 14,
				repeat: Infinity,
				ease: 'easeInOut',
			}}
		/>

		{/* LABELS */}
		<div className='absolute top-4 left-4 text-[12px] font-semibold text-[#3C2B27]'>
			Floor Finish
		</div>
		<div className='absolute top-[96px] left-4 text-[12px] font-semibold text-[#3C2B27]'>
			Heating Layer
		</div>
		<div className='absolute bottom-16 left-4 text-[12px] font-semibold text-[#3C2B27]'>
			Structural Base
		</div>
	</div>
</motion.div>;
