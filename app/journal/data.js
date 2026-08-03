/**
 * Journal article data.
 *
 * These are the same four pieces that previously lived inside
 * ArticlesSection.jsx (title/dek/image/quote copy is unchanged) — only the
 * shape has been normalised for the new editorial layout system. There is
 * no live per-article CMS route today (the /blog backend this would
 * otherwise read from is currently offline), so every card still deep-links
 * to /blog, exactly as before.
 */

export const ARTICLES = [
  {
    id: '01',
    slot: 'featured',
    category: 'Comparison',
    title: 'Electric Hamam vs Traditional Hamam',
    dek: 'Which heating system is better for Kashmir homes? A complete cost, comfort and safety comparison.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80',
    href: '/blog',
  },
  {
    id: '02',
    slot: 'landscape',
    category: 'Architecture',
    title: 'Underfloor Heating for Luxury Homes & Hotels',
    dek: 'Why architects in Gulmarg, Pahalgam and Srinagar choose electric hamam for premium properties.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80',
    href: '/blog',
  },
  {
    id: '03',
    slot: 'panorama',
    category: 'Climate',
    title: 'Best Heating Systems for Kashmir Winters',
    dek: 'How underfloor heating performs in −15°C conditions, heavy snowfall and long power cuts.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=2000&q=80',
    href: '/blog',
  },
  {
    id: '04',
    slot: 'quote',
    category: 'Systems',
    title: 'Electric vs Hydronic Underfloor Heating',
    dek: 'Cable mats or hot water pipes? Choosing the right system for your home in Srinagar.',
    quote: 'Warmth should be felt, never seen — the quiet mark of a truly considered interior.',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1800&q=80',
    href: '/blog',
  },
];

export const FEATURED = ARTICLES.find((a) => a.slot === 'featured');
export const INDEX_ARTICLES = ARTICLES.filter((a) => a.slot !== 'featured');

export const CATEGORIES = [
  'All',
  ...Array.from(new Set(INDEX_ARTICLES.map((a) => a.category))),
];
