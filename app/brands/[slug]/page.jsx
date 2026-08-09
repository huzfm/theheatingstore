import { notFound } from 'next/navigation';
import { BRANDS, getBrandBySlug, getRelatedBrands } from '../../lib/brandsData';
import { pageMetadata } from '@/app/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbList } from '@/components/seo/schema';
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
/**
 * Metadata comes from content/page-meta.ts like every other route.
 *
 * It used to be assembled here from `brand.longDesc.slice(0, 155)`, which
 * produced six descriptions that stopped mid-sentence and ended in an ellipsis
 * ("...supplying over 300,000 systems to..."). The approved strings say the
 * same thing in a whole sentence and mention Kashmir, which the slices did not.
 */
export async function generateMetadata({ params }) {
	const { slug } = await params;
	const brand = getBrandBySlug(slug);
	if (!brand) {
		return { title: { absolute: 'Brand Not Found | The Heating Store' } };
	}
	return pageMetadata(`/brands/${brand.slug}`);
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

	/**
	 * Breadcrumbs. These pages sit three levels deep and had no trail at all,
	 * so a result for "ProWarm underfloor heating" gave Google no way to show
	 * where the page lives.
	 *
	 * The trail goes through /product because that is the page that actually
	 * links to all six brands; there is no /brands index route.
	 */
	const breadcrumbSchema = breadcrumbList([
		{ name: 'Home', path: '/' },
		{ name: 'Products', path: '/product' },
		{ name: brand.name, path: `/brands/${brand.slug}` },
	]);

	return (
		<>
			<JsonLd id="ld-breadcrumb" data={breadcrumbSchema} />
			<BrandDetailClient brand={brand} related={related} />
		</>
	);
}
