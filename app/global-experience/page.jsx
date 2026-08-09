import GlobalExperienceClient from './GlobalExperienceClient';

export const metadata = {
  title: 'Global Standards, Local Installs | Certified Heating Systems',
  description:
    'The electric hamam systems we install in Kashmir are proven across eight countries and built to international IEC standards. The manufacturers we carry, the buildings we heat, and every installation manual free to download.',
  openGraph: {
    title: 'Global Standards, Local Installs | Certified Heating Systems',
    description:
      'Proven across eight countries, built to international standards, installed here.',
    type: 'article',
  },
  // No self-referencing canonical: this URL 308s to /why-choose-us
  // (next.config.mjs), so pointing a canonical at itself would contradict
  // the redirect. The page file is kept only until Phase 4 deletes it.
  alternates: { canonical: '/why-choose-us' },
};

export default function GlobalExperience() {
  return <GlobalExperienceClient />;
}
