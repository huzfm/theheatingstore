'use client';

/**
 * Header.jsx, flat, full-width bar (ProWarm-style layout), restyled from
 * the earlier floating-pill version. All functionality is unchanged:
 * primary nav, "More pages" dropdown, ⌘K search modal, mobile drawer.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, X, ChevronDown, ArrowRight, Menu } from 'lucide-react';

/* ---------- NAV DATA ---------- */

const PRIMARY_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/product' },
  { label: 'Installation', href: '/installation' },
];

const MORE_NAV = [
  { label: 'Why Choose Us', href: '/why-choose-us' },
  { label: 'How It Works', href: '/how-it-works' },
  // The physics of the system (floor layers + thermostat), as distinct from
  // /how-it-works, which covers the installation process.
  { label: 'Working', href: '/working' },
  { label: 'Blog & Articles', href: '/bloginfo' },
  { label: 'Local Experience', href: '/local-experience' },
  { label: 'Global Experience', href: '/global-experience' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Measure-Up', href: '/measuring-up' },
  { label: 'Contact', href: '/contact' },
];

const SEARCH_ITEMS = [
  { label: 'Products', href: '/product' },
  { label: 'Installation', href: '/installation' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Working', href: '/working' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Why Choose Us', href: '/why-choose-us' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Blog & Articles', href: '/bloginfo' },
  { label: 'Warranty Check', href: '/warranty-check' },
  { label: 'Measure-Up', href: '/measuring-up' },
  { label: 'Local Experience', href: '/local-experience' },
  { label: 'Global Experience', href: '/global-experience' },
];

const HIDE_ON = ['/SpaceVerification'];

/* ---------- COLORS ---------- */

const C = {
  warmOrange: '#E8933A',
  warmAccent: '#B86B45',
  textPrimary: 'rgba(255,255,255,0.96)',
  textSecondary: 'rgba(255,255,255,0.62)',
  textMuted: 'rgba(255,255,255,0.4)',
  glassBg: 'rgba(20,17,15,0.85)',
  glassBorder: 'rgba(255,255,255,0.10)',
};

/* ---------- BrandMark (inline) ---------- */

// function BrandMark({ compact = false }) {
//   const logoHeight = compact ? 74 : 150;
//   return (
//     <Link
//       href="/"
//       aria-label="TheHeatingStore, Home"
//       style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
//     >
//       {/* width/height are the image's real intrinsic dimensions, Next/Image
//           needs these to reserve layout space. If your file's actual aspect
//           ratio differs, adjust these two numbers to match it; the CSS below
//           just scales proportionally from whatever you set here. */}
//       <Image
//         src="/images/ll.png"
//         alt="TheHeatingStore"
//         width={220}
//         height={logoHeight}
//         priority
//         style={{ height: logoHeight, width: 'auto', maxWidth: 'none', objectFit: 'contain' }}
//       />
//     </Link>
//   );
// }
function BrandMark({ compact = false }) {
  const navRowHeight = compact ? 74 : 60; // fixed — matches current nav content height, doesn't change
  const logoHeight = compact ? 74 : 150;  // grow this freely, it will overflow the wrapper

  return (
    <Link
      href="/"
      aria-label="TheHeatingStore, Home"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: navRowHeight,   // fixed box — this is what the nav's flex height sees
        flexShrink: 0,
        textDecoration: 'none',
      }}
    >
      <Image
        src="/images/ll.png"
        alt="TheHeatingStore"
        width={220}
        height={logoHeight}
        priority
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)', // vertically centered, overflows top/bottom freely
          height: logoHeight,
          width: 'auto',
          maxWidth: 'none',
          objectFit: 'contain',
        }}
      />
    </Link>
  );
}

/* ---------- SearchModal (inline, unchanged) ---------- */

function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;
    return SEARCH_ITEMS.filter((it) => it.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '12vh 16px 16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 600,
              borderRadius: 16,
              background: C.glassBg,
              border: `1px solid ${C.glassBorder}`,
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 20px',
                borderBottom: `1px solid ${C.glassBorder}`,
              }}
            >
              <Search size={18} color={C.warmOrange} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages…"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: C.textPrimary,
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              />
              <kbd
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  padding: '3px 7px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${C.glassBorder}`,
                  color: C.textSecondary,
                }}
              >
                ESC
              </kbd>
              <button
                onClick={onClose}
                aria-label="Close search"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.textSecondary,
                  padding: 4,
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
              {results.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    color: C.textMuted,
                    fontFamily: "var(--font-body)",
                    fontSize: 13.5,
                  }}
                >
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      color: C.textPrimary,
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'background 0.18s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Search size={14} color={C.textMuted} />
                      {item.label}
                    </span>
                    <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "var(--font-body)" }}>
                      {item.href}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- MobileMenu (inline, unchanged) ---------- */

