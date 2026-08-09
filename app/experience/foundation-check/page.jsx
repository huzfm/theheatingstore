import FoundationCheckClient from './FoundationCheckClient';

/**
 * Dev-only verification route for the animation foundation.
 * Lives under /experience so it inherits that route's dark theme, Lenis
 * instance and Sora display face, the context the UI primitives are
 * designed for. Not linked from anywhere; delete when no longer useful.
 */
export const metadata = {
  title: { absolute: 'Foundation check | The Heating Store' },
  robots: { index: false, follow: false },
  // Declared only so this page stops inheriting /experience's share card and
  // showing up as a duplicate in the metadata check.
  twitter: {
    card: 'summary',
    title: 'Foundation check',
    description: 'Internal verification route for the animation primitives.',
  },
};

export default function FoundationCheckPage() {
  return <FoundationCheckClient />;
}
