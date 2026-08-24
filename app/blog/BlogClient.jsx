'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Skeleton, SkeletonGroup } from '@/components/ui/loading/Skeleton';

export default function BlogsClient() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await fetch(
						`https://api.theheatingstore.in/blogs?page=1&limit=50`,
					{
						headers: { 'x-api-key': process.env.NEXT_PUBLIC_BLOG_API_KEY || '' },
						cache: 'no-store',
					},
				);
				const data = await res.json();
				setBlogs(data.items || []);
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
					<div className='mb-16 max-w-2xl'>
						<Skeleton className='h-3 w-32 mb-4' />
						<Skeleton className='h-10 w-48' />
					</div>
					<SkeletonGroup label='Loading articles' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{[1, 2, 3].map((i) => (
							<div key={i} className='rounded-2xl overflow-hidden bg-white shadow-sm'>
								<Skeleton className='w-full aspect-[16/10]' />
								<div className='p-6 space-y-3'>
									<Skeleton className='h-3 w-20' />
									<Skeleton className='h-6 w-full' />
									<Skeleton className='h-4 w-5/6' />
								</div>
							</div>
						))}
					</SkeletonGroup>
				</div>
			</section>
		);
	}

	return (
		<section className='min-h-screen bg-[#FFF8F0] py-24'>
			<div className='mx-auto max-w-7xl px-6'>
				{/* Header */}
				<div className='mb-16 max-w-2xl'>
					<p className='text-[11px] font-medium uppercase tracking-[0.35em] text-[#B86B45]'>
						Knowledge & Insights
					</p>
					<h1 className='mt-4 text-4xl sm:text-5xl font-serif font-semibold text-[#3C2A25] leading-tight'>
						All Articles
					</h1>
					{!loading && (
						<p className='mt-4 text-[15px] text-[#5A4036]'>
							{blogs.length} article{blogs.length !== 1 ? 's' : ''} published
						</p>
					)}
				</div>

				{/* Cards grid */}
				{blogs.length === 0 ? (
					<p className='text-center text-[#B86B45] py-20'>No articles yet.</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{blogs.map((blog) => (
							<Link href={`/blog/${blog.slug}`} key={blog.slug}>
								<article className='group h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
									{/* Image */}
									{blog.coverImage ? (
										<div className='relative w-full aspect-[16/10] overflow-hidden'>
											<Image
												src={blog.coverImage}
												alt={blog.title}
												fill
												sizes='(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'
												className='object-cover transition-transform duration-500 group-hover:scale-105'
											/>
										</div>
									) : (
										<div className='w-full aspect-[16/10] bg-[#F7F1E7]' />
									)}

									{/* Content */}
									<div className='flex flex-col flex-1 p-6'>
										<div className='flex items-center gap-2 mb-3'>
											{blog.category && (
												<span className='text-[10px] font-semibold uppercase tracking-widest text-[#B86B45]'>
													{blog.category}
												</span>
											)}
											{blog.readingTime && (
												<span className='text-[10px] text-[#8A7A6D]'>
													· {blog.readingTime} min
												</span>
											)}
										</div>

										<h2 className='font-serif font-semibold text-lg text-[#3C2A25] leading-snug group-hover:text-[#B86B45] transition-colors duration-300'>
											{blog.title}
										</h2>

										<p className='mt-2 text-sm text-[#5A4036] leading-relaxed line-clamp-2 flex-1'>
											{blog.excerpt}
										</p>

										<div className='mt-4 pt-4 border-t border-[#f0d5c0] flex items-center justify-between'>
											{blog.publishedAt && (
												<span className='text-[11px] text-[#8A7A6D]'>
													{new Date(blog.publishedAt).toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric',
													})}
												</span>
											)}
											<span className='inline-flex items-center gap-1 text-[11px] font-medium text-[#B86B45]'>
												Read
												<ArrowUpRight className='w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
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
