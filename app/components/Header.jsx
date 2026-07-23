


// 'use client';

// /**
//  * Header.jsx — single-file floating pill navbar.
//  * No external sub-component imports. All sections inlined.
//  */

// import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
// import { Search, X, ChevronDown, ArrowRight, Menu } from 'lucide-react';

// /* ---------- NAV DATA ---------- */

// const PRIMARY_NAV = [
//   { label: 'Home', href: '/' },
//   { label: 'About', href: '/AboutSection' },
//   { label: 'Products', href: '/product' },
//   { label: 'Installation', href: '/installation' },
// ];

// const MORE_NAV = [
//   { label: 'Why Choose Us', href: '/why-choose-us' },
//   { label: 'How It Works', href: '/how-it-works' },
//   { label: 'Blog & Articles', href: '/bloginfo' },
//   { label: 'Local Experience', href: '/local-experience' },
//   { label: 'Global Experience', href: '/global-experience' },
//   { label: 'Certifications', href: '/certifications' },
//   { label: 'Measure-Up', href: '/measuring-up' },
//   { label: 'Contact', href: '/contact' },
// ];

// const SEARCH_ITEMS = [
//   { label: 'Products', href: '/product' },
//   { label: 'Installation', href: '/installation' },
//   { label: 'How It Works', href: '/how-it-works' },
//   { label: 'About Us', href: '/AboutSection' },
//   { label: 'Contact', href: '/contact' },
//   { label: 'Why Choose Us', href: '/why-choose-us' },
//   { label: 'Certifications', href: '/certifications' },
//   { label: 'Blog & Articles', href: '/bloginfo' },
//   { label: 'Warranty Check', href: '/warranty-check' },
//   { label: 'Measure-Up', href: '/measuring-up' },
//   { label: 'Local Experience', href: '/local-experience' },
//   { label: 'Global Experience', href: '/global-experience' },
// ];

// const HIDE_ON = ['/SpaceVerification'];

// /* ---------- COLORS (JS mirrors of CSS vars for inline use) ---------- */

// const C = {
//   warmOrange: '#E8933A',
//   warmAccent: '#B86B45',
//   textPrimary: 'rgba(255,255,255,0.96)',
//   textSecondary: 'rgba(255,255,255,0.62)',
//   textMuted: 'rgba(255,255,255,0.4)',
//   glassBg: 'rgba(10,10,10,0.75)',
//   glassBorder: 'rgba(255,255,255,0.1)',
//   pillBg: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
// };

// /* ---------- BrandMark (inline) ---------- */

// function BrandMark({ compact = false }) {
//   return (
//     <Link
//   href="/"
//   aria-label="TheHeatingStore — Home"
//   style={{
//     display: 'flex',
//     alignItems: 'center',
//     textDecoration: 'none',
//     flexShrink: 0,
//     padding: '0 4px',
//   }}
// >
//   <span style={{
//     fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
//     fontSize: compact ? 18 : 22,
//     letterSpacing: '0.04em',
//     whiteSpace: 'nowrap',
//     display: 'flex',
//     alignItems: 'baseline',
//   }}>
//     <span style={{ fontWeight: 400, color: 'rgba(251, 242, 242, 1)' }}>The</span>
//     <span style={{ fontWeight: 700, color: '#E8933A' }}> Heating</span>
//     <span style={{ fontWeight: 400, color: 'rgba(255, 255, 255, 0.97)' }}>Store</span>
//   </span>
// </Link>
//   );
// }

// /* ---------- SearchModal (inline) ---------- */

// function SearchModal({ open, onClose }) {
//   const [query, setQuery] = useState('');
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setQuery('');
//       setTimeout(() => inputRef.current?.focus(), 60);
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [open, onClose]);

