import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/sonwar");

import SonwarClient from './SonwarClient';

export default function SonwarPage() {
  return <SonwarClient />;
}
