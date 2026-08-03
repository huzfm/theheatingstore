"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";
import { CONSIDERATIONS } from "../data";

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const gridCard = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

export default function SystemConsiderations() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "88px 20px 100px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto 44px", textAlign: "center" }}>
        <p className="brand-kicker" style={{ margin: "0 0 18px" }}>
          Things To Consider
        </p>
        <h2 className="brand-h" style={{ fontSize: "clamp(26px,3.6vw,42px)" }}>
          Different systems,
          <span className="brand-h-accent"> different measurements.</span>
        </h2>
        <p className="brand-sub" style={{ marginTop: 18 }}>
          Your heatable area is the starting point — each system applies its
          own allowance on top.
        </p>
      </div>

      <motion.div
        variants={gridContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {CONSIDERATIONS.map((c) => (
          <motion.article
            key={c.tag}
            variants={gridCard}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
            className="mu-glass mu-card"
            style={{ borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div style={{ position: "relative", width: "100%", height: 220 }}>
              <Image src={c.img} alt={c.alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ padding: "26px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  padding: "5px 14px",
                  borderRadius: 999,
                  background: "rgba(232,147,58,0.1)",
                  border: "1px solid rgba(232,147,58,0.25)",
                  color: C.amberLt,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {c.tag}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: C.text,
                  margin: "0 0 14px",
                  lineHeight: 1.2,
                }}
              >
                {c.title}
              </h3>
              {c.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 13.5, color: C.soft, lineHeight: 1.75, margin: "0 0 14px" }}>
                  {p}
                </p>
              ))}
              <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Link
                  href={c.cta.href}
                  className="mu-btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "13px 22px",
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#fff",
                    background: "linear-gradient(to right,#FF7E5F,#FFB88C)",
                    boxShadow: "0 16px 40px rgba(255,126,95,0.28)",
                    textDecoration: "none",
                  }}
                >
                  {c.cta.label} &rarr;
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
