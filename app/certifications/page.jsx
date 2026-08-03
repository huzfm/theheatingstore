import CertificationsClient from './CertificationsClient';

export const metadata = {
  title: 'Certifications & Safety Standards | CE, IEC, ISO Compliance',
  description:
    'Every standard our electric hamam and underfloor heating systems are certified to, grouped by what each one governs: CE and UKCA marks, IEC 60335 safety, ISO 9001 manufacturing, BS 7671 installation, and WRAS approval for water-based systems.',
  keywords: [
    'underfloor heating certifications India',
    'IEC 60335 heating cable',
    'CE UKCA certified underfloor heating',
    'ISO 9001 heating manufacturer',
    'BS 7671 underfloor heating installation',
    'WRAS approved underfloor heating',
  ],
  openGraph: {
    title: 'Certifications & Safety Standards | CE, IEC, ISO Compliance',
    description:
      'Once a heating cable is under screed, nobody inspects it again. Every certification exists because that is the only chance to get it right.',
    type: 'article',
  },
  alternates: { canonical: '/certifications' },
};

export default function Certifications() {
  return <CertificationsClient />;
}
