

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const CACHE_KEY = "blog_section_cache";

export default function BlogSection() {
  const reduce = useReducedMotion();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const res = await fetch("https://evulation-api-electrichamambackend.0psc8x.easypanel.host/api/blogs", { 
  //         cache: "no-store" 
  //       });
  //       const data = await res.json();
  //       const list = Array.isArray(data) ? data : [];
  //       setBlogs(list);
  //     } catch (err) {
  //       console.error("Blog fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBlogs();
  // }, []);
useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://evulation-api-electrichamambackend.0psc8x.easypanel.host/api/blogs", { 
          cache: "no-store" 
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setBlogs(list);
      } catch (err) {
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="relative isolate overflow-hidden bg-[#FFF8F0]">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="grid gap-20 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <div className="h-7 w-40 bg-[#f0d5c0] rounded-full animate-pulse" />
              <div className="h-14 w-72 bg-[#f0d5c0] rounded-2xl animate-pulse" />
              <div className="h-4 w-96 bg-[#f0d5c0] rounded animate-pulse" />
              <div className="h-4 w-80 bg-[#f0d5c0] rounded animate-pulse" />
              <div className="h-28 w-full bg-[#f0d5c0] rounded-2xl animate-pulse mt-4" />
            </div>
            <div className="h-[520px] bg-[#f0d5c0] rounded-[32px] animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  const blog = blogs[0];

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)`,
      }}
    >
      {/* HEAT GLOW */}
      <motion.div
        aria-hidden
        animate={reduce ? {} : { opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)",
        }}
      />

      {/* GRAIN */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "url('/noise.png')", opacity: 0.02 }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-20 lg:grid-cols-[1.05fr_0.95fr] items-center">

          {/* ── LEFT ── */}
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>

            {/* Badge */}
            <motion.div variants={fadeUp} className="relative inline-flex">
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))] opacity-70" />
              <p className="relative inline-flex items-center whitespace-nowrap px-6 py-2 sm:px-7 sm:py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.35em] text-[#B86B45] rounded-full bg-[rgba(255,255,255,0.22)] backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_rgba(15,23,42,0.22)]">
                From Our Experts
              </p>
            </motion.div>

            {/* Heading */}
            <motion.h2 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl font-serif font-semibold leading-tight text-[#3C2A25]">
              Read Before You
              <br />
              <span className="text-[#B86B45] font-light">Install Anything</span>
            </motion.h2>

            {/* Bullets */}
            

            {/* Latest Article Card */}
            <motion.div
              variants={fadeUp}
              className="mt-10 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-[0_8px_32px_rgba(184,107,69,0.08)] overflow-hidden"
            >
              {/* top accent line */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C]" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B86B45]/70">
                    Latest Article
                  </p>
                  {blog.category && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#B86B45] bg-[#FFF0E6] px-3 py-1 rounded-full border border-[#FFD6B0]">
                      {blog.category}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-semibold text-[#3C2A25] leading-snug">
                  {blog.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#5A4036] line-clamp-2">
                  {blog.shortDescription}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#B86B45]/50">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-semibold text-[#B86B45] hover:underline flex items-center gap-1"
                  >
                    Read Article <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/blog/${blog.slug}`}
                className="relative inline-flex items-center justify-center rounded-full px-10 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] shadow-[0_22px_70px_rgba(184,107,69,0.45)] transition-all duration-300 hover:scale-[1.05]"
              >
                Read Article
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 rounded-full border border-[#FFD6A6] bg-white/70 px-10 py-3.5 text-sm font-medium text-[#3C2B27] transition hover:bg-[#FFE8CF]"
              >
                View All Articles <span className="text-[#B86B45]">→</span>
              </Link>
            </motion.div>

          </motion.div>

          {/* ── RIGHT, IMAGE ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative overflow-hidden rounded-[32px] bg-[#FFF8F0] shadow-[0_50px_140px_rgba(0,0,0,0.18)] cursor-pointer group">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: "center 15%" }}
                  />
                ) : (
                  <div className="h-[520px] w-full bg-gradient-to-br from-[#FFF4E8] to-[#FFD6A6] flex items-center justify-center">
                    <span className="text-[#B86B45]/20 text-8xl font-serif">✦</span>
                  </div>
                )}
                {/* hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              </div>
            </Link>

            {/* FLOATING DATE BADGE */}
            <div className="absolute -bottom-8 left-8 rounded-2xl bg-white px-6 py-4 shadow-xl border border-[#f5e6d8]">
              <p className="font-semibold text-[#3C2A25] text-sm">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>
              <p className="mt-0.5 text-xs text-[#B86B45]">
                {blog.category || "Article"} · Read Now
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}





