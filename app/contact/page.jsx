import { pageMetadata } from '@/app/lib/seo';
import ContactClient from './ContactClient';

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return <ContactClient />;
}