//   const results = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return SEARCH_ITEMS;
//     return SEARCH_ITEMS.filter((it) => it.label.toLowerCase().includes(q));
//   }, [query]);

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.18 }}
//           onClick={onClose}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             background: 'rgba(0,0,0,0.7)',
//             backdropFilter: 'blur(8px)',
//             WebkitBackdropFilter: 'blur(8px)',
//             zIndex: 10001,
//             display: 'flex',
//             alignItems: 'flex-start',
//             justifyContent: 'center',
//             paddingTop: '12vh',
//             padding: '12vh 16px 16px',
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, y: -16, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -16, scale: 0.98 }}
//             transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: '100%',
//               maxWidth: 600,
//               borderRadius: 20,
//               background: C.glassBg,
//               border: `1px solid ${C.glassBorder}`,
//               backdropFilter: 'blur(32px)',
//               WebkitBackdropFilter: 'blur(32px)',
//               boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
//               overflow: 'hidden',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 12,
//                 padding: '18px 20px',
//                 borderBottom: `1px solid ${C.glassBorder}`,
//               }}
//             >
//               <Search size={18} color={C.warmOrange} />
//               <input
//                 ref={inputRef}
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search pages…"
//                 style={{
//                   flex: 1,
//                   background: 'transparent',
//                   border: 'none',
//                   outline: 'none',
//                   color: C.textPrimary,
//                   fontFamily: "'DM Sans', system-ui, sans-serif",
//                   fontSize: 16,
//                   fontWeight: 500,
//                 }}
//               />
//               <kbd
//                 style={{
//                   fontFamily: "'DM Sans', system-ui, sans-serif",
//                   fontSize: 11,
//                   padding: '3px 7px',
//                   borderRadius: 6,
//                   background: 'rgba(255,255,255,0.06)',
//                   border: `1px solid ${C.glassBorder}`,
//                   color: C.textSecondary,
//                 }}
//               >
//                 ESC
//               </kbd>
//               <button
//                 onClick={onClose}
//                 aria-label="Close search"
//                 style={{
//                   background: 'transparent',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: C.textSecondary,
//                   padding: 4,
//                   display: 'flex',
//                 }}
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
//               {results.length === 0 ? (
//                 <div
//                   style={{
//                     padding: 24,
//                     textAlign: 'center',
//                     color: C.textMuted,
//                     fontFamily: "'DM Sans', system-ui, sans-serif",
//                     fontSize: 13.5,
//                   }}
//                 >
//                   No results for &ldquo;{query}&rdquo;
//                 </div>
//               ) : (
//                 results.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     onClick={onClose}
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between',
//                       padding: '12px 14px',
//                       borderRadius: 12,
//                       textDecoration: 'none',
//                       color: C.textPrimary,
//                       fontFamily: "'DM Sans', system-ui, sans-serif",
//                       fontSize: 14,
//                       fontWeight: 500,
//                       transition: 'background 0.18s ease',
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.background = 'transparent')
//                     }
//                   >
//                     <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                       <Search size={14} color={C.textMuted} />
//                       {item.label}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 11,
//                         color: C.textMuted,
//                         fontFamily: "'DM Sans', system-ui, sans-serif",
//                       }}
//                     >
//                       {item.href}
//                     </span>
//                   </Link>
//                 ))
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /* ---------- MobileMenu (inline) ---------- */

// function MobileMenu({ open, onClose, pathname, onSearchOpen }) {
//   const [moreExpanded, setMoreExpanded] = useState(false);

//   // Close on route change
//   useEffect(() => {
//     onClose();
//     setMoreExpanded(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [open, onClose]);

//   useEffect(() => {
//     if (open) {
//       const original = document.body.style.overflow;
//       document.body.style.overflow = 'hidden';
//       return () => {
//         document.body.style.overflow = original;
//       };
//     } else {
//       setMoreExpanded(false);
//     }
//   }, [open]);

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
//           style={{
//             position: 'fixed',
//             top: 76,
//             left: 12,
//             right: 12,
//             maxHeight: 'calc(100vh - 88px)',
//             overflowY: 'auto',
//             borderRadius: 24,
//             background: C.glassBg,
//             border: `1px solid ${C.glassBorder}`,
//             backdropFilter: 'blur(32px)',
//             WebkitBackdropFilter: 'blur(32px)',
//             boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
//             zIndex: 9998,
//             padding: 16,
//           }}
//         >
//           <div
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 24,
//               right: 24,
//               height: 1,
//               background:
//                 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
//               pointerEvents: 'none',
//             }}
//           />

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
//             {PRIMARY_NAV.map((item) => {
//               const active = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={onClose}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     padding: '14px 16px',
//                     borderRadius: 14,
//                     textDecoration: 'none',
//                     fontFamily: "'DM Sans', system-ui, sans-serif",
//                     fontSize: 15,
//                     fontWeight: active ? 600 : 500,
//                     color: active ? C.warmOrange : C.textPrimary,
//                     background: active ? 'rgba(232,147,58,0.08)' : 'transparent',
//                     transition: 'background 0.18s ease',
//                   }}
//                 >
//                   <span>{item.label}</span>
//                   <ArrowRight size={16} color={C.textMuted} />
//                 </Link>
//               );
//             })}

