import { pageMetadata } from '@/app/lib/seo';
import MeasuringUpClient from './MeasuringUpClient';

export const metadata = pageMetadata("/measuring-up");

export default function MeasuringUpPage() {
  return <MeasuringUpClient />;
}