function MobileMenu({ open, onClose, pathname, onSearchOpen }) {
  const [moreExpanded, setMoreExpanded] = useState(false);

  useEffect(() => {
    onClose();
    setMoreExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    } else {
      setMoreExpanded(false);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            maxHeight: 'calc(100vh - 88px)',
            overflowY: 'auto',
            background: C.glassBg,
            borderBottom: `1px solid ${C.glassBorder}`,
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
            zIndex: 9998,
            padding: '16px 20px 20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PRIMARY_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 12px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: active ? 600 : 500,
                    color: active ? C.warmOrange : C.textPrimary,
                    background: active ? 'rgba(232,147,58,0.08)' : 'transparent',
                    transition: 'background 0.18s ease',
                  }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} color={C.textMuted} />
                </Link>
              );
            })}

            <button
              onClick={() => setMoreExpanded((v) => !v)}
              aria-expanded={moreExpanded}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 12px',
                marginTop: 4,
                borderRadius: 12,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 500,
                color: moreExpanded ? C.textPrimary : C.textSecondary,
              }}
            >
              <span>More pages</span>
              <ChevronDown
                size={16}
                color={C.textMuted}
                style={{ transition: 'transform 0.22s ease', transform: moreExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            <AnimatePresence initial={false}>
              {moreExpanded && (
                <motion.div
                  key="more-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                    {MORE_NAV.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 12px 12px 20px',
                            borderRadius: 12,
                            textDecoration: 'none',
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            fontWeight: active ? 600 : 500,
                            color: active ? C.warmOrange : C.textSecondary,
                            background: active ? 'rgba(232,147,58,0.08)' : 'transparent',
                          }}
                        >
                          <span>{item.label}</span>
                          <ArrowRight size={14} color={C.textMuted} />
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${C.glassBorder}`,
            }}
          >
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onSearchOpen(), 120);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${C.glassBorder}`,
                color: C.textPrimary,
                cursor: 'pointer',
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <Search size={16} color={C.warmOrange} />
              Search
            </button>

            <Link
              href="/contact"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 20px',
                borderRadius: 999,
                background: `linear-gradient(135deg, ${C.warmOrange}, ${C.warmAccent})`,
                color: '#fff',
                textDecoration: 'none',
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(232,147,58,0.32)',
              }}
            >
              Book Installation
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- NavLinks, ProWarm style: centered, dot-indicator, "More" dropdown ---------- */

function NavLinks({ pathname }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const isActive = useCallback(
    (href) => (href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(href + '/')),
    [pathname]
  );

  const moreActive = MORE_NAV.some((n) => isActive(n.href));

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [moreOpen]);

  useEffect(() => setMoreOpen(false), [pathname]);

  const itemStyle = (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  });

  const linkStyle = (active) => ({
    textDecoration: 'none',
    fontFamily: "var(--font-body)",
    fontSize: 12.5,
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: active ? C.textPrimary : C.textSecondary,
    transition: 'color 0.25s ease',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  });

  const dotStyle = (active) => ({
    width: 4,
    height: 4,
    borderRadius: 999,
    background: active ? C.warmOrange : 'transparent',
    transition: 'background 0.25s ease',
  });

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 34 }}>
      {PRIMARY_NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <div key={item.href} style={itemStyle(active)}>
            <Link
              href={item.href}
              style={linkStyle(active)}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = C.textSecondary;
              }}
            >
              {item.label}
            </Link>
            <span aria-hidden style={dotStyle(active)} />
          </div>
        );
      })}

      {/* More pages dropdown */}
      <div ref={moreRef} style={{ position: 'relative' }}>
        <div style={itemStyle(moreActive)}>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            style={{ ...linkStyle(moreActive), display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            More
            <ChevronDown
              size={12}
              style={{ transition: 'transform 0.25s ease', transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          <span aria-hidden style={dotStyle(moreActive)} />
        </div>

        <AnimatePresence>
          {moreOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 18px)',
                left: '50%',
                transform: 'translateX(-50%)',
                minWidth: 220,
                borderRadius: 14,
                background: C.glassBg,
                border: `1px solid ${C.glassBorder}`,
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.5)',
                padding: 8,
              }}
            >
              {MORE_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      color: active ? C.warmOrange : C.textPrimary,
                      background: active ? 'rgba(232,147,58,0.08)' : 'transparent',
                      transition: 'background 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Main Header, flat, full-width bar ---------- */

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (HIDE_ON.some((p) => pathname === p || pathname?.startsWith(p + '/'))) {
    return null;
  }

  return (
    <>
      <header style={{ position: 'absolute', insetInline: 0, top: 0, zIndex: 9999 }}>
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            transition: 'background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
            background: scrolled
              ? C.glassBg
              : 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)',
            borderBottom: 'none',
            backdropFilter: scrolled ? 'blur(28px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(28px)' : 'none',
            boxShadow: 'none',
          }}
        >
          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <BrandMark />
          </div>

          {/* Centered desktop nav */}
          <div
            className="eh-desktop-only"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <NavLinks pathname={pathname} />
          </div>

          {/* Right cluster */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            

            <Link
              href="/contact"
              className="cta-btn eh-desktop-only"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 22px',
                borderRadius: 999,
                background: `linear-gradient(135deg, ${C.warmOrange}, ${C.warmAccent})`,
                color: '#fff',
                textDecoration: 'none',
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 6px 18px rgba(232,147,58,0.32)',
              }}
            >
              Book Installation
              <ArrowRight size={14} />
              <span aria-hidden className="cta-shine" />
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="icon-btn eh-mobile-only"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${C.glassBorder}`,
                color: C.textPrimary,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </motion.nav>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