//             {/* Collapsible "More" toggle for the rest of the pages */}
//             <button
//               onClick={() => setMoreExpanded((v) => !v)}
//               aria-expanded={moreExpanded}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 padding: '14px 16px',
//                 marginTop: 4,
//                 borderRadius: 14,
//                 background: 'transparent',
//                 border: 'none',
//                 cursor: 'pointer',
//                 width: '100%',
//                 textAlign: 'left',
//                 fontFamily: "'DM Sans', system-ui, sans-serif",
//                 fontSize: 15,
//                 fontWeight: 500,
//                 color: moreExpanded ? C.textPrimary : C.textSecondary,
//               }}
//             >
//               <span>More pages</span>
//               <ChevronDown
//                 size={16}
//                 color={C.textMuted}
//                 style={{
//                   transition: 'transform 0.22s ease',
//                   transform: moreExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
//                 }}
//               />
//             </button>

//             <AnimatePresence initial={false}>
//               {moreExpanded && (
//                 <motion.div
//                   key="more-panel"
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: 'auto', opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
//                   style={{ overflow: 'hidden' }}
//                 >
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
//                     {MORE_NAV.map((item) => {
//                       const active = pathname === item.href;
//                       return (
//                         <Link
//                           key={item.href}
//                           href={item.href}
//                           onClick={onClose}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                             padding: '12px 16px 12px 24px',
//                             borderRadius: 14,
//                             textDecoration: 'none',
//                             fontFamily: "'DM Sans', system-ui, sans-serif",
//                             fontSize: 14,
//                             fontWeight: active ? 600 : 500,
//                             color: active ? C.warmOrange : C.textSecondary,
//                             background: active ? 'rgba(232,147,58,0.08)' : 'transparent',
//                             transition: 'background 0.18s ease',
//                           }}
//                         >
//                           <span>{item.label}</span>
//                           <ArrowRight size={14} color={C.textMuted} />
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 10,
//               marginTop: 14,
//               paddingTop: 14,
//               borderTop: `1px solid ${C.glassBorder}`,
//             }}
//           >
//             <button
//               onClick={() => {
//                 onClose();
//                 setTimeout(() => onSearchOpen(), 120);
//               }}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 10,
//                 padding: '12px 16px',
//                 borderRadius: 14,
//                 background: 'rgba(255,255,255,0.04)',
//                 border: `1px solid ${C.glassBorder}`,
//                 color: C.textPrimary,
//                 cursor: 'pointer',
//                 fontFamily: "'DM Sans', system-ui, sans-serif",
//                 fontSize: 14,
//                 fontWeight: 500,
//               }}
//             >
//               <Search size={16} color={C.warmOrange} />
//               Search
//             </button>

//             <Link
//               href="/contact"
//               onClick={onClose}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: 8,
//                 padding: '14px 20px',
//                 borderRadius: 999,
//                 background: `linear-gradient(135deg, ${C.warmOrange}, ${C.warmAccent})`,
//                 color: '#fff',
//                 textDecoration: 'none',
//                 fontFamily: "'DM Sans', system-ui, sans-serif",
//                 fontSize: 14,
//                 fontWeight: 600,
//                 boxShadow: '0 8px 24px rgba(232,147,58,0.32)',
//               }}
//             >
//               Book Installation
//               <ArrowRight size={16} />
//             </Link>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /* ---------- NavLinks (inline) ---------- */

// function NavLinks({ pathname }) {
//   const containerRef = useRef(null);
//   const linkRefs = useRef({});
//   const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

//   const isActive = useCallback(
//     (href) => {
//       if (href === '/') return pathname === '/';
//       return pathname === href || pathname?.startsWith(href + '/');
//     },
//     [pathname]
//   );

//   useEffect(() => {
//     const active = PRIMARY_NAV.find((n) => isActive(n.href));
//     if (!active || !containerRef.current) {
//       setIndicator((p) => ({ ...p, opacity: 0 }));
//       return;
//     }
//     const el = linkRefs.current[active.href];
//     if (!el) {
//       setIndicator((p) => ({ ...p, opacity: 0 }));
//       return;
//     }
//     const cRect = containerRef.current.getBoundingClientRect();
//     const eRect = el.getBoundingClientRect();
//     setIndicator({
//       left: eRect.left - cRect.left,
//       width: eRect.width,
//       opacity: 1,
//     });
//   }, [pathname, isActive]);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: 'relative',
//         display: 'flex',
//         alignItems: 'center',
//         gap: 2,
//         padding: '0 6px',
//       }}
//     >
//       <motion.div
//         animate={indicator}
//         transition={{ type: 'spring', stiffness: 320, damping: 30 }}
//         style={{
//           position: 'absolute',
//           top: 6,
//           bottom: 6,
//           left: indicator.left,
//           width: indicator.width,
//           borderRadius: 999,
//           background: 'rgba(255,255,255,0.08)',
//           border: '1px solid rgba(255,255,255,0.06)',
//           opacity: indicator.opacity,
//           pointerEvents: 'none',
//         }}
//       />

