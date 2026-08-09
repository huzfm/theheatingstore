import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/rawalpora");

import RawalporaClient from './RawalporaClient';

export default function RawalporaPage() {
  return <RawalporaClient />;
}
