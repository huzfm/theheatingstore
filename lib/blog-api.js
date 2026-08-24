/**
 * Blog API client for Electric Hammam.
 *
 * Talks to the public blog API behind x-api-key auth.
 */

const API_BASE = process.env.NEXT_PUBLIC_BLOG_API_BASE || 'http://localhost:5050/api/public';
const API_KEY = process.env.NEXT_PUBLIC_BLOG_API_KEY || '';

const headers = { 'x-api-key': API_KEY };

/**
 * Fetch a paginated list of published blogs.
 *
 * @param {{ page?: number; limit?: number; tag?: string }} params
 * @returns {Promise<{ items: Array, total: number, totalPages: number }>}
 */
export async function fetchBlogs({ page = 1, limit = 12, tag } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set('tag', tag);

  const res = await fetch(`${API_BASE}/blogs?${params}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Blog list fetch failed: ${res.status}`);

  return res.json();
}

/**
 * Fetch a single blog post by slug.
 *
 * @param {string} slug
 * @returns {Promise<Object>} Full blog object including content, SEO fields, etc.
 */
export async function fetchBlogBySlug(slug) {
  const res = await fetch(`${API_BASE}/blogs/${slug}`, {
    headers,
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Blog fetch failed: ${res.status}`);

  return res.json();
}

/**
 * Fetch sitemap data from the blog API.
 *
 * @returns {Promise<{ items: Array }>}
 */
export async function fetchBlogSitemap() {
  const res = await fetch(`${API_BASE}/blogs/sitemap`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Blog sitemap fetch failed: ${res.status}`);

  return res.json();
}
