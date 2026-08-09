import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/nishat");

import NishatClient from './NishatClient';

export default function NishatPage() {
  return <NishatClient />;
}
