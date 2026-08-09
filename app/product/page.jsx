import { pageMetadata } from '@/app/lib/seo';
export const metadata = pageMetadata("/product");

import ProductClient from './ProductClient';

export default function PremiumProductShowcase() {
  return <ProductClient />;
}
