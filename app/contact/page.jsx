import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | Book a Free Site Survey in Kashmir, Jammu & Ladakh',
  description:
    'Call, WhatsApp or email the team that does the installation. Book a free site survey anywhere across Kashmir, Jammu and Ladakh, or visit the Srinagar showroom.',
  keywords: [
    'contact electric hamam Kashmir',
    'underfloor heating Srinagar showroom',
    'free site survey Kashmir heating',
    'electric hamam quote Kashmir',
    'underfloor heating Jammu Ladakh',
    'heating installation enquiry Kashmir',
  ],
  openGraph: {
    title: 'Contact Us | Book a Free Site Survey in Kashmir, Jammu & Ladakh',
    description:
      'Not a call centre. The team that answers is the team that surveys your house.',
  },
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
