import { Sora } from 'next/font/google';
import ExperienceShell from './ExperienceShell';

/**
 * Display face for headlines: geometric, tight, holds up at 8rem+.
 * Loaded here rather than in the root layout so the legacy pages don't pay
 * for a font they never render.
 */
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display-sora',
  display: 'swap',
});

/* Body copy reuses the Hanken Grotesk already loaded by the root layout as
   --font-body, so this route adds exactly one font to the page weight. */

export const metadata = {
  title: 'The Experience | Underfloor Heating, Engineered',
  description:
    'Explore the engineering beneath the floor, an interactive look at our underfloor heating systems, installation process and warranty coverage.',
  openGraph: {
    title: 'The Experience | Underfloor Heating, Engineered',
    description:
      'An interactive look at the engineering beneath your floor.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function ExperienceLayout({ children }) {
  return (
    <div className={sora.variable}>
      <ExperienceShell>{children}</ExperienceShell>
    </div>
  );
}
