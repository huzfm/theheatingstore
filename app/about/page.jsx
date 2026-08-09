import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/about");

import AboutClient from './AboutClient';

export default function AboutSectionPremium() {
  return <AboutClient />;
}
