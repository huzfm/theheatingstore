import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/hyderpora");

import HyderporaClient from './HyderporaClient';

export default function HyderporaPage() {
  return <HyderporaClient />;
}
