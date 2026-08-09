import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/sanatnagar");

import SanatNagarClient from './SanatNagarClient';

export default function SanatNagarPage() {
  return <SanatNagarClient />;
}
