import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/warranty-check");

import WarrantyCheckClient from './WarrantyCheckClient';

export default function WarrantyCheck() {
  return <WarrantyCheckClient />;
}
