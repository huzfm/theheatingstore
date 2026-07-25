"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// PALETTE, ported 1:1 from WhyElectricHamam.jsx (terracotta + amber, warm cream bg)
// ═══════════════════════════════════════════════════════════════════════════
const P = {
  terracotta:      "#C4623A",
  terracottaLight: "#F0B080",
  terracottaDark:  "#8B4226",
  terracottaSoft:  "rgba(196,98,58,0.09)",
  amber:      "#E88C2A",
  amberMid:   "#EDA24E",
  amberLight: "#FFD9A0",
  amberDark:  "#B86B45",
  amberSoft:  "rgba(232,140,42,0.09)",
  text:      "#2C1810",
  textMid:   "#3C2B27",
  textMuted: "#6B4A2D",
  textLight: "#8A6B52",
  border:    "rgba(255,255,255,0.92)",
};

const GLASS = "rgba(255,255,255,0.82)";
const EASE = [0.16, 1, 0.3, 1];

// ═══════════════════════════════════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════════════════════════════════

function PulsingDot({ color = P.amber }) {
  return (
    <motion.span
      aria-hidden="true"
      style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color, display: "inline-block", flexShrink: 0,
        boxShadow: `0 0 6px ${color}99`,
      }}
      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Eyebrow badge, matches WhyElectricHamam's blinking-dot pill badge
function Eyebrow({ label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(196,98,58,0.08)",
      border: "1px solid rgba(184,107,69,0.18)",
      borderRadius: 999,
      padding: "6px 16px",
    }}>
      <PulsingDot />
      <span style={{
        fontFamily: "var(--font-body)",
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: P.amberDark,
      }}>
        {label}
      </span>
    </div>
  );
}

function GlowOrb({ style }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", borderRadius: "50%",
      pointerEvents: "none", zIndex: 0, ...style,
    }} />
  );
}

// Floating gradient sphere, terracotta / amber gradient, holds reviewer initials
function FloatingSphere({ variant, size, initials }) {
  const mainGradient =
    variant === "terracotta"
      ? `radial-gradient(circle at 30% 26%, ${P.terracottaLight} 0%, ${P.terracotta} 52%, ${P.terracottaDark} 100%)`
      : `radial-gradient(circle at 30% 26%, ${P.amberLight} 0%, ${P.amber} 52%, ${P.amberDark} 100%)`;
  return (
    <div aria-hidden="true" style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", top: size * 0.13, left: size * 0.16,
        width: size * 0.9, height: size * 0.9, borderRadius: "50%",
        background: "radial-gradient(circle at 60% 30%, rgba(0,0,0,0.20), transparent 68%)",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: size * 0.9, height: size * 0.9, borderRadius: "50%",
        background: mainGradient,
        boxShadow:
          "0 10px 24px -6px rgba(44,24,16,0.38), inset -4px -4px 9px rgba(0,0,0,0.14), inset 3px 3px 7px rgba(255,255,255,0.38)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: size * 0.28,
          color: "#ffffff",
          lineHeight: 1,
        }}>
          {initials}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA, TheHeatingStore (Kashmir underfloor heating) customer stories
