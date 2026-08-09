import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/bloginfo");

import ProjectFeaturesClient from './ProjectFeaturesClient';

export default function ProjectFeatures() {
  return <ProjectFeaturesClient />;
}