//       {PRIMARY_NAV.map((item) => {
//         const active = isActive(item.href);
//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//             ref={(el) => {
//               if (el) linkRefs.current[item.href] = el;
//             }}
//             style={{
//               position: 'relative',
//               zIndex: 1,
//               padding: '8px 16px',
//               borderRadius: 999,
//               textDecoration: 'none',
//               fontFamily: "'DM Sans', system-ui, sans-serif",
//               fontSize: 13.5,
//               fontWeight: active ? 600 : 500,
//               color: active ? C.textPrimary : C.textSecondary,
//               transition: 'color 0.22s ease',
//               whiteSpace: 'nowrap',
//             }}
//             onMouseEnter={(e) => {
//               if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
//             }}
//             onMouseLeave={(e) => {
//               if (!active) e.currentTarget.style.color = C.textSecondary;
//             }}
//           >
//             {item.label}
//           </Link>
//         );
//       })}
//     </div>
//   );
// }

// /* ---------- Main Header ---------- */

// export default function Header() {
//   const pathname = usePathname();
//   const [scrolled, setScrolled] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const { scrollY } = useScroll();

//   useMotionValueEvent(scrollY, 'change', (latest) => {
//     setScrolled(latest > 12);
//   });

//   // ⌘K / Ctrl-K opens search
//   useEffect(() => {
//     const onKey = (e) => {
//       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
//         e.preventDefault();
//         setSearchOpen(true);
//       }
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   if (HIDE_ON.some((p) => pathname === p || pathname?.startsWith(p + '/'))) {
//     return null;
//   }

//   const pillHeight = scrolled ? 58 : 68;
//   const pillBlur = scrolled ? 'blur(40px)' : 'blur(32px)';

//   return (
//     <>
//       <style jsx global>{`
//         @media (max-width: 767px) {
//           .eh-pill-desktop {
//             display: none !important;
//           }
//         }
//         @media (min-width: 768px) {
//           .eh-pill-mobile-btn {
//             display: none !important;
//           }
//         }
//       `}</style>

//       <motion.div
//         initial={{ opacity: 0, y: -14 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
//         style={{
//           position: 'fixed',
//           top: 14,
//           left: 0,
//           right: 0,
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           zIndex: 9999,
//           pointerEvents: 'none',
//         }}
//       >
//         <motion.div
//           animate={{
//             height: pillHeight,
//           }}
//           transition={{ type: 'spring', stiffness: 320, damping: 30 }}
//           className="eh-pill-desktop"
//           style={{
//             pointerEvents: 'auto',
//             width: 'fit-content',
//             minWidth: 620,
//             maxWidth: '92vw',
//             padding: '0 8px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 4,
//             borderRadius: 999,
//             background: `${C.pillBg}, ${C.glassBg}`,
//             border: `1px solid ${C.glassBorder}`,
//             backdropFilter: pillBlur,
//             WebkitBackdropFilter: pillBlur,
//             boxShadow: `
//               0 12px 40px rgba(0,0,0,0.45),
//               0 0 0 1px rgba(255,255,255,0.04) inset,
//               0 0 60px rgba(255,160,80,0.08)
//             `,
//             position: 'relative',
//           }}
//         >
//           {/* Top edge light streak */}
//           <div
//             aria-hidden
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 24,
//               right: 24,
//               height: 1,
//               background:
//                 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
//               pointerEvents: 'none',
//               borderTopLeftRadius: 999,
//               borderTopRightRadius: 999,
//             }}
//           />

//           {/* Brand */}
//           <BrandMark />

//           {/* Vertical divider */}
//           <span
//             aria-hidden
//             style={{
//               width: 1,
//               height: 22,
//               background: C.glassBorder,
//               margin: '0 6px',
//             }}
//           />

//           {/* Nav links (only 4 core pages) */}
//           <NavLinks pathname={pathname} />

//           {/* Vertical divider */}
//           <span
//             aria-hidden
//             style={{
//               width: 1,
//               height: 22,
//               background: C.glassBorder,
//               margin: '0 6px',
//             }}
//           />

//           {/* Search button */}
//           <button
//             onClick={() => setSearchOpen(true)}
//             aria-label="Open search"
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: 8,
//               padding: '8px 12px 8px 12px',
//               borderRadius: 999,
//               background: 'rgba(255,255,255,0.04)',
//               border: `1px solid ${C.glassBorder}`,
//               color: C.textSecondary,
//               cursor: 'pointer',
//               fontFamily: "'DM Sans', system-ui, sans-serif",
//               fontSize: 12.5,
//               fontWeight: 500,
//               transition: 'color 0.22s ease, background 0.22s ease, border-color 0.22s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.color = C.textPrimary;
//               e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
//               e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.color = C.textSecondary;
//               e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
//               e.currentTarget.style.borderColor = C.glassBorder;
//             }}
//           >
//             <Search size={14} />
//             <span>Search</span>
//             <kbd
//               style={{
//                 fontFamily: "'DM Sans', system-ui, sans-serif",
//                 fontSize: 10,
//                 padding: '1px 5px',
//                 borderRadius: 4,
//                 background: 'rgba(255,255,255,0.06)',
//                 color: C.textMuted,
//                 marginLeft: 2,
//               }}
//             >
//               ⌘K
//             </kbd>
//           </button>

//           {/* CTA */}
//           <Link
//             href="/contact"
//             style={{
//               marginLeft: 4,
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: 6,
//               padding: '10px 20px',
//               borderRadius: 999,
//               background: `linear-gradient(135deg, ${C.warmOrange}, ${C.warmAccent})`,
//               color: '#fff',
//               textDecoration: 'none',
//               fontFamily: "'DM Sans', system-ui, sans-serif",
//               fontSize: 13,
//               fontWeight: 600,
//               letterSpacing: '0.01em',
//               boxShadow:
//                 '0 6px 18px rgba(232,147,58,0.32), 0 0 0 1px rgba(255,255,255,0.06) inset',
//               transition: 'transform 0.22s ease, filter 0.22s ease, box-shadow 0.22s ease',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.filter = 'brightness(1.1)';
//               e.currentTarget.style.transform = 'scale(1.02)';
//               e.currentTarget.style.boxShadow =
//                 '0 10px 24px rgba(232,147,58,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.filter = 'brightness(1)';
//               e.currentTarget.style.transform = 'scale(1)';
//               e.currentTarget.style.boxShadow =
//                 '0 6px 18px rgba(232,147,58,0.32), 0 0 0 1px rgba(255,255,255,0.06) inset';
//             }}
//           >
//             Book Installation
//             <ArrowRight size={14} />
//           </Link>
//         </motion.div>

//         {/* Mobile floating compact pill (logo + hamburger) */}
//         <motion.div
//           animate={{ height: 56 }}
//           className="eh-pill-mobile-btn"
//           style={{
//             pointerEvents: 'auto',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             gap: 8,
//             padding: '0 6px 0 6px',
//             borderRadius: 999,
//             background: `${C.pillBg}, ${C.glassBg}`,
//             border: `1px solid ${C.glassBorder}`,
//             backdropFilter: 'blur(32px)',
//             WebkitBackdropFilter: 'blur(32px)',
//             boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 60px rgba(255,160,80,0.08)',
//             position: 'absolute',
//             top: 0,
//             left: 12,
//             right: 12,
//             minWidth: 0,
//             maxWidth: '100%',
//           }}
//         >
//           <BrandMark compact={true} />
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//             <button
//               onClick={() => setSearchOpen(true)}
//               aria-label="Open search"
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 999,
//                 background: 'rgba(255,255,255,0.04)',
//                 border: `1px solid ${C.glassBorder}`,
//                 color: C.textPrimary,
//                 cursor: 'pointer',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <Search size={16} />
//             </button>
//             <button
//               onClick={() => setMobileOpen((v) => !v)}
//               aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//               aria-expanded={mobileOpen}
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 999,
//                 background: 'rgba(255,255,255,0.04)',
//                 border: `1px solid ${C.glassBorder}`,
//                 color: C.textPrimary,
//                 cursor: 'pointer',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 position: 'relative',
//               }}
//             >
//               <span
//                 style={{
//                   display: 'inline-block',
//                   width: 16,
//                   height: 12,
//                   position: 'relative',
//                 }}
//               >
//                 <span
//                   style={{
//                     position: 'absolute',
//                     left: 0,
//                     right: 0,
//                     top: mobileOpen ? 5 : 1,
//                     height: 1.6,
//                     background: C.textPrimary,
//                     borderRadius: 1,
//                     transform: mobileOpen ? 'rotate(45deg)' : 'rotate(0deg)',
//                     transition: 'top 0.22s ease, transform 0.22s ease',
//                   }}
//                 />
//                 <span
//                   style={{
//                     position: 'absolute',
//                     left: 0,
//                     right: 0,
//                     top: 5,
//                     height: 1.6,
//                     background: C.textPrimary,
//                     borderRadius: 1,
//                     opacity: mobileOpen ? 0 : 1,
//                     transition: 'opacity 0.18s ease',
//                   }}
//                 />
//                 <span
//                   style={{
//                     position: 'absolute',
//                     left: 0,
//                     right: 0,
//                     top: mobileOpen ? 5 : 9,
//                     height: 1.6,
//                     background: C.textPrimary,
//                     borderRadius: 1,
//                     transform: mobileOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
//                     transition: 'top 0.22s ease, transform 0.22s ease',
//                   }}
//                 />
//               </span>
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Mobile menu */}
//       <MobileMenu
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         pathname={pathname}
//         onSearchOpen={() => setSearchOpen(true)}
//       />

