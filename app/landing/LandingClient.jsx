'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import Spinner from '@/components/ui/loading/Spinner';
import PendingLabel from '@/components/ui/loading/PendingLabel';
import LocationField from '@/components/ui/LocationField';
import { submitLead, buildGoogleMapsLink } from '@/lib/leads';
import WhyChooseUFH from '../components/WhyChooseUFH';
import FaqSection from '../components/FaqSection';
import Testimonials from '../components/Testimonials';
import TrustVideos from '../components/TrustVideos';
import { scrollToTarget } from '@/hooks/useLenis';
import siteFacts, { yearsInBusiness } from '@/content/facts';

const EASE = [0.16, 1, 0.3, 1];

/**
 * This is the paid-traffic landing page, and it is now built like one.
 *
 * Four sections used to sit below the hero and have been cut:
 *
 *   WhyElectricHamam   a GSAP timeline pinned across eight viewport heights.
 *                      On a cold ad click that is eight screens of scrolling
 *                      the visitor cannot skip before reaching anything, plus
 *                      the whole GSAP + ScrollTrigger stack.
 *   InstallationClient the entire /installation page inlined. A landing page
 *                      should not contain another page.
 *   OurProcess         a five-step carousel restating what the FAQ answers.
 *   TrustVideos        four of its five Cloudinary URLs are still the
 *                      placeholder paths from the setup comment, so it
 *                      rendered broken posters to paid traffic.
 *
 * What is left is the shape that converts a cold click: the offer and the
 * form above the fold, the numbers behind it, proof, the reasons, the
 * objections, and one closing ask. Roughly five screens instead of fourteen.
 * None of those components were modified or deleted, they still render on
 * their own routes.
 */
const NAV_LINKS = [
  { label: 'Reviews', href: '#reviews' },          // Testimonials
  { label: 'Why Us', href: '#why-choose' },        // WhyChooseUFH
  { label: 'FAQ', href: '#faq' },                  // FaqSection
];

const HERO_IMAGES = [
  '/landing/land2.png',
  '/landing/land3.png',
  '/landing/land4.png',
  '/landing/land5.png',
  '/landing/land6.png',
  '/landing/land1.png',
];
const CONTACT = {
  address: 'Srinagar · Anantnag · Baramulla, Kashmir',
  phone1: siteFacts.phoneDisplay,
  phone2: siteFacts.phoneDisplay,
  email: siteFacts.email,
  whatsapp: '919070907035',
};

const STATS = [
  { value: siteFacts.installationsLocal.value, suffix: '+', label: 'Floors warmed' },
  { value: yearsInBusiness(), suffix: '+', label: 'Years installing' },
  { text: siteFacts.installationWarranty, label: 'Warranty' },
  { value: 98, suffix: '%', label: 'Would recommend' }, // NEEDS-REAL-INFO
];

function useRevealRef(amount = 0.2) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView];
}

function useCountUp(target, inView, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function StatCounter({ stat, inView }) {
  // `stat.value` is a number to count up to; `stat.text` is a stat that isn't
  // a number (the warranty, which is the word "Lifetime") and is set as-is.
  const value = useCountUp(stat.text ? 0 : stat.value, inView);
  // Grouped, not raw. The largest figure here is 550,000 and it was rendering
  // as "550000+", which at this size reads as an unformatted number rather
  // than a claim — content/facts.ts writes the same figure as "550,000+".
  return (
    <div className="lp-stat">
      <p className="lp-stat-num">{stat.text ?? `${value.toLocaleString('en-IN')}${stat.suffix}`}</p>
      <p className="lp-stat-label">{stat.label}</p>
    </div>
  );
}

/* ── Hero image carousel ──────────────────────────────────────────── */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="lp-carousel">
      {HERO_IMAGES.map((src, i) => (
        <div key={src} className="lp-slide" style={{ opacity: i === active ? 1 : 0 }}>
          <Image src={src} alt="Underfloor heating installation" fill priority={i === 0} sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
      ))}
      <div className="lp-slide-dots">
        {HERO_IMAGES.map((src, i) => (
          <span key={src} className={`lp-slide-dot ${i === active ? 'is-active' : ''}`} />
        ))}
      </div>
    </div>
  );
}

/* Reads ad-tracking params from the current page URL (works for Meta/Google
   ads that append utm_source, utm_campaign, fbclid, gclid to the link).
   These get folded into the lead's message so the team can see the source
   in the admin panel, since the /api/leads endpoint's own `source` field
   accepts nothing but 'Website Enquiry' from a public form — attribution to a
   paid channel is something only the backend's own ad ingestion may write. */
