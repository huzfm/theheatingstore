import FoundationCheckClient from './FoundationCheckClient';

/**
 * Dev-only verification route for the animation foundation.
 * Lives under /experience so it inherits that route's dark theme, Lenis
 * instance and Sora display face — the context the UI primitives are
 * designed for. Not linked from anywhere; delete when no longer useful.
 */
export const metadata = {
  title: 'Foundation check',
  robots: { index: false, follow: false },
};

export default function FoundationCheckPage() {
  return <FoundationCheckClient />;
}
