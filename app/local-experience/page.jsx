import LocalExperienceClient from './LocalExperienceClient';

export const metadata = {
  title: 'Underfloor Heating in Kashmir | Our Local Team, Brands & Coverage',
  description:
    'The Heating Store has installed electric hamam and underfloor heating across Kashmir since 2011. The six brands we stock and support, and the towns our Srinagar team covers, from Srinagar and Baramulla to Shimla, Delhi and Darjeeling.',
  keywords: [
    'underfloor heating Kashmir',
    'electric hamam Srinagar',
    'underfloor heating installers Kashmir',
    'heating brands India',
    'electric hamam Baramulla Anantnag',
    'underfloor heating service network India',
  ],
  openGraph: {
    title: 'Underfloor Heating in Kashmir | Our Local Team, Brands & Coverage',
    description:
      'A Srinagar team, six supported brands, and installations from the Valley to the coast.',
    type: 'article',
  },
  alternates: { canonical: '/local-experience' },
};

export default function LocalExperience() {
  return <LocalExperienceClient />;
}
