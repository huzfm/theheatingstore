import AdminDashboard from './AdminDashboard';

/**
 * Not routed through content/page-meta.ts: this is an internal dashboard, not
 * a page competing for anything, so it gets no Open Graph card and no approved
 * marketing copy.
 *
 * Worth knowing: robots.txt says `Disallow: /admin/` with a trailing slash,
 * which does NOT match `/admin`, the actual route. This dashboard is crawlable
 * today. `robots: { index: false }` is the fix and is awaiting sign-off.
 */
export const metadata = {
  title: { absolute: 'Admin Dashboard | The Heating Store' },
  description: 'Installation analytics and demand insights',
  alternates: { canonical: '/admin' },
  twitter: {
    card: 'summary',
    title: 'Admin Dashboard',
    description: 'Internal installation analytics. Not a public page.',
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
