import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/areasweserve/panthachowk");

import PanthaChowkClient from './PanthaChowkClient';

export default function PanthaChowkPage() {
  return <PanthaChowkClient />;
}
