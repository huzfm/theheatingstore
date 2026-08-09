import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/chanapora");

import ChanaporaClient from './ChanaporaClient';

export default function ChanaporaPage() {
  return <ChanaporaClient />;
}
