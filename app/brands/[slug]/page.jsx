import { notFound } from 'next/navigation';
import { BRANDS, getBrandBySlug, getRelatedBrands } from '../../lib/brandsData';
import BrandDetailClient from './BrandDetailClient';

// ────────────────────────────────────────────────────────────
// STATIC GENERATION
// ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
	return BRANDS.map((b) => ({ slug: b.slug }));
}

// ────────────────────────────────────────────────────────────
// SEO METADATA
// ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
	const { slug } = await params;
	const brand = getBrandBySlug(slug);
	if (!brand) {
		return { title: 'Brand Not Found | The Heating Store India' };
	}

	// First 155 chars of longDesc for the description
	const description =
		brand.longDesc.replace(/\n+/g, ' ').slice(0, 155).trim() + '...';

	return {
		title: `${brand.name} Underfloor Heating Systems | The Heating Store India`,
		description,
		keywords: [
			`${brand.name} underfloor heating`,
			`${brand.name} India`,
			'underfloor heating systems',
			'electric floor heating',
			'Kashmir heating',
			brand.origin,
		],
		openGraph: {
			title: `${brand.name} Underfloor Heating Systems | The Heating Store India`,
			description,
			images: [
				{
					url: brand.heroImage,
					width: 1200,
					height: 630,
					alt: `${brand.name} – premium underfloor heating`,
				},
			],
			type: 'website',
			url: `https://theheatingstore.in/brands/${brand.slug}`,
		},
		twitter: {
			card: 'summary_large_image',
			title: `${brand.name} Underfloor Heating Systems`,
			description,
			images: [brand.heroImage],
		},
		alternates: {
			canonical: `https://theheatingstore.in/brands/${brand.slug}`,
		},
	};
}

// ────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────
export default async function BrandPage({ params }) {
	const { slug } = await params;
	const brand = getBrandBySlug(slug);
	if (!brand) {
		notFound();
	}

	const related = getRelatedBrands(slug, 3);

	return <BrandDetailClient brand={brand} related={related} />;
}
