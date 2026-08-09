import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/jawaharnagar");

import JawaharNagarClient from './JawaharNagarClient';

export default function JawaharNagarPage() {
  return <JawaharNagarClient />;
}
