import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/heatingequipmentsupplier/heatingsystems");

import HeatingsystemsClient from './HeatingsystemsClient';

export default function HeatingsystemsPage() {
  return <HeatingsystemsClient />;
}
