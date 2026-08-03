"use client";

import { useRef } from "react";
import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";
import { TRUST_BADGES } from "../data";

/**
 * One headline line, masked and revealed as a whole rather than word by
 * word — reads as a typeset line being brought into focus, not a
 * typewriter effect. Reduced-motion handling is delegated to the
 * `MotionConfig reducedMotion="user"` wrapper in the parent component
 * rather than a manual branch here — Framer Motion resolves that setting
 * internally in an SSR-safe way, avoiding a hydration mismatch that a
 * hand-rolled `useReducedMotion()` branch on the *element type itself*
 * would otherwise risk.
 */
function MaskLine({ children, delay = 0, className = "" }) {
  return (
    <span className="mh-mask">
      <motion.span
        className={className}
        initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.95, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Small mount-triggered rise/fade, shared by every non-headline reveal. */
function Reveal({ children, delay = 0, y = 16, className = "", as = "div" }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export default function MeasurementHero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} className="mh-hero mu-noise" style={{ color: C.text }}>
        {/* ── Background layers ── */}
        <div className="mh-grid" aria-hidden="true" />
        <div className="mu-vignette" aria-hidden="true" />

        <div className="mh-inner">
          <div className="mh-top">
            {/* ── LEFT — editorial copy ── */}
            <div className="mh-content">
              <Reveal delay={0.1} y={14} className="mh-eyebrow">
                <span className="mh-eyebrow-num">01</span>
                <span className="mh-eyebrow-rule" aria-hidden="true" />
                <span className="mh-eyebrow-label">Measurement</span>
              </Reveal>

              <h1 className="mh-headline">
                <MaskLine delay={0.24} className="mh-headline-line">
                  Measure your space
                </MaskLine>
                <span className="mh-accent-wrap">
                  <MaskLine delay={0.38} className="mh-headline-accent">
                    with confidence.
                  </MaskLine>
                  <span className="mh-accent-rule" aria-hidden="true" />
                </span>
              </h1>

              <Reveal delay={0.56} className="mh-copy" as="p">
                Enter your room dimensions and fixed furniture — this calculator
                works out heatable floor area as you type.
              </Reveal>

              <Reveal delay={0.7} className="mh-cta-wrap">
                <a href="#mu-calculator" className="mh-cta">
                  <span>Begin Measurement</span>
                  <span className="mh-cta-arrow" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 2v9M4 8l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </Reveal>
            </div>

            {/* ── RIGHT — cinematic architectural photograph ── */}
            <div className="mh-visual">
              <motion.div
                className="mh-frame"
                initial={{ opacity: 0, clipPath: "inset(9% 9% 9% 9% round 3px)" }}
                animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 3px)" }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
              >
                <motion.div className="mh-frame-scale" style={{ scale: imageScale }}>
                  <Image
                    src="/images/mm.png"
                    alt="Tape measure laid across a bare floor, measuring the room ahead of underfloor heating installation"
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 62vw"
                    className="mh-image"
                  />
                </motion.div>

                <div className="mh-image-overlay" aria-hidden="true" />

                <Reveal delay={0.95} y={8} className="mh-image-label" as="span">
                  <span className="mh-image-label-tick" aria-hidden="true" />
                  Room Study / 001
                </Reveal>

                <Reveal delay={1.05} y={6} className="mh-dim mh-dim-h" as="div">
                  <span className="mh-dim-line" aria-hidden="true" />
                  <span className="mh-dim-value">4.82&nbsp;m</span>
                </Reveal>

                <Reveal delay={1.15} y={6} className="mh-dim mh-dim-v" as="div">
                  <span className="mh-dim-line" aria-hidden="true" />
                  <span className="mh-dim-value">2.94&nbsp;m</span>
                </Reveal>

                <Reveal delay={1.2} y={6} className="mh-reference" as="span">
                  Reference Scale — Space Study
                </Reveal>
              </motion.div>
            </div>
          </div>

          {/* ── BOTTOM — editorial spec strip + scroll cue ── */}
          <Reveal delay={0.85} y={14} className="mh-bottom">
            <div className="mh-trust">
              {TRUST_BADGES.map((b) => (
                <div className="mh-trust-item" key={b.title}>
                  <span className="mh-trust-title">{b.title}</span>
                  <span className="mh-trust-sub">{b.sub}</span>
                </div>
              ))}
            </div>

            <div className="mh-scroll" aria-hidden="true">
              <span className="mh-scroll-num">01</span>
              <span className="mh-scroll-label">Scroll to calculate</span>
              <span className="mh-scroll-line">
                <motion.span
                  className="mh-scroll-tick"
                  animate={{ x: ["-100%", "220%", "-100%"] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </MotionConfig>
  );
}
