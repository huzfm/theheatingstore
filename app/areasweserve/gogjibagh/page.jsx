import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/gogjibagh");

import GogjibaghClient from './GogjibaghClient';

export default function GogjibaghPage() {
  return <GogjibaghClient />;
}
