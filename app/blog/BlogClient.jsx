'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogsClient() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await fetch(
					'https://evulation-api-electrichamambackend.0psc8x.easypanel.host/api/blogs',
					{
						cache: 'no-store',
					},
				);
				const data = await res.json();
				const list = Array.isArray(data) ? data : [];
				setBlogs(list);
			} catch (err) {
				console.error('Blog fetch error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);

	if (loading) {
		return (
			<section className='min-h-screen bg-[#FFF8F0] py-24'>
				<div className='mx-auto max-w-7xl px-6'>
					<div className='mb-16 space-y-4'>
						<div className='h-7 w-40 bg-[#f0d5c0] rounded-full animate-pulse' />
						<div className='h-12 w-64 bg-[#f0d5c0] rounded-2xl animate-pulse' />
						<div className='h-4 w-32 bg-[#f0d5c0] rounded animate-pulse' />
					</div>
					<div className='flex flex-col gap-12'>
						{[1, 2].map((i) => (
							<div
								key={i}
								className='w-full rounded-[32px] overflow-hidden bg-white shadow-sm'>
								<div className='w-full h-[300px] bg-[#f0d5c0] animate-pulse' />
								<div className='p-10 space-y-4'>
									<div className='h-4 w-24 bg-[#f0d5c0] rounded animate-pulse' />
									<div className='h-7 w-80 bg-[#f0d5c0] rounded animate-pulse' />
									<div className='h-4 w-full bg-[#f0d5c0] rounded animate-pulse' />
									<div className='h-4 w-2/3 bg-[#f0d5c0] rounded animate-pulse' />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className='min-h-screen bg-[#FFF8F0] py-24'>
			<div className='mx-auto max-w-7xl px-6'>
				<div className='mb-16 max-w-2xl'>
					<p className='inline-block rounded-full bg-white/70 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.35em] text-[#B86B45] border border-white/40'>
						Knowledge & Insights
					</p>
					<h1 className='mt-6 text-4xl sm:text-5xl font-serif font-semibold text-[#3C2A25] leading-tight'>
						All Articles
					</h1>
					<p className='mt-4 text-[15px] text-[#5A4036]'>
						{blogs.length} article{blogs.length !== 1 ? 's' : ''}{' '}
						published
					</p>
				</div>

				{blogs.length === 0 ? (
					<p className='text-center text-[#B86B45] py-20'>
						No blogs yet
					</p>
				) : (
					<div className='lg:grid lg:grid-cols-2 gap-12'>
						{blogs.map((blog) => (
							<Link href={`/blog/${blog.slug}`} key={blog._id}>
								<article className='w-full flex flex-col justify-around items-start overflow-hidden rounded-[32px] bg-white shadow-[0_35px_120px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 cursor-pointer'>
									{/* Only this block changed */}
									{blog.featuredImage && (
										<div className='w-full flex justify-center pt-8'>
											<img
												src={blog.featuredImage}
												alt={blog.title}
												className='w-40 h-40 rounded-full object-cover transition duration-700 hover:scale-105'
											/>
										</div>
									)}

									<div className='p-10'>
										{blog.category && (
											<span className='text-xs font-semibold uppercase tracking-widest text-[#B86B45]'>
												{blog.category}
											</span>
										)}
										<h2 className='mt-2 text-2xl font-serif font-semibold text-[#3C2A25] leading-snug'>
											{blog.title}
										</h2>
										<p className='mt-4 text-[15px] text-[#5A4036] max-h-[3em] overflow-hidden leading-[1.5em]'>
											{blog.shortDescription}
										</p>
										{blog.tags?.length > 0 && (
											<div className='flex flex-wrap gap-2 mt-5'>
												{blog.tags.map((tag) => (
													<span
														key={tag}
														className='text-xs bg-[#FFF8F0] text-[#B86B45] border border-[#f0d5c0] px-3 py-1 rounded-full'>
														#{tag}
													</span>
												))}
											</div>
										)}
										<div className='mt-6 flex items-center justify-between'>
											<span className='text-xs text-[#B86B45]/60'>
												{new Date(blog.createdAt).toLocaleDateString(
													'en-US',
													{
														month: 'long',
														day: 'numeric',
														year: 'numeric',
													},
												)}
											</span>
											<span className='text-sm font-medium text-[#B86B45]'>
												Read Article
											</span>
										</div>
									</div>
								</article>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
