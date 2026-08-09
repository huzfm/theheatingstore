import LocalExperienceClient from './LocalExperienceClient';

export const metadata = {
  title: 'Underfloor Heating in Kashmir | Our Local Team, Brands & Coverage',
  description:
    'The Heating Store has installed electric hamam and underfloor heating across Kashmir since 2011. The six brands we stock and support, and the towns our Srinagar team covers, from Srinagar and Baramulla to Shimla, Delhi and Darjeeling.',
  openGraph: {
    title: 'Underfloor Heating in Kashmir | Our Local Team, Brands & Coverage',
    description:
      'A Srinagar team, six supported brands, and installations from the Valley to the coast.',
    type: 'article',
  },
  // No self-referencing canonical: this URL 308s to /why-choose-us
  // (next.config.mjs), so pointing a canonical at itself would contradict
  // the redirect. The page file is kept only until Phase 4 deletes it.
  alternates: { canonical: '/why-choose-us' },
};

export default function LocalExperience() {
  return <LocalExperienceClient />;
}
