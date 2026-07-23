'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

// Add any other route paths here that should NOT show the global navbar
const NO_HEADER_ROUTES = ['/landing'];

// Route subtrees with their own full-page chrome (the /experience 3D site
// ships its own dark nav), matched by prefix so nested routes inherit it.
const NO_HEADER_PREFIXES = ['/experience'];

export default function SiteHeader() {
  const pathname = usePathname();
  if (NO_HEADER_ROUTES.includes(pathname)) return null;
  if (NO_HEADER_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  return <Header />;
}