function getAdTrackingSummary() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmCampaign = params.get('utm_campaign');
  const utmMedium = params.get('utm_medium');
  const fbclid = params.get('fbclid');
  const gclid = params.get('gclid');

  const parts = [];
  if (utmSource) parts.push(`utm_source=${utmSource}`);
  if (utmMedium) parts.push(`utm_medium=${utmMedium}`);
  if (utmCampaign) parts.push(`utm_campaign=${utmCampaign}`);
  if (fbclid) parts.push('via=Meta Ads (fbclid present)');
  if (gclid) parts.push('via=Google Ads (gclid present)');

  return parts.length ? `[${parts.join(', ')}]` : '[Direct / Organic]';
}

/* ── Hero enquiry card ────────────────────────────────────────────── */
function HeroEnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '' });
  /* The plain "Enter your address" text input is now a searchable location
     field: a picked suggestion or a GPS fix carries coordinates and a maps
     link with the lead, which is what a site-visit booking actually needs.
     Typing an address and picking nothing still submits — the API geocodes it
     on arrival. */
  const [place, setPlace] = useState({ address: '', lat: null, lng: null });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        formLabel: 'Landing page enquiry — free site visit',
        notes: [getAdTrackingSummary()],
        place,
      });
      setStatus('sent');
    } catch (err) {
      console.error('Lead submit error:', err);
      setStatus('error');
    }

    // WhatsApp still opens as before, regardless of backend result,
    // so the customer's message always reaches you even if the API is down.
    const mapsLink = buildGoogleMapsLink(place.lat, place.lng);
    const text = [
      "Hi, I'd like a free site visit.",
      `Name: ${form.name}`,
      `Address: ${place.address}`,
      mapsLink && `Map: ${mapsLink}`,
      `Phone: ${form.phone}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.form
      className="lp-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
    >
      <span className="lp-form-eyebrow">
        <span aria-hidden className="lp-dot" />
        No obligation
      </span>
      <h2 className="lp-form-title">Book a Free Site Visit</h2>
      <input required name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="lp-form-input" />
      <LocationField
        variant="light"
        value={place}
        onChange={setPlace}
        required
        placeholder="Enter your address"
      />
      <input required name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" className="lp-form-input" />
      {/* `sent` now disables too. It did not, so after a successful submit the
          button was live again and a second press re-POSTed the same lead and
          opened a second WhatsApp tab. */}
      <button
        type="submit"
        className="lp-form-submit"
        disabled={status === 'sending' || status === 'sent'}
        aria-busy={status === 'sending'}
      >
        <PendingLabel
          pending={status === 'sending'}
          idle="Send Enquiry"
          busy={
            <>
              <Spinner size={15} />
              Sending...
            </>
          }
        />
      </button>
      {status === 'error' && (
        <p className="lp-form-error">
          Lead save had an issue, but your WhatsApp message still went through.
        </p>
      )}
    </motion.form>
  );
}

export default function LandingClient() {
  const heroWrapRef = useRef(null);
  const [heroRef, heroIn] = useRevealRef(0.1);
  const [statsRef, statsIn] = useRevealRef(0.3);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroWrapRef, offset: ['start start', 'end start'] });
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  /**
   * Anchor scrolling, handed to Lenis rather than done around it.
   *
   * This used to call `window.scrollTo({ behavior: 'smooth' })`. The root
   * layout mounts Lenis on every route (SmoothScroll.jsx), and Lenis drives
   * the document's scroll position itself on GSAP's ticker, so a native smooth
   * scroll ran as a second animation against the same scrollTop: the two
   * fought for the position and the jump arrived stuttering, then snapped.
   *
   * `scrollToTarget` uses the live Lenis instance when there is one and falls
   * back to native scrolling when there is not, which is exactly the case on
   * the phones most of this page's ad traffic arrives on, where SmoothScroll
   * disables Lenis on purpose.
   */
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileNavOpen(false);
    const headerEl = document.querySelector('.lp-header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 90;
    scrollToTarget(href, { offset: -(headerHeight + 16) });
  };

  /*
   * The JSON-LD that used to sit here has been removed entirely, on the
   * owner's instruction.
   *
   * It declared a second HomeAndConstructionBusiness for the same company,
   * competing with the LocalBusiness the root layout emits, and it carried
   *
   *     aggregateRating: { ratingValue: '4.8', reviewCount: '50' }
   *
   * Fifty reviews averaging 4.8 stars, with no review source anywhere in this
   * repository, no Google Business Profile behind it, and no Review objects.
   * Fabricated rating markup is the single most reliable way to earn a manual
   * action, and unlike most SEO mistakes it is not recoverable by editing a
   * page. The company entity is described once, from content/facts.ts, in
   * components/seo/schema.js.
   */

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════════════════════════════
           /landing, set in the site's own design system.
           ──────────────────────────────────────────────────────────────
           Every token below is the value the rest of the site already
           uses: the ink/copper/ivory ramp from HomeHero.css, the warm
           orange CTA gradient from Header.jsx, and the #FFF7EF cream the
           FAQ and Testimonials sections sit on. Type is --font-heading
           (Bebas Neue) over --font-body (Hanken Grotesk), both injected
           on <body> by the root layout.

           There is deliberately NO ".lp h1, .lp h2, .lp h3" rule here.
           The old one set every heading under this wrapper in Fraunces,
           which reached into the shared sections this page embeds and
           re-set their headlines in a serif — so /installation, the FAQ
           and Testimonials rendered in one typeface on this route and in
           another everywhere else. Landing-owned headings carry their
           own class instead, and embedded sections keep their own type.
           ══════════════════════════════════════════════════════════════ */

        /* No "html { scroll-behavior: smooth }" here on purpose. Lenis owns
           the scroll on this route and sets "scroll-behavior: auto !important"
           on itself for exactly this reason (see globals.css) — declaring the
           native one as well only means a second animation fighting Lenis for
           the same scrollTop on every anchor jump. */
        .lp {
          --ink: #0a0705;
          --ink-2: #150e08;
          --copper: #a86b3f;
          --copper-light: #c99669;
          --copper-bright: #e7c39b;
          --warm-orange: #E8933A;
          --warm-accent: #B86B45;
          --ivory: #f6f2ec;
          --muted: rgba(246, 242, 236, 0.62);
          --hairline: rgba(246, 242, 236, 0.14);
          --cream: #FFF7EF;

          font-family: var(--font-body);
          background: var(--cream);
          overflow-x: clip;
          box-sizing: border-box;
        }
        .lp *, .lp *::before, .lp *::after { box-sizing: border-box; }

        @media (prefers-reduced-motion: reduce) {
          .lp * { animation: none !important; transition: none !important; }
        }

        /* ── Header ──────────────────────────────────────────────────
           Mirrors app/components/Header.jsx: the same logo lockup, the
           same 12.5px / 0.18em uppercase nav with its copper dot
           indicator, the same gradient pill, the same glass-on-scroll
           bar. The global header is suppressed on this route
           (SiteHeader's NO_HEADER_ROUTES), so this is the only nav the
           page has — it should be indistinguishable from the real one. */
        .lp-header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }

        .lp-topbar {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 9px 24px;
          background: rgba(10, 7, 5, 0.92);
          border-bottom: 1px solid rgba(246, 242, 236, 0.08);
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
        }
        .lp-topbar.hidden { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }
        .lp-topbar-left, .lp-topbar-right { display: flex; align-items: center; gap: 22px; }
        .lp-topbar-linkitem {
          display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
          color: var(--muted); text-decoration: none; transition: color 0.25s ease;
        }
        .lp-topbar-linkitem svg { color: var(--copper-light); }
        .lp-topbar-linkitem:hover { color: var(--ivory); }

        .lp-nav {
          position: relative;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px;
          color: var(--ivory);
          background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 70%, transparent 100%);
          transition: background 0.5s ease, padding 0.5s ease, backdrop-filter 0.5s ease;
        }
        .lp-nav.scrolled {
          padding: 12px 24px;
          background: rgba(20, 17, 15, 0.85);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        .lp-nav-logo {
          position: relative; display: flex; align-items: center;
          height: 60px; flex-shrink: 0; text-decoration: none; z-index: 10;
        }
        .lp-nav-logo img {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          height: 150px; width: auto; max-width: none; object-fit: contain;
        }

        .lp-nav-links {
          position: absolute; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 34px;
        }
        .lp-nav-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .lp-nav-link {
          font-family: var(--font-body);
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.62); text-decoration: none; white-space: nowrap;
          background: none; border: none; padding: 0; cursor: pointer;
          transition: color 0.25s ease;
        }
        .lp-nav-link:hover { color: rgba(255,255,255,0.9); }
        .lp-nav-dot {
          width: 4px; height: 4px; border-radius: 999px;
          background: transparent; transition: background 0.25s ease;
        }
        .lp-nav-item:hover .lp-nav-dot { background: var(--warm-orange); }

        .lp-nav-cta {
          position: relative; z-index: 10;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 999px;
          background: linear-gradient(135deg, var(--warm-orange), var(--warm-accent));
          color: #fff; text-decoration: none;
          font-family: var(--font-body);
          font-size: 12.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          box-shadow: 0 6px 18px rgba(232, 147, 58, 0.32);
          white-space: nowrap;
        }
        .lp-mobile-toggle { display: none; }
        .lp-mobile-panel { display: none; }

        /* ── Hero ────────────────────────────────────────────────────
           Same construction as the home hero: an ink ground carrying its
           own light (copper bloom low-right, ember behind the copy),
           a graded scrim over the plate, and a fine grain across the lot
           so the washes never band. */
        /* Flex + centred, the same construction as .hhero. Without it the
           inner grid sits at the top of a 100vh box and leaves the bottom
           third of the fold empty, which on a landing page reads as the
           offer having stopped rather than the page continuing. */
        .lp-hero {
          position: relative; min-height: 100svh; overflow: hidden;
          display: flex; align-items: center;
          background: var(--ink);
          isolation: isolate;
        }
        .lp-carousel { position: absolute; inset: 0; z-index: 0; }
        .lp-slide { position: absolute; inset: 0; transition: opacity 1.1s ease; }
        /* Right-set, not centred: the scroll cue owns the centre of the hero's
           bottom edge, the same position it holds on the home hero. */
        .lp-slide-dots {
          position: absolute; bottom: 26px; right: clamp(1.25rem, 5vw, 5rem);
          display: flex; gap: 7px; z-index: 4;
        }
        .lp-slide-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(246, 242, 236, 0.3);
          transition: background 0.3s ease, width 0.3s ease;
        }
        .lp-slide-dot.is-active { background: var(--copper-bright); width: 18px; border-radius: 4px; }

        .lp-hero-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(100deg,
              rgba(10, 7, 5, 0.9) 0%,
              rgba(10, 7, 5, 0.74) 32%,
              rgba(10, 7, 5, 0.5) 62%,
              rgba(10, 7, 5, 0.66) 100%),
            linear-gradient(to top,
              rgba(10, 7, 5, 0.96) 0%,
              rgba(10, 7, 5, 0.28) 38%,
              rgba(10, 7, 5, 0) 66%),
            linear-gradient(to bottom,
              rgba(10, 7, 5, 0.75) 0%,
              rgba(10, 7, 5, 0) 26%);
        }
        .lp-hero-glow {
          position: absolute; z-index: 1; pointer-events: none;
          right: -12%; bottom: -22%; width: 78%; height: 72%;
          background: radial-gradient(circle,
            rgba(224, 150, 74, 0.26) 0%,
            rgba(168, 107, 63, 0.12) 40%,
            transparent 68%);
          filter: blur(10px);
          animation: lp-breathe 7s ease-in-out infinite alternate;
        }
        @keyframes lp-breathe { from { opacity: 0.7; } to { opacity: 1; } }
        .lp-grain {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          opacity: 0.22; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .lp-hero-inner {
          position: relative; z-index: 3;
          max-width: 1320px; margin: 0 auto; width: 100%;
          padding: 9.5rem clamp(1.25rem, 5vw, 5rem) 6rem;
          display: grid; grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
          gap: clamp(2rem, 4vw, 4rem); align-items: center;
        }

        /* The maker's line from the home hero: one size, one tracking,
           hierarchy carried by colour alone, closed by a hairline that
           fades out to the right. */
        .lp-eyebrow {
          position: relative;
          display: inline-flex; align-items: center; flex-wrap: wrap;
          gap: 0.35rem 0.85rem; max-width: 100%;
          padding-bottom: 0.85rem;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; line-height: 1.3;
        }
        .lp-eyebrow::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
          background: linear-gradient(90deg,
            rgba(224, 150, 74, 0.45) 0%,
            rgba(246, 242, 236, 0.16) 42%,
            rgba(246, 242, 236, 0) 100%);
        }
        .lp-eyebrow-key { font-weight: 600; color: var(--copper-bright); }
        .lp-eyebrow-sub { min-width: 0; color: rgba(246, 242, 236, 0.72); }
        .lp-eyebrow-sep {
          width: 3px; height: 3px; flex-shrink: 0;
          transform: rotate(45deg); background: rgba(224, 150, 74, 0.7);
        }

        .lp-hero-title {
          margin: 1.6rem 0 0;
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(2.6rem, 4.6vw, 4rem);
          line-height: 0.98; letter-spacing: -0.01em; text-transform: uppercase;
          color: var(--ivory);
        }
        .lp-hero-title .accent {
          background: linear-gradient(100deg,
            var(--copper-light) 0%, var(--copper-bright) 45%, var(--copper) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .lp-hero-sub {
          margin: 1.15rem 0 0; max-width: 34rem;
          font-size: clamp(0.95rem, 1.3vw, 1.08rem); line-height: 1.6;
          font-weight: 400; color: var(--muted);
        }

        /* Buttons, identical geometry to components/ui/HeroCTAs. */
        .lp-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.85rem; margin: 2.2rem 0 0; }
        .lp-btn {
          position: relative;
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.95rem 1.7rem; border-radius: 999px;
          font-family: var(--font-body);
          font-size: 0.92rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em; line-height: 1;
          text-decoration: none; cursor: pointer; border: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease,
            background 0.35s ease, border-color 0.35s ease;
        }
        .lp-btn svg { width: 17px; height: 17px; transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        .lp-btn:hover svg { transform: translateX(4px); }
        .lp-btn-primary {
          color: #1a0f07;
          background: linear-gradient(135deg, #e7c39b, #c99669 55%, #a86b3f);
          box-shadow: 0 10px 30px -8px rgba(200, 120, 55, 0.55), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px -8px rgba(210, 130, 60, 0.7), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .lp-btn-ghost {
          color: var(--ivory);
          background: rgba(246, 242, 236, 0.05);
          border: 1px solid rgba(246, 242, 236, 0.22);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .lp-btn-ghost:hover {
          transform: translateY(-2px);
          background: rgba(246, 242, 236, 0.1); border-color: rgba(246, 242, 236, 0.4);
        }

        /* ── Enquiry card ────────────────────────────────────────────
           The dark-glass surface used by every card on the site
           (.hhero__card / .whc-card / .gec-card), rather than the white
           panel this page used to float over the plate. */
        .lp-form {
          display: flex; flex-direction: column; gap: 12px;
          padding: clamp(1.5rem, 2.4vw, 2rem);
          border-radius: 24px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
            rgba(14, 9, 6, 0.78);
          backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
          border: 1px solid rgba(231, 195, 155, 0.16);
          box-shadow: 0 40px 90px -20px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .lp-form-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(246, 242, 236, 0.55);
        }
        .lp-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: var(--warm-orange); box-shadow: 0 0 8px rgba(232,147,58,0.8);
          animation: lp-blink 2.2s ease-in-out infinite;
        }
        @keyframes lp-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .lp-form-title {
          margin: 0 0 4px;
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(1.5rem, 2.4vw, 1.95rem); line-height: 1;
          letter-spacing: 0.01em; text-transform: uppercase; color: var(--ivory);
        }
        .lp-form-input {
          width: 100%; padding: 13px 15px; border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 7, 5, 0.45);
          font-family: var(--font-body); font-size: 13.5px; color: var(--ivory);
          outline: none; transition: border-color 0.25s ease, background 0.25s ease;
        }
        .lp-form-input::placeholder { color: rgba(246, 242, 236, 0.4); }
        .lp-form-input:focus {
          border-color: rgba(231, 195, 155, 0.55);
          background: rgba(10, 7, 5, 0.65);
        }
        .lp-form-submit {
          margin-top: 4px; width: 100%; padding: 15px;
          border: none; border-radius: 999px; cursor: pointer;
          font-family: var(--font-body); font-weight: 600; font-size: 0.86rem;
          text-transform: uppercase; letter-spacing: 0.08em; line-height: 1;
          color: #1a0f07;
          background: linear-gradient(135deg, #e7c39b, #c99669 55%, #a86b3f);
          box-shadow: 0 10px 30px -8px rgba(200, 120, 55, 0.55), inset 0 1px 0 rgba(255,255,255,0.4);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .lp-form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px -8px rgba(210, 130, 60, 0.7), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .lp-form-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .lp-form-error {
          margin: 2px 0 0; font-size: 12.5px; line-height: 1.5;
          color: var(--copper-bright);
        }

        /* ── Stats ───────────────────────────────────────────────────
           The /about stat row: Bebas figures in copper over hairline
           dividers, sitting on the hero's own ink rather than on a white
           card lifted out of it. */
        .lp-stats {
          position: relative; z-index: 5;
          background: linear-gradient(180deg, var(--ink) 0%, var(--ink-2) 100%);
          border-top: 1px solid var(--hairline);
        }
        .lp-stats-inner {
          max-width: 1320px; margin: 0 auto;
          padding: 46px clamp(1.25rem, 5vw, 5rem);
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .lp-stat {
          text-align: center; padding: 0 12px;
          border-right: 1px solid var(--hairline);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num {
          margin: 0 0 6px;
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(1.9rem, 3.2vw, 2.7rem); line-height: 1;
          letter-spacing: 0.01em; text-transform: uppercase;
          color: var(--copper-bright);
        }
        .lp-stat-label {
          margin: 0;
          font-family: var(--font-body); font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.3;
          color: rgba(246, 242, 236, 0.5);
        }

        /* Scroll cue, the same one the home hero uses: a hairline track with
           a copper pulse running down it. The hero is a full viewport tall and
           the copy only fills its upper two thirds, so without this the lower
           third reads as the section having ended rather than continuing. */
        .lp-cue {
          position: absolute; left: 50%; bottom: 2.6rem; z-index: 3;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          font-size: 0.64rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(246, 242, 236, 0.5);
        }
        .lp-cue-track {
          position: relative; overflow: hidden;
          width: 1px; height: 42px;
          background: linear-gradient(to bottom, rgba(246, 242, 236, 0.4), transparent);
        }
        .lp-cue-track::after {
          content: ''; position: absolute; top: -40%; left: 0;
          width: 100%; height: 40%; background: var(--copper-bright);
          animation: lp-cue 2.2s cubic-bezier(0.7, 0, 0.3, 1) infinite;
        }
        @keyframes lp-cue {
          0%   { transform: translateY(0); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(340%); opacity: 0; }
        }

        .lp-anchor { scroll-margin-top: 110px; }

        /* ── Closing CTA ─────────────────────────────────────────── */
        .lp-final {
          position: relative; overflow: hidden; isolation: isolate;
          padding: clamp(4.5rem, 9vw, 7.5rem) clamp(1.25rem, 5vw, 5rem);
          text-align: center;
          background: linear-gradient(160deg, #1a1008 0%, #2c1810 45%, #3d1f0a 100%);
        }
        .lp-final::before {
          content: ''; position: absolute; z-index: 0; pointer-events: none;
          width: 620px; height: 620px; border-radius: 50%;
          top: -260px; left: 50%; transform: translateX(-50%);
          background: radial-gradient(circle, rgba(196, 98, 58, 0.28), transparent 70%);
        }
        .lp-final-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
        .lp-final-title {
          margin: 1.1rem 0 0;
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(2.4rem, 5.5vw, 4.25rem); line-height: 0.95;
          letter-spacing: 0.005em; text-transform: uppercase; color: var(--ivory);
        }
        .lp-final-title .accent {
          background: linear-gradient(100deg,
            var(--copper-light) 0%, var(--copper-bright) 45%, var(--copper) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .lp-final-sub {
          margin: 1.15rem auto 0; max-width: 34rem;
          font-size: clamp(0.95rem, 1.6vw, 1.08rem); line-height: 1.7; color: var(--muted);
        }
        .lp-final .lp-cta-row { justify-content: center; margin-top: 2.4rem; }

        /* One line, and the only two links in it are a phone number and an
           email address — both of which are the conversion, not an exit. The
           site's four-column footer is suppressed on this route (see
           app/layout.js) precisely so this can be what ends the page. */
        .lp-footer {
          padding: 26px clamp(1.25rem, 5vw, 5rem);
          background: var(--ink);
          border-top: 1px solid var(--hairline);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px 24px;
          font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em;
          color: rgba(246, 242, 236, 0.42);
        }
        .lp-footer a { color: rgba(246, 242, 236, 0.62); text-decoration: none; }
        .lp-footer a:hover { color: var(--copper-bright); }
        .lp-footer-links { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

        .lp-float-whatsapp {
          position: fixed; bottom: 15px; right: 18px; z-index: 90;
          width: 56px; height: 56px; border-radius: 50%;
          background: #25D366; display: flex; align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 10px 26px rgba(37, 211, 102, 0.4); text-decoration: none;
        }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 1100px) {
          .lp-nav-links { gap: 24px; }
          .lp-nav-link { font-size: 11.5px; letter-spacing: 0.14em; }
        }
        @media (max-width: 1024px) {
          /* The centred nav and the CTA cannot share the bar with the
             logo at this width, so the links drop and the CTA carries
             the header on its own, exactly as the site header does. */
          .lp-nav-links { display: none; }
          .lp-nav { padding: 12px 20px; }
          .lp-nav-logo img { left: -12px; }
          .lp-nav-cta { display: none; }
          .lp-mobile-toggle {
            display: inline-flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; padding: 0; border-radius: 999px;
            color: var(--ivory); background: rgba(255,255,255,0.06);
            border: 1px solid rgba(246, 242, 236, 0.16); cursor: pointer;
          }
          .lp-mobile-panel {
            position: fixed; top: 84px; left: 0; right: 0; z-index: 99;
            display: flex; flex-direction: column; gap: 4px;
            max-height: calc(100vh - 84px); overflow-y: auto;
            padding: 12px 20px 20px;
            background: rgba(20, 17, 15, 0.96);
            border-bottom: 1px solid rgba(246, 242, 236, 0.12);
            backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          }
          .lp-mobile-link {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 12px; color: var(--ivory); text-decoration: none;
            font-size: 14px; font-weight: 500; letter-spacing: 0.12em;
            text-transform: uppercase; border-radius: 10px;
          }
          .lp-mobile-link:hover { background: rgba(255,255,255,0.06); }
          .lp-hero-inner {
            grid-template-columns: minmax(0, 1fr);
            padding-top: 8.5rem; padding-bottom: 4.5rem;
            gap: 0;
          }

          /* Single column puts the form under the whole copy block, which on
             a phone pushed it a screen and a half down — on the page whose
             entire job is that form. "display: contents" dissolves the copy
             wrapper so its children become grid items in their own right and
             can be re-ordered around the form, which then follows the
             headline directly. The buttons go below it: they are the same
             two actions the form and the header pill already offer, so they
             are the part that can afford to wait.

             This is the same technique HomeHero.css uses at 900px, for the
             same reason. */
          .lp-copy { display: contents; }
          .lp-eyebrow  { order: 1; justify-self: start; }
          .lp-hero-title { order: 2; }
          .lp-hero-sub   { order: 3; }
          .lp-form       { order: 4; margin-top: 2rem; max-width: 34rem; }
          .lp-cta-row    { order: 5; }
        }
        @media (max-width: 768px) {
          /* The contact bar wrapped to two lines here and cost about 85px of
             a 844px phone screen — on a page where what has to be on that
             screen is the form. Nothing is lost: the number is a tap away on
             the WhatsApp button, the phone button under the form, and the
             one-line footer. */
          .lp-topbar { display: none; }
          .lp-nav, .lp-nav.scrolled { padding: 12px 20px; }
          .lp-nav-logo { height: 44px; }
          .lp-nav-logo img { height: 104px; }
          .lp-nav-cta { padding: 9px 16px; font-size: 11px; letter-spacing: 0.06em; }
          .lp-hero-inner { padding-top: 7.5rem; padding-bottom: 3.5rem; }
          .lp-stats-inner { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 0; padding: 36px 20px; }
          .lp-stat:nth-child(2) { border-right: none; }
          .lp-stat:nth-child(1), .lp-stat:nth-child(2) {
            padding-bottom: 24px; border-bottom: 1px solid var(--hairline);
          }
          .lp-anchor { scroll-margin-top: 84px; }
        }
        @media (max-width: 640px) {
          .lp-cta-row { width: 100%; flex-direction: column; align-items: stretch; }
          .lp-cta-row .lp-btn { width: 100%; justify-content: center; }
          .lp-eyebrow { font-size: 0.6rem; letter-spacing: 0.13em; gap: 0.4rem 0.55rem; }
          .lp-eyebrow-key { width: 100%; font-weight: 700; letter-spacing: 0.2em; }
          .lp-eyebrow-sep:first-of-type { display: none; }
          /* The cue is a desktop affordance. On a phone the form already sits
             below the fold, which is its own invitation to scroll. */
          .lp-cue { display: none; }
        }
      `}</style>

      <div className="lp">

        <div className="lp-header">
          <div className={`lp-topbar ${scrolled ? 'hidden' : ''}`}>
            <div className="lp-topbar-left">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`} target="_blank" rel="noopener noreferrer" className="lp-topbar-linkitem">
                <MapPin size={13} /> {CONTACT.address}
              </a>
            </div>
            <div className="lp-topbar-right">
              <a href={`tel:${CONTACT.phone1.replace(/\s+/g, '')}`} className="lp-topbar-linkitem">
                <Phone size={13} /> {CONTACT.phone1}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="lp-topbar-linkitem">
                <Mail size={13} /> {CONTACT.email}
              </a>
            </div>
          </div>

          <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
            <Link href="/" className="lp-nav-logo" aria-label="The Heating Store, Home">
              <Image src="/logo.svg" alt="The Heating Store" width={220} height={150} sizes="220px" />
            </Link>

            <div className="lp-nav-links">
              {NAV_LINKS.map((l) => (
                <div key={l.label} className="lp-nav-item">
                  <a href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="lp-nav-link">
                    {l.label}
                  </a>
                  <span aria-hidden className="lp-nav-dot" />
                </div>
              ))}
            </div>

            <Link href="/contact" className="lp-nav-cta">
              Book Installation
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              className="lp-mobile-toggle"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="landing-mobile-nav"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>

          {mobileNavOpen && (
            <div id="landing-mobile-nav" className="lp-mobile-panel">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="lp-mobile-link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              ))}
              <Link href="/contact" className="lp-nav-cta lp-mobile-cta" onClick={() => setMobileNavOpen(false)}>
                Book Installation
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <div className="lp-hero" ref={heroWrapRef}>
          <HeroCarousel />
          <div className="lp-hero-scrim" />
          <div className="lp-hero-glow" />
          <div className="lp-grain" />

          <motion.div className="lp-hero-inner" ref={heroRef} style={{ opacity: heroTextOpacity }}>
            <div className="lp-copy">
              <motion.span
                className="lp-eyebrow"
                initial={{ opacity: 0, y: -10 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="lp-eyebrow-key">Kashmir&rsquo;s Underfloor Heating Specialists</span>
                <span className="lp-eyebrow-sep" aria-hidden="true" />
                <span className="lp-eyebrow-sub">Since {siteFacts.foundedYear}</span>
              </motion.span>

              <motion.h1
                className="lp-hero-title"
                initial={{ opacity: 0, y: 22 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                The Hamam,
                <br />
                <span className="accent">Reinvented.</span>
              </motion.h1>

              <motion.p
                className="lp-hero-sub"
                initial={{ opacity: 0, y: 18 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              >
                Kashmir has warmed its floors for generations. We just moved it under the tile, free site visit, professional install, lifetime warranty.
              </motion.p>

              <motion.div
                className="lp-cta-row"
                initial={{ opacity: 0, y: 18 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <Link href="/contact" className="lp-btn lp-btn-primary">
                  Talk to an Expert
                  <ArrowRight />
                </Link>
                <a href={`tel:${CONTACT.phone1.replace(/\s+/g, '')}`} className="lp-btn lp-btn-ghost">
                  {CONTACT.phone1}
                </a>
              </motion.div>
            </div>

            <HeroEnquiryForm />
          </motion.div>

          <div className="lp-cue" aria-hidden="true">
            <span className="lp-cue-track" />
          </div>
        </div>

        <div className="lp-stats" ref={statsRef}>
          <div className="lp-stats-inner">
            {STATS.map((stat) => <StatCounter key={stat.label} stat={stat} inView={statsIn} />)}
          </div>
        </div>

        {/* Proof, then the reasons, then the objections. That is the order a
            cold click needs them in: someone who has just been told a claim
            wants to know who else believed it before they want the argument
            for it, and they only reach the FAQ once they are far enough in to
            have specific doubts. */}
        <div id="reviews" className="lp-anchor">
          <Testimonials />
        </div>

        {/* Video reviews, directly under the written ones: a customer saying
            it on camera is the strongest proof on the page, and it belongs
            next to the quotes rather than stranded further down.

            HEADS UP: only the first of the five entries in TrustVideos.jsx
            points at a real Cloudinary asset. The other four still carry the
            placeholder paths from that file's setup comment
            (trust-videos/customer2..5), so they render broken posters. Worth
            fixing before spend goes live — see the instructions at the top of
            app/components/TrustVideos.jsx. */}
        <TrustVideos />

        <div id="why-choose" className="lp-anchor">
          <WhyChooseUFH />
        </div>

        <div id="faq" className="lp-anchor">
          <FaqSection />
        </div>

        <section className="lp-final">
          <div className="lp-final-inner">
            <span className="lp-form-eyebrow" style={{ justifyContent: 'center' }}>
              <span aria-hidden className="lp-dot" />
              Ready to begin?
            </span>
            <h2 className="lp-final-title">
              Warm Floors
              <br />
              <span className="accent">This Winter.</span>
            </h2>
            <p className="lp-final-sub">Book a free site visit, no obligation, no pressure.</p>
            <div className="lp-cta-row">
              <Link href="/contact" className="lp-btn lp-btn-primary">
                Get a Free Quote
                <ArrowRight />
              </Link>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-ghost">
                <Phone /> Call Us Now
              </a>
            </div>
          </div>
        </section>

        <footer className="lp-footer">
          <span>© {new Date().getFullYear()} The Heating Store. {CONTACT.address}</span>
          <span className="lp-footer-links">
            <a href={`tel:${CONTACT.phone1.replace(/\s+/g, '')}`}>{CONTACT.phone1}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </span>
        </footer>
      </div>

      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-float-whatsapp" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </>
  );
}
