'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import SceneManager from './why-electric-hamam/SceneManager';
import { BEAT_COUNT, BEAT_VH } from './why-electric-hamam/timeline';
import { registerGsapEases } from './why-electric-hamam/easings';

/**
 * Why Electric Hamam — a pinned sequence of complete premium presentation
 * cards (title card → 6 benefit scenes → doctor-quote finale → CTA ending),
 * each one a finished editorial composition rather than a stop along a
 * continuously morphing animation. See app/components/why-electric-hamam/
 * for the modular pieces: content.js (verbatim copy), timeline.js (pure
 * scroll-progress math — ENTRY/HOLD/EXIT per chapter), hooks/usePinnedTimeline.js
 * (the scrub driver), and one component per chapter.
 *
 * Every chapter owns a disjoint BEAT_VH-tall slice of scroll, so only one is
 * ever visible: it enters as a single composition, holds dead still long
 * enough to read in full, then leaves — the next chapter never begins until
 * the current one has fully exited.
 *
 * Visual language: warm architectural-material palette (ivory/travertine
 * surfaces, copper/amber accents) rather than a dark "portfolio" look —
 * closer to a product film for a premium interiors brand than a UI demo.
 * Premium glass surfaces (frosted copy panels, the image's glass-edge
 * frame) sit over an independently alive background — soft mesh-gradient
 * glow and procedural grain that keep breathing even while a card holds
 * still. That breathing is deliberately asymmetric (slow rise, much
 * slower decay) and stretched past a minute per layer, so no cycle
 * completes within a normal viewing window — movement stays rare,
 * stillness stays the default.
 *
 * Presence layer (owned entirely by this file, independent of
 * SceneManager's own scroll-driven motion): a single fixed, heavily
 * blurred warmth field drifts toward wherever the cursor is, on ~2.4s of
 * inertia — gsap.quickTo easing a transform, never a snap-to-pointer
 * spotlight — and fades in/out with an IntersectionObserver on the
 * section, so it's only ever present while the room is actually in view.
 * It reads as the space registering that someone is standing in it, not
 * as UI reacting to a mouse. The CTA link gets the same physics at close
 * range: proximity pulls it a capped few pixels before contact and it
 * settles back on its own rather than toggling on hover, so it reads as
 * an object with mass. Both effects write only transform/opacity, never
 * React state, so they run alongside the GSAP scrub timeline without
 * competing with it. This logic is left untouched by the CTA "exhale"
 * below — see that effect's own comment for what's actually new.
 *
 * CTA exhale: the SAME IntersectionObserver instance above also watches
 * the CTA link itself (a second .observe() target, not a second
 * observer), so the moment the CTA chapter scrolls into view the glow
 * widens and its cursor-follow inertia measurably slows — calmer than
 * every earlier chapter, like the room exhaling at the end of the story.
 *
 * The wrapper is sticky rather than GSAP-pinned, matching the convention
 * already established by components/sections/FloorRevealSection.jsx on
 * this site — no pin-spacer means nothing to recalculate on resize.
 */
