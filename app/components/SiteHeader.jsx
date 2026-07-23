'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

// Add any other route paths here that should NOT show the global navbar
const NO_HEADER_ROUTES = ['/landing'];

export default function SiteHeader() {
  const pathname = usePathname();
  if (NO_HEADER_ROUTES.includes(pathname)) return null;
  return <Header />;
}