import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/blog");

import BlogsClient from './BlogClient';

export default function BlogsPage() {
  return <BlogsClient />;
}
