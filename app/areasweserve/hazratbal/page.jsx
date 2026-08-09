import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/hazratbal");

import HazratbalClient from './HazratbalClient';

export default function HazratbalPage() {
  return <HazratbalClient />;
}