//       {/* Search modal */}
//       <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
//     </>
//   );
// }

'use client';

/**
 * Header.jsx — flat, full-width bar (ProWarm-style layout), restyled from
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
  { label: 'About', href: '/AboutSection' },
  { label: 'Products', href: '/product' },
  { label: 'Installation', href: '/installation' },
];

const MORE_NAV = [
  { label: 'Why Choose Us', href: '/why-choose-us' },
  { label: 'How It Works', href: '/how-it-works' },
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
  { label: 'About Us', href: '/AboutSection' },
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

function BrandMark({ compact = false }) {
  const logoHeight = compact ? 74 : 70;
  return (
    <Link
      href="/"
      aria-label="TheHeatingStore — Home"
      style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
    >
      {/* width/height are the image's real intrinsic dimensions — Next/Image
          needs these to reserve layout space. If your file's actual aspect
          ratio differs, adjust these two numbers to match it; the CSS below
          just scales proportionally from whatever you set here. */}
      <Image
        src="/images/logos.png"
        alt="TheHeatingStore"
        width={820}
        height={logoHeight}
        priority
        style={{ height: logoHeight, width: 'auto', maxWidth: 'none', objectFit: 'contain' }}
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
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              />
              <kbd
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
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
                    fontFamily: "'DM Sans', system-ui, sans-serif",
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
                      fontFamily: "'DM Sans', system-ui, sans-serif",
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
                    <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
                    fontFamily: "'DM Sans', system-ui, sans-serif",
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
                fontFamily: "'DM Sans', system-ui, sans-serif",
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
                            fontFamily: "'DM Sans', system-ui, sans-serif",
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
                fontFamily: "'DM Sans', system-ui, sans-serif",
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
                fontFamily: "'DM Sans', system-ui, sans-serif",
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

