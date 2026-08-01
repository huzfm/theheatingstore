"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";
import { TRUST_BADGES } from "../data";

export default function MeasurementHero() {
  return (
    <section
      className="mu-noise"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)",
        fontFamily: "var(--font-body)",
        color: C.text,
      }}
    >
      <div aria-hidden className="mu-aura">
        <span className="mu-orb" />
      </div>
      <div aria-hidden className="mu-vignette" />

      <div
        className="mu-hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "128px 20px 80px",
          display: "grid",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* LEFT — copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="brand-badge"
            style={{ margin: "0 0 26px" }}
          >
            <span className="brand-badge-dot" />
            Measurement Tool
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
            className="brand-h"
            style={{ fontSize: "clamp(34px,5vw,60px)" }}
          >
            Measure your space
            <span className="brand-h-accent" style={{ display: "block" }}>
              with confidence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.26 }}
            className="brand-sub"
            style={{ marginTop: 24, maxWidth: 480 }}
          >
            Enter your room dimensions and fixed furniture — this calculator
            works out heatable floor area as you type.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            style={{ marginTop: 38, display: "flex", flexWrap: "wrap", gap: 14 }}
          >
            <a
              href="#mu-calculator"
              className="mu-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "15px 32px",
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                background: "linear-gradient(to right,#FF7E5F,#FFB88C)",
                boxShadow: "0 22px 60px rgba(255,126,95,0.35)",
                textDecoration: "none",
              }}
            >
              Begin Measurement
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 3v8M4 8l3 3 3-3"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 34,
            }}
          >
            {TRUST_BADGES.map((b) => (
              <div
                key={b.title}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                  {b.title}
                </span>
                <span style={{ display: "block", fontSize: 10, color: C.mute, lineHeight: 1.3 }}>{b.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — framed measuring photo, sized close to its native
            resolution so it stays crisp (source is a modest 640x230 crop,
            not a large photo — this deliberately isn't blown up to fill
            the column like a generic hero image would be). */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          style={{ maxWidth: 480 }}
        >
          <div
            className="mu-glass"
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              aspectRatio: "640 / 230",
            }}
          >
            <Image
              src="/images/measure-crop.png"
              alt="Tape measure laid across a floor ready for underfloor heating"
              fill
              priority
              sizes="(max-width: 900px) 90vw, 560px"
              style={{ objectFit: "cover" }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(13,8,5,0) 55%, rgba(13,8,5,0.62) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 18, bottom: 14, right: 18 }}>
              <p style={{ fontSize: 12, color: C.text, margin: 0 }}>
                Every quote starts with the same measurement.
              </p>
            </div>
          </div>

          {/* Supporting stat card */}
          <div
            className="mu-glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 20px",
              borderRadius: 16,
              marginTop: 16,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 28,
                fontWeight: 600,
                color: C.amberLt,
                lineHeight: 1,
                margin: 0,
              }}
            >
              3
            </p>
            <div style={{ width: 1, height: 34, background: "rgba(245,185,122,0.25)" }} />
            <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.4, margin: 0 }}>
              Simple inputs: room size, fixed areas, sill height
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
