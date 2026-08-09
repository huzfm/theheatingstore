import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/bemina");

import BeminaClient from './BeminaClient';

export default function BeminaPage() {
  return <BeminaClient />;
}
