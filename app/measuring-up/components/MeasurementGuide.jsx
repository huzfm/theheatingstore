"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";
import { GUIDE_STEPS } from "../data";

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const gridCard = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

export default function MeasurementGuide() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        background: "#0f0906",
        fontFamily: "var(--font-body)",
        color: C.text,
        padding: "88px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto 48px", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="brand-kicker"
          style={{ margin: "0 0 18px" }}
        >
          Three Measurements
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="brand-h"
          style={{ fontSize: "clamp(26px,3.6vw,42px)" }}
        >
          What you're
          <span className="brand-h-accent"> working out.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          className="brand-sub"
          style={{ marginTop: 20 }}
        >
          Total room area, minus anything fixed heating can't go under, leaves
          the area a system is sized against.
        </motion.p>
      </div>

      <motion.div
        variants={gridContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {GUIDE_STEPS.map((s) => (
          <motion.div
            key={s.num}
            variants={gridCard}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
            className="mu-glass mu-guide-card"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 180,
                overflow: "hidden",
              }}
            >
              <Image
                src={s.img}
                alt={s.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(13,8,5,0) 55%, rgba(13,8,5,0.55) 100%)",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  fontFamily: "var(--font-heading)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: C.amberLt,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "rgba(13,8,5,0.55)",
                  border: "1px solid rgba(245,185,122,0.3)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {s.num}
              </span>
            </div>
            <div style={{ padding: "22px 24px 26px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: C.text,
                  margin: "0 0 10px",
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 13.5, color: C.soft, lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
