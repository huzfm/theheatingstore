import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/rajbagh");

import RajbaghClient from './RajbaghClient';

export default function RajbaghPage() {
  return <RajbaghClient />;
}
