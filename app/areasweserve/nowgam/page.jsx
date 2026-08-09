import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/nowgam");

import NowgamClient from './NowgamClient';

export default function NowgamPage() {
  return <NowgamClient />;
}
