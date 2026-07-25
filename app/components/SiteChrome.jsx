'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides global page furniture (footer, chatbot) on routes that provide their
 * own, currently the /experience 3D site, which has a bespoke dark footer
 * and must not have a light-theme chatbot bubble floating over its canvas.
 *
 * Mirrors the prefix logic in SiteHeader.jsx; kept as a thin client wrapper
 * so app/layout.js stays a server component.
 */
const NO_CHROME_PREFIXES = ['/experience'];

export default function SiteChrome({ children, hidePrefixes = NO_CHROME_PREFIXES }) {
  const pathname = usePathname();
  if (hidePrefixes.some((p) => pathname?.startsWith(p))) return null;
  return <>{children}</>;
}
