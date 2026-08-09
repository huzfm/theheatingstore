import { pageMetadata } from '@/app/lib/seo';
import WorkingClient from './WorkingClient';

export const metadata = pageMetadata("/working");

export default function WorkingPage() {
  return <WorkingClient />;
}