// ═══════════════════════════════════════════════════════════════════════════
const testimonials = [
  {
    name: "Aamir Khan",
    review:
      "We'd used a wood hamam for thirty years. My mother was hesitant to switch, but after one winter with the electric floor she told me she doesn't miss the smoke or the ash at all, just the same warmth, minus the work.",
  },
  {
    name: "Fatima Mir",
    review:
      "Installation took less than two days and there was zero mess left behind. What surprised me most was how even the heat felt, no cold corners like our old bukhari used to leave.",
  },
  {
    name: "Riyaz Ahmed",
    review:
      "I was worried about the electricity bill going up, but with the insulation board they installed, it's actually close to what we spent on gas heaters before, and the whole room stays warm, not just one corner.",
  },
  {
    name: "Nadia Bhat",
    review:
      "My father is elderly and the old hamam had become a safety concern for us. This gave us the same comfort he grew up with, without an open flame in the house. That alone was worth it.",
  },
  {
    name: "Tariq Wani",
    review:
      "The team came for a free site visit, explained exactly what was under the tile, and gave us a written quote with no hidden costs. Everything they promised on day one is exactly what we got.",
  },
  {
    name: "Shabnam Lone",
    review:
      "Our first winter with it, the power went out for almost three hours one evening. The floor stayed warm the whole time, that heat retention is something I genuinely didn't expect.",
  },
  {
    name: "Imran Sheikh",
    review:
      "I compared three companies before choosing TheHeatingStore. They were the only ones who actually showed me the cross-section of what goes under the tile instead of just talking numbers.",
  },
  {
    name: "Rukhsar Qazi",
    review:
      "Five years in and the warranty has meant real accountability, not just a piece of paper. One thermostat issue last winter was fixed within two days, no argument, no extra charge.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPrevIndex(i, len) {
  return (i - 1 + len) % len;
}
function getNextIndex(i, len) {
  return (i + 1) % len;
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIAL SLIDE
// ═══════════════════════════════════════════════════════════════════════════
function TestimonialSlide({
  data,
  index,
  variant,
  isActive,
  onClick,
  ariaLabel,
}) {
  const interactive = !isActive && !!onClick;
  const accent = variant === "terracotta" ? P.terracotta : P.amber;
  const accentSoft = variant === "terracotta" ? P.terracottaSoft : P.amberSoft;

  const containerStyle = {
    width: isActive ? "clamp(320px, 34vw, 440px)" : "clamp(240px, 22vw, 300px)",
    padding: isActive ? "44px 38px" : "28px 22px",
    borderRadius: 22,
    background: isActive ? GLASS : "transparent",
    backdropFilter: isActive ? "blur(12px)" : "none",
    WebkitBackdropFilter: isActive ? "blur(12px)" : "none",
    border: isActive ? `1px solid ${P.border}` : "1px solid transparent",
    boxShadow: isActive
      ? "0 20px 44px -16px rgba(44,24,16,0.18), 0 4px 12px -4px rgba(44,24,16,0.06)"
      : "none",
    position: "relative",
    overflow: "visible",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: isActive ? 14 : 10,
    textAlign: "center",
    opacity: isActive ? 1 : 0.55,
    transform: isActive ? "scale(1)" : "scale(0.86)",
    transition: "opacity 0.3s, transform 0.3s, box-shadow 0.42s ease",
    cursor: interactive ? "pointer" : "default",
  };

  const handleKey = (e) => {
    if (!interactive || !onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={isActive ? "tst-active" : "tst-peek"}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      onClick={onClick}
      onKeyDown={handleKey}
      style={containerStyle}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.75";
        else {
          e.currentTarget.style.transform = "translateY(-7px) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 30px 64px -20px rgba(44,24,16,0.24), 0 8px 20px -6px rgba(44,24,16,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.55";
        else {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 20px 44px -16px rgba(44,24,16,0.18), 0 4px 12px -4px rgba(44,24,16,0.06)";
        }
      }}
    >
      {/* Ambient glow, only on active card, tinted by variant */}
      {isActive && (
        <>
          <GlowOrb style={{
            bottom: -70, right: -70, width: 220, height: 220,
            background: `radial-gradient(circle, ${accentSoft} 0%, transparent 65%)`,
          }} />
          <GlowOrb style={{
            top: -50, left: -50, width: 160, height: 160,
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 65%)",
          }} />
        </>
      )}

      {/* Floating gradient sphere holding the reviewer's initials */}
      <div style={{ position: "absolute", top: isActive ? -30 : -22, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
        <FloatingSphere variant={variant} size={isActive ? 64 : 48} initials={getInitials(data.name)} />
      </div>

      <div style={{
        position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", gap: isActive ? 14 : 10,
        marginTop: isActive ? 26 : 20,
      }}>
        {/* Quote icon */}
        <Quote
          aria-hidden="true"
          style={{
            width: isActive ? 22 : 18,
            height: isActive ? 22 : 18,
            color: variant === "terracotta" ? "rgba(196,98,58,0.45)" : "rgba(232,140,42,0.45)",
            flexShrink: 0,
          }}
        />

        {/* Name */}
        <div style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: isActive ? 16 : 14.5,
          letterSpacing: "-0.01em",
          color: isActive ? P.text : P.textMid,
          lineHeight: 1.2,
        }}>
          {data.name}
        </div>

        {/* Stars */}
        <div
          aria-label="5 out of 5 stars"
          style={{
            fontSize: 13,
            letterSpacing: 2,
            color: isActive ? P.amber : "rgba(232,140,42,0.55)",
            lineHeight: 1,
          }}
        >
          {"★★★★★"}
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            width: 36, height: 1, flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: isActive ? 0.55 : 0.3,
          }}
        />

        {/* Review text, clamped to 4 lines */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: isActive ? 13.5 : 13,
          lineHeight: 1.75,
          color: isActive ? P.textMid : P.textLight,
          margin: 0,
          maxWidth: 300,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {data.review}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => getPrevIndex(prev, testimonials.length));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => getNextIndex(prev, testimonials.length));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: reducedMotion ? 0 : (dir > 0 ? 50 : -50),
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: reducedMotion ? 0 : (dir > 0 ? -50 : 50),
      opacity: 0,
    }),
  };

  const prevIndex = getPrevIndex(currentIndex, testimonials.length);
  const nextIndex = getNextIndex(currentIndex, testimonials.length);
  const variantFor = (i) => (i % 2 === 0 ? "terracotta" : "amber");

  return (
    <section
      aria-labelledby="tst-heading"
      className="tst-section"
      style={{
        position: "relative",
        padding: "104px 32px 128px",
        background: "linear-gradient(155deg, #FFFFFF 0%, #FFF4E8 35%, #FFE8D0 70%, #F8C084 100%)",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs, matching WhyElectricHamam's warm glow positions */}
      <div aria-hidden="true" style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 600, height: 600, top: -260, left: -260,
        background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 68%)",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 500, height: 500, bottom: -200, right: -200,
        background: "radial-gradient(circle, rgba(196,98,58,0.12) 0%, transparent 70%)",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 320, height: 320, top: "40%", left: "50%", transform: "translateX(-50%)",
        background: "radial-gradient(circle, rgba(232,140,42,0.08) 0%, transparent 70%)",
      }} />

      <div className="tst-inner" style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 40px", position: "relative", zIndex: 1,
      }}>

        {/* ═════════ HEADER ═════════ */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ marginBottom: 22, display: "flex", justifyContent: "center" }}>
            <Eyebrow label="Real Feedback" />
          </div>

          <h2
            id="tst-heading"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.1,
              color: P.text,
              margin: "0 auto 16px",
            }}
          >
            Real Homes,
            <br />
            Real Warmth.
          </h2>

          <div style={{
            width: 48, height: 3,
            background: `linear-gradient(90deg, ${P.terracotta}, ${P.amber})`,
            borderRadius: 2,
            margin: "0 auto 22px",
          }} />

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 400,
            color: P.amberDark,
            opacity: 0.85,
            lineHeight: 1.7,
            margin: "0 auto",
            textAlign: "center",
            maxWidth: 440,
          }}>
            Real stories from real homes across Kashmir. See how TheHeatingStore
            has replaced the old hamam without losing what people loved about it.
          </p>
        </div>

        {/* ═════════ CAROUSEL ═════════ */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          className="tst-carousel"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            minHeight: 400,
          }}
        >
          {/* Left peek, decorative, navigates on click */}
          <TestimonialSlide
            data={testimonials[prevIndex]}
            index={prevIndex}
            variant={variantFor(prevIndex)}
            isActive={false}
            onClick={handlePrev}
            ariaLabel="View previous testimonial"
          />

          {/* Active slide, animated */}
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
              style={{ display: "flex" }}
            >
              <TestimonialSlide
                data={testimonials[currentIndex]}
                index={currentIndex}
                variant={variantFor(currentIndex)}
                isActive={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* Right peek, decorative, navigates on click */}
          <TestimonialSlide
            data={testimonials[nextIndex]}
            index={nextIndex}
            variant={variantFor(nextIndex)}
            isActive={false}
            onClick={handleNext}
            ariaLabel="View next testimonial"
          />
        </div>

        {/* ═════════ NAV BUTTONS ═════════ */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 14,
          marginTop: 36,
        }}>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            style={{
              width: 46, height: 46, borderRadius: "50%",
              border: "1.5px solid rgba(196,98,58,0.25)",
              background: "#ffffff",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(196,98,58,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            <ChevronLeft size={19} color={P.terracotta} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            style={{
              width: 46, height: 46, borderRadius: "50%",
              border: "none",
              background: `linear-gradient(135deg, ${P.terracotta}, ${P.amber})`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 18px rgba(196,98,58,0.30)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <ChevronRight size={19} color="#ffffff" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ═════════ RESPONSIVE STYLES ═════════ */}
      <style>{`
        @media (max-width: 900px) {
          .tst-peek { display: none; }
          .tst-active { width: min(92vw, 420px); }
          .tst-section { padding: 80px 0 96px !important; }
          .tst-inner { padding: 0 20px !important; }
        }
        @media (max-width: 640px) {
          .tst-active { padding: 32px 24px; }
          .tst-section { padding: 72px 0 88px !important; }
          .tst-inner { padding: 0 16px !important; }
          .tst-carousel { min-height: 360px !important; }
        }
      `}</style>
    </section>
  );
}
