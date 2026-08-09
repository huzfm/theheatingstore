import { pageMetadata } from '@/app/lib/seo';
import CertificationsClient from './CertificationsClient';

export const metadata = pageMetadata("/certifications");

export default function Certifications() {
  return <CertificationsClient />;
}