/* ---------- NavLinks — ProWarm style: centered, dot-indicator, "More" dropdown ---------- */

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
    fontFamily: "'DM Sans', system-ui, sans-serif",
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
                      fontFamily: "'DM Sans', system-ui, sans-serif",
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

/* ---------- Main Header — flat, full-width bar ---------- */

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
      <style jsx global>{`
        @media (max-width: 767px) {
          .eh-desktop-only { display: none !important; }
        }
        @media (min-width: 768px) {
          .eh-mobile-only { display: none !important; }
        }
      `}</style>

      <style jsx>{`
        .cta-btn { position: relative; overflow: hidden; }
        .cta-shine {
          position: absolute;
          inset-block: 0;
          left: -50%;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transform: skewX(-12deg) translateX(0%);
          opacity: 0;
          transition: transform 0.7s ease, opacity 0.7s ease;
          pointer-events: none;
        }
        .cta-btn:hover .cta-shine {
          transform: skewX(-12deg) translateX(300%);
          opacity: 1;
        }
        .icon-btn { transition: border-color 0.25s ease, background 0.25s ease; }
        .icon-btn:hover { border-color: rgba(255, 255, 255, 0.4) !important; background: rgba(255, 255, 255, 0.06) !important; }
      `}</style>

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
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="icon-btn"
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
              <Search size={16} />
            </button>

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
                fontFamily: "'DM Sans', system-ui, sans-serif",
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
