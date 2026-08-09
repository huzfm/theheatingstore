import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/dalgate");

import DalgateClient from './DalgateClient';

export default function DalgatePage() {
  return <DalgateClient />;
}
