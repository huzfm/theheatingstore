import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/heatingequipmentsupplier");

import HeatingEquipmentClient from './HeatingEquipmentClient';

/* The hand-written LocalBusiness that lived here is gone. The root layout
   now emits one LocalBusiness for the whole site from content/facts.ts, and
   this copy carried no @id, so it declared a SECOND, rival business at the
   same address instead of adding to the first. */

export default function HeatingEquipmentPage() {
  return (
    <>
      <HeatingEquipmentClient />
    </>
  );
}
