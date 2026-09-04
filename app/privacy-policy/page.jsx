import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata('/privacy-policy');

import PrivacyPolicyClient from './PrivacyPolicyClient';

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