const TOTAL_VH = BEAT_VH * BEAT_COUNT;
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export default function WhyElectricHamam({ ctaHref = '#contact' }) {
  const sectionRef = useRef(null);
  const presenceRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Presence + magnetic-CTA system — see the file header for the rationale.
  // Deliberately independent of SceneManager: reads the CTA link out of the
  // DOM rather than threading a new ref through it, so the scroll-scrub
  // timeline in usePinnedTimeline.js stays untouched.
  useEffect(() => {
    if (reduced) return undefined;
    const glow = presenceRef.current;
    const section = sectionRef.current;
    if (!glow || !section) return undefined;

    const link = section.querySelector('.weh-cta-ending-link');

    registerGsapEases(gsap, CustomEase);

    // Every tween below references a named ease from easings.js, never a
    // stock GSAP preset (Phase 6 polish pass): the glow's cursor-follow
    // rides emberSettle — a soft, heavily-blurred field has no legible edge
    // for an overshoot to read against, so weightedDrag's "snap past and
    // settle" would be wasted on it; the fade uses emberRise; the CTA
    // link — a small, sharp-edged target where an overshoot IS visible, and
    // the flagship physical/magnetic interaction the brief names — uses
    // weightedDrag.
    const setGlowX = gsap.quickTo(glow, 'x', { duration: 2.4, ease: 'emberSettle' });
    const setGlowY = gsap.quickTo(glow, 'y', { duration: 2.4, ease: 'emberSettle' });
    const setGlowO = gsap.quickTo(glow, 'opacity', { duration: 1.6, ease: 'emberRise' });
    const setLinkX = link ? gsap.quickTo(link, 'x', { duration: 0.6, ease: 'weightedDrag' }) : null;
    const setLinkY = link ? gsap.quickTo(link, 'y', { duration: 0.6, ease: 'weightedDrag' }) : null;

    // CTA exhale — a second, calmer pair of quickTo tweens on the SAME
    // glow.x/glow.y, used only once the CTA chapter is in view. Never run
    // alongside the normal-speed pair (see the observer callback below,
    // which kills whichever pair is stale at the exact moment of the
    // handoff), so the two inertias never fight over the same property.
    const setGlowXSlow = gsap.quickTo(glow, 'x', { duration: 4.4, ease: 'emberSettle' });
    const setGlowYSlow = gsap.quickTo(glow, 'y', { duration: 4.4, ease: 'emberSettle' });

    let sectionActive = false;
    let ctaActive = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === section) {
            sectionActive = entry.isIntersecting;
            setGlowO(sectionActive ? 1 : 0);
            if (!sectionActive) {
              setLinkX?.(0);
              setLinkY?.(0);
            }
          } else if (entry.target === link) {
            const nextCtaActive = entry.isIntersecting;
            if (nextCtaActive === ctaActive) continue;
            ctaActive = nextCtaActive;
            // Clear any in-flight tween from the pair we're switching away
            // from so the handoff between normal and exhale inertia never
            // pops or fights — the next pointer move eases smoothly from
            // wherever the glow actually is.
            gsap.killTweensOf(glow, 'x,y');
            gsap.to(glow, {
              scale: ctaActive ? 1.32 : 1,
              duration: 3.6,
              ease: 'emberSettle',
              overwrite: 'auto',
            });
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(section);
    if (link) observer.observe(link);

    const MAGNET_RADIUS = 130;
    const MAGNET_STRENGTH = 0.34;
    const MAGNET_MAX = 18;

    const handlePointerMove = (e) => {
      if (ctaActive) {
        setGlowXSlow(e.clientX - window.innerWidth / 2);
        setGlowYSlow(e.clientY - window.innerHeight / 2);
      } else {
        setGlowX(e.clientX - window.innerWidth / 2);
        setGlowY(e.clientY - window.innerHeight / 2);
      }

      if (!sectionActive || !link) return;
      const rect = link.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < MAGNET_RADIUS) {
        const pull = 1 - dist / MAGNET_RADIUS;
        setLinkX(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dx * pull * MAGNET_STRENGTH)));
        setLinkY(Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dy * pull * MAGNET_STRENGTH)));
      } else {
        setLinkX(0);
        setLinkY(0);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      observer.disconnect();
      gsap.killTweensOf(glow);
      if (link) gsap.killTweensOf(link);
    };
  }, [reduced]);

  return (
    <>
      <style>{`
        .weh-pin-wrapper {
          --weh-primary: #F8F6F2;
          --weh-secondary: #EFE8DD;
          --weh-surface: #FBFAF8;
          --weh-copper: #B86B45;
          --weh-amber: #E5A94D;
          --weh-text: #241A16;
          --weh-text-2: rgba(36,26,22,0.68);
          --weh-frame-radius: 26px;

          position: relative;
          height: ${TOTAL_VH}vh;
          background:
            radial-gradient(38% 30% at 18% 4%, rgba(255,255,255,0.55), transparent 70%),
            radial-gradient(60% 45% at 12% -4%, rgba(229,169,77,0.15), transparent 62%),
            radial-gradient(42% 38% at 78% 22%, rgba(184,107,69,0.07), transparent 68%),
            radial-gradient(50% 42% at 88% 62%, rgba(229,169,77,0.1), transparent 65%),
            radial-gradient(55% 50% at 96% 108%, rgba(184,107,69,0.16), transparent 62%),
            linear-gradient(165deg, var(--weh-surface) 0%, var(--weh-primary) 46%, var(--weh-secondary) 100%);
        }
        .weh-pin-wrapper.weh-static {
          height: auto;
        }
        /* Barely-there stone/plaster grain — a soft-lit material surface
           rather than a flat CSS gradient. Kept far too faint to read as
           "texture" consciously; it just stops the surface looking printed. */
        .weh-pin-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          animation: weh-grain-drift 150s linear infinite;
        }
        .weh-pin-wrapper.weh-static::before { opacity: 0.02; animation: none; }
        @keyframes weh-grain-drift {
          0% { background-position: 0 0; }
          100% { background-position: 660px 440px; }
        }

        /* ── Presence field — a fixed, blurred warmth that drifts toward
           the cursor with heavy inertia (gsap.quickTo on transform only)
           and fades with the section's own viewport intersection. Never
           positioned via layout — translate + opacity only. ──────────── */
        .weh-presence-glow {
          position: fixed;
          top: 50%; left: 50%;
          width: 90vmax; height: 90vmax;
          margin: -45vmax 0 0 -45vmax;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 205, 148, 0.30) 0%, rgba(184, 107, 69, 0.10) 42%, transparent 68%);
          filter: blur(90px);
          mix-blend-mode: soft-light;
          opacity: 0;
          pointer-events: none;
          z-index: 3;
          will-change: transform, opacity;
        }

        .weh-stage {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          font-family: var(--font-body);
          perspective: 1600px;
        }
        .weh-static .weh-stage {
          position: static;
          height: auto;
          overflow: visible;
        }

        /* ── Ambient depth layers — soft blurred mesh-gradient glow. Two
           independent motions stack on the same element without fighting:
           GSAP writes a translateY transform every scroll tick (parallax
           at three different speeds, foreground/midground/background
           depth); a slow autonomous CSS keyframe breathes their opacity and
           blur radius so the background stays visibly alive even while a
           card is fully held and nothing is scrolling. Never sharp, never a
           pattern — just light. ─────────────────────────────────────────── */
        .weh-ambient-layer {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
          will-change: transform;
          animation: weh-ambient-breathe 38s ease-in-out infinite;
        }
        .weh-static .weh-ambient-layer { display: none; }
        .weh-ambient-layer--bg {
          width: 62vw; height: 62vw; top: -18%; left: -18%;
          background: radial-gradient(circle, var(--weh-ambient-accent, var(--weh-copper)) 0%, transparent 70%);
          --weh-layer-base: 0.09;
          animation-duration: 44s;
        }
        .weh-ambient-layer--mid {
          width: 48vw; height: 48vw; bottom: -16%; right: -12%;
          background: radial-gradient(circle, var(--weh-amber) 0%, transparent 70%);
          --weh-layer-base: 0.1;
          animation-duration: 33s;
          animation-delay: -11s;
        }
        .weh-ambient-layer--fg {
          width: 30vw; height: 30vw; top: 38%; left: 62%;
          background: radial-gradient(circle, var(--weh-ambient-accent, var(--weh-copper)) 0%, transparent 70%);
          --weh-layer-base: 0.07;
          animation-duration: 52s;
          animation-delay: -19s;
        }
        /* Asymmetric "long exhale" — peak arrives well before the
           midpoint, so the rise is brisk and the decay is unhurried;
           the two halves never read as a mirrored, mechanical loop. */
        @keyframes weh-ambient-breathe {
          0% { opacity: var(--weh-layer-base, 0.09); filter: blur(70px); }
          32% { opacity: calc(var(--weh-layer-base, 0.09) * 1.55); filter: blur(96px); }
          100% { opacity: var(--weh-layer-base, 0.09); filter: blur(70px); }
        }

        .weh-beat {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          will-change: opacity, transform, filter;
          opacity: 0;
        }
        .weh-beat:first-child { opacity: 1; }
        .weh-static .weh-beat {
          position: relative;
          inset: auto;
          height: auto;
          opacity: 1 !important;
          filter: none !important;
          transform: none !important;
          clip-path: none !important;
          padding: 72px 6vw;
        }

        /* ── Title scene ────────────────────────────────────────────── */
        /* Iris/unveil signature (see timeline.js getTitleMotion): clip-path
           is written every scroll tick, so it gets its own will-change
           rather than relying on the shared .weh-beat hint above. */
        .weh-title-scene { flex-direction: column; text-align: center; padding: 0 6vw; z-index: 1; will-change: opacity, transform, filter, clip-path; }
        .weh-title-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(184,107,69,0.08); border: 1px solid rgba(184,107,69,0.24);
          border-radius: 999px; padding: 8px 20px; margin-bottom: 28px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--weh-copper);
          will-change: opacity, transform;
        }
        .weh-title-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--weh-amber);
          animation: weh-blink 2s infinite;
        }
        .weh-title-heading {
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(2.75rem, 7vw, 6rem); line-height: 1.02;
          color: var(--weh-text); max-width: 16ch; margin: 0 auto;
          will-change: opacity, transform;
        }

        /* ── Benefit scenes ─────────────────────────────────────────── */
        .weh-scene-grid {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          gap: 5vw; width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 6vw;
        }
        .weh-scene-grid--right { flex-direction: row; }
        .weh-scene-grid--left { flex-direction: row-reverse; }

        /* Premium glass surface for the copy side, mirroring the image
           panel's own glass-edged frame — type reads as sitting on a placed
           material object, not floating directly on the page background. */
        .weh-scene-copy {
          flex: 1 1 46%; max-width: 580px;
          padding: clamp(32px, 4vw, 56px);
          border-radius: 28px;
          background: linear-gradient(155deg, rgba(255,255,255,0.5), rgba(255,255,255,0.16));
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow:
            0 30px 60px -32px rgba(36,26,22,0.18),
            inset 0 1px 0 rgba(255,255,255,0.6);
          will-change: transform;
        }
        .weh-static .weh-scene-copy { backdrop-filter: none; -webkit-backdrop-filter: none; }
        .weh-scene-index {
          display: block; font-family: var(--font-heading); font-size: clamp(14px, 1.4vw, 18px);
          letter-spacing: 0.24em; color: rgba(36,26,22,0.22); margin-bottom: 18px;
          will-change: opacity, transform;
        }
        .weh-scene-counter {
          display: flex; align-items: baseline; gap: 10px; margin: 0 0 20px;
          font-family: var(--font-body); font-size: 15px; font-weight: 700; color: var(--weh-accent);
          will-change: opacity, transform;
        }
        .weh-scene-counter-label {
          font-size: 12px; font-weight: 500; letter-spacing: 0.02em; color: var(--weh-text-2);
        }
        .weh-scene-title {
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(2rem, 3.6vw, 3.5rem); line-height: 1.05;
          color: var(--weh-text); margin: 0 0 22px;
          will-change: opacity, transform;
        }
        .weh-scene-body {
          font-family: var(--font-body); font-size: clamp(1.05rem, 1.4vw, 1.3rem);
          line-height: 1.75; color: var(--weh-text-2); max-width: 42ch; margin: 0;
          will-change: opacity, transform;
        }

        .weh-scene-rowstat {
          display: flex; align-items: baseline; gap: 12px; margin-top: 34px;
          padding-top: 22px; border-top: 1px solid rgba(36,26,22,0.12);
          will-change: opacity, transform;
        }
        .weh-scene-rowstat-value {
          font-family: var(--font-heading); font-size: clamp(2rem, 3vw, 2.75rem);
          color: var(--weh-accent); line-height: 1;
        }
        .weh-scene-rowstat-label {
          font-family: var(--font-body); font-size: 13px; color: var(--weh-text-2); max-width: 18ch;
        }

        /* ── Image panel ─────────────────────────────────────────────── */
        .weh-image-panel { flex: 1 1 44%; display: flex; justify-content: center; perspective: 1200px; }
        .weh-image-panel-frame {
          position: relative; width: 100%; max-width: 480px; aspect-ratio: 4 / 5;
          max-height: 74vh; border-radius: var(--weh-frame-radius); overflow: hidden;
          background: var(--weh-surface);
          /* Shadow expansion — --weh-shadow-t (0→1) is written every scroll
             tick by usePinnedTimeline, in lockstep with the clip-path mask
             reveal, so the drop shadow deepens as the card lifts into place
             rather than appearing at full weight from frame one. */
          --weh-shadow-t: 1;
          box-shadow:
            0 calc(50px * var(--weh-shadow-t)) calc(90px * var(--weh-shadow-t)) -24px rgba(36,26,22, calc(0.28 * var(--weh-shadow-t))),
            0 calc(12px * var(--weh-shadow-t)) calc(28px * var(--weh-shadow-t)) -12px rgba(36,26,22, calc(0.16 * var(--weh-shadow-t))),
            0 0 0 1px rgba(184,107,69,0.1);
        }
        .weh-image-panel-img {
          position: absolute; inset: -4%; width: 108%; height: 108%; object-fit: cover;
          will-change: transform;
        }
        .weh-image-panel-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(36,26,22,0) 68%, rgba(36,26,22,0.16) 100%);
        }
        /* Diagonal light sweep — crosses the frame once as it opens. */
        .weh-image-panel-sweep {
          position: absolute; inset: -20% -55%;
          background: linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.6) 50%, transparent 58%);
          opacity: 0;
          pointer-events: none;
        }
        /* Soft inner highlight — a hint of physical reflection on the glass. */
        .weh-image-panel-edge {
          position: absolute; inset: 0; pointer-events: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(255,255,255,0.12);
          mix-blend-mode: overlay;
        }
        .weh-static .weh-image-panel-sweep { display: none; }

        /* ── Quote scene ─────────────────────────────────────────────── */
        .weh-quote-scene {
          z-index: 1;
          background:
            radial-gradient(60% 60% at 50% 24%, rgba(229,169,77,0.2), transparent 62%),
            linear-gradient(180deg, var(--weh-primary) 0%, var(--weh-secondary) 100%);
        }
        .weh-quote-inner {
          max-width: 880px; margin: 0 auto; padding: clamp(48px, 6vw, 88px) clamp(32px, 7vw, 96px);
          text-align: center; border-radius: 32px;
          background: linear-gradient(155deg, rgba(255,255,255,0.5), rgba(255,255,255,0.14));
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow: 0 30px 70px -36px rgba(36,26,22,0.2), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .weh-static .weh-quote-inner { backdrop-filter: none; -webkit-backdrop-filter: none; }
        .weh-quote-mark {
          display: block; font-family: var(--font-heading); font-size: clamp(6rem, 12vw, 9rem);
          color: rgba(184,107,69,0.28); line-height: 1; margin-bottom: -1.4rem;
          will-change: opacity, transform;
        }
        .weh-quote-text {
          font-family: var(--font-body); font-style: italic; font-weight: 500;
          font-size: clamp(1.4rem, 3vw, 2.5rem); line-height: 1.5; letter-spacing: -0.01em;
          color: var(--weh-text); max-width: 46ch; margin: 0 auto;
          will-change: opacity, transform;
        }
        .weh-quote-attribution {
          display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;
          margin-top: 32px;
        }
        .weh-quote-name-row { display: inline-flex; align-items: center; gap: 10px; }
        .weh-quote-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--weh-amber); flex-shrink: 0; }
        .weh-quote-name {
          font-family: var(--font-body); font-size: 14px; font-weight: 700; color: var(--weh-copper);
        }
        .weh-quote-role { font-weight: 500; color: var(--weh-text-2); }
        .weh-quote-source {
          background: rgba(184,107,69,0.08); border: 1px solid rgba(184,107,69,0.22);
          color: var(--weh-copper); padding: 3px 10px; border-radius: 999px; font-size: 11px;
        }

        /* ── CTA ending ──────────────────────────────────────────────── */
        .weh-cta-ending {
          z-index: 1;
          background:
            radial-gradient(70% 60% at 50% 58%, rgba(229,169,77,0.24), transparent 65%),
            linear-gradient(180deg, var(--weh-secondary) 0%, var(--weh-primary) 100%);
        }
        .weh-cta-ending-link {
          position: relative; display: inline-flex; align-items: center; gap: 18px;
          text-decoration: none; color: var(--weh-copper);
          font-family: var(--font-heading); font-size: clamp(1.75rem, 4.4vw, 3.25rem);
          letter-spacing: 0.01em; padding-bottom: 10px;
          transition: color 0.4s ease;
        }
        .weh-cta-ending-link:hover { color: #8F4E30; }
        .weh-cta-ending-word { display: inline-flex; overflow: hidden; }
        .weh-cta-ending-letter { display: inline-block; white-space: pre; transition: transform 0.4s cubic-bezier(.16,1,.3,1); }
        .weh-cta-ending-link:hover .weh-cta-ending-letter { transform: translateY(-6px); }
        .weh-cta-ending-chrome { display: inline-flex; align-items: center; }
        .weh-cta-ending-arrow { display: inline-flex; transition: transform 0.35s ease; }
        .weh-cta-ending-link:hover .weh-cta-ending-arrow { transform: translateX(6px); }
        .weh-cta-ending-underline { position: absolute; left: 0; right: 40px; bottom: 0; height: 2px; }
        .weh-cta-ending-underline-r, .weh-cta-ending-underline-l { position: absolute; inset: 0; background: currentColor; }
        .weh-cta-ending-underline-r { transform-origin: right center; transition: transform 0.36s cubic-bezier(.16,1,.3,1); }
        .weh-cta-ending-underline-l { transform-origin: left center; transform: scaleX(0); transition: transform 0.52s cubic-bezier(.16,1,.3,1); }
        .weh-cta-ending-link:hover .weh-cta-ending-underline-r { transform: scaleX(0); }
        .weh-cta-ending-link:hover .weh-cta-ending-underline-l { transform: scaleX(1); }

        @keyframes weh-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

        @media (max-width: 900px) {
          .weh-scene-grid, .weh-scene-grid--left, .weh-scene-grid--right {
            flex-direction: column; text-align: center; gap: 40px;
          }
          .weh-scene-copy { max-width: 520px; }
          .weh-scene-rowstat { justify-content: center; }
          .weh-image-panel-frame { max-width: 340px; aspect-ratio: 4 / 5; max-height: 46vh; }
          .weh-quote-attribution { justify-content: center; }
          .weh-ambient-layer { opacity: 0.05 !important; animation: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .weh-title-eyebrow-dot { animation: none; }
          .weh-ambient-layer { animation: none !important; }
          .weh-pin-wrapper::before { animation: none !important; }
          .weh-presence-glow { display: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="why-electric-hamam-story"
        className={`weh-pin-wrapper${reduced ? ' weh-static' : ''}`}
      >
        <SceneManager wrapperRef={sectionRef} ctaHref={ctaHref} reduced={reduced} />
        {!reduced && <div className="weh-presence-glow" ref={presenceRef} aria-hidden="true" />}
      </section>
    </>
  );
}
