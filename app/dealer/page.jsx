import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/dealer");

import DealerClient from './DealerClient';

export default function DealerPage() {
  return <DealerClient />;
}
