import GlobalExperienceClient from './GlobalExperienceClient';

export const metadata = {
  title: 'Global Standards, Local Installs | Certified Heating Systems',
  description:
    'The electric hamam systems we install in Kashmir are proven across eight countries and built to international IEC standards. The manufacturers we carry, the buildings we heat, and every installation manual free to download.',
  keywords: [
    'internationally certified underfloor heating India',
    'IEC certified heating cable',
    'global underfloor heating brands India',
    'underfloor heating installation manual download',
    'electric hamam mosque heating Kashmir',
    'commercial underfloor heating India',
  ],
  openGraph: {
    title: 'Global Standards, Local Installs | Certified Heating Systems',
    description:
      'Proven across eight countries, built to international standards, installed here.',
    type: 'article',
  },
  alternates: { canonical: '/global-experience' },
};

export default function GlobalExperience() {
  return <GlobalExperienceClient />;
}
