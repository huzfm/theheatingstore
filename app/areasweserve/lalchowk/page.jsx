import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/lalchowk");

import LalChowkClient from './LalChowkClient';

export default function LalChowkPage() {
  return <LalChowkClient />;
}
