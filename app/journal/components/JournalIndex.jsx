'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ARTICLES, INDEX_ARTICLES, CATEGORIES } from '../data';

const EASE = [0.16, 1, 0.3, 1];
const TOTAL = ARTICLES.length;

function setLight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

function ArticleMeta({ article }) {
  return (
    <p className="jr-eyebrow text-[var(--jr-accent)]">
      {article.id} / {String(TOTAL).padStart(2, '0')} &middot; {article.category}
    </p>
  );
}

function ReadLink({ dark }) {
  return (
    <span
      className={`relative mt-6 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] ${
        dark ? 'text-white' : 'text-[var(--jr-ink)]'
      }`}
    >
      Read the Story
      <span
        aria-hidden
        className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
          dark ? 'text-heat-300' : 'text-[var(--jr-accent)]'
        }`}
      >
        &#8599;
      </span>
      <span
        className={`absolute left-0 -bottom-1.5 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${
          dark ? 'bg-white' : 'bg-[var(--jr-accent)]'
        }`}
      />
    </span>
  );
}

function LandscapeArticle({ article, reduce }) {
  return (
    <a href={article.href} className="jr-card group grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="lg:col-span-7">
        <div
          className="group/img relative w-full overflow-hidden aspect-[16/11] sm:aspect-[16/9]"
          onMouseMove={reduce ? undefined : setLight}
          style={{ '--mx': '50%', '--my': '50%' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { clipPath: 'inset(6% round 2px)', opacity: 0.4 }}
            whileInView={{ clipPath: 'inset(0% round 2px)', opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <Image
              src={article.img}
              alt={article.title}
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          </motion.div>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,214,166,0.28), transparent 60%)' }}
          />
        </div>
      </div>
      <div className="lg:col-span-5">
        <ArticleMeta article={article} />
        <h3 className="jr-display mt-3 text-[var(--jr-ink)] text-[clamp(1.5rem,2.6vw,2.25rem)] normal-case transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
          {article.title}
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--jr-ink-soft)] transition-opacity duration-500 group-hover:opacity-85 sm:text-[15px]">
          {article.dek}
        </p>
        <ReadLink />
      </div>
    </a>
  );
}

function PanoramaArticle({ article, reduce }) {
  return (
    <a href={article.href} className="jr-card group block">
      <div
        className="group/img relative w-full overflow-hidden aspect-[16/10] sm:aspect-[21/9]"
        onMouseMove={reduce ? undefined : setLight}
        style={{ '--mx': '50%', '--my': '50%' }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: 'inset(6% round 2px)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% round 2px)', opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <Image
            src={article.img}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
          />
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.15) 45%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,214,166,0.22), transparent 60%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12">
          <p className="jr-eyebrow text-heat-300">
            {article.id} / {String(TOTAL).padStart(2, '0')} &middot; {article.category}
          </p>
          <h3 className="jr-display mt-3 max-w-2xl text-white text-[clamp(1.6rem,3.6vw,2.75rem)] normal-case transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
            {article.title}
          </h3>
          <ReadLink dark />
        </div>
      </div>
    </a>
  );
}

function QuoteArticle({ article, reduce }) {
  return (
    <a href={article.href} className="jr-card group grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className="lg:col-span-5">
        <div
          className="group/img relative w-full overflow-hidden aspect-[4/5]"
          onMouseMove={reduce ? undefined : setLight}
          style={{ '--mx': '50%', '--my': '50%' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { clipPath: 'inset(6% round 2px)', opacity: 0.4 }}
            whileInView={{ clipPath: 'inset(0% round 2px)', opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <Image
              src={article.img}
              alt={article.title}
              fill
              sizes="(min-width:1024px) 38vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          </motion.div>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,214,166,0.28), transparent 60%)' }}
          />
        </div>
      </div>
      <div className="lg:col-span-7">
        <ArticleMeta article={article} />
        {article.quote && (
          <p className="jr-serif-quote mt-4 text-[var(--jr-ink)] text-[clamp(1.3rem,2.4vw,1.9rem)] italic leading-snug">
            &ldquo;{article.quote}&rdquo;
          </p>
        )}
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--jr-ink-soft)] sm:text-[15px]">
          {article.dek}
        </p>
        <span className="relative mt-5 inline-block text-[13px] font-medium text-[var(--jr-ink)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
          {article.title}
          <span className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[var(--jr-accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        </span>
      </div>
    </a>
  );
}

const LAYOUTS = {
  landscape: LandscapeArticle,
  panorama: PanoramaArticle,
  quote: QuoteArticle,
};

export default function JournalIndex() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => (active === 'All' ? INDEX_ARTICLES : INDEX_ARTICLES.filter((a) => a.category === active)),
    [active]
  );

  return (
    <section className="relative bg-[var(--jr-paper)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="jr-eyebrow text-[var(--jr-accent)]">Editorial Index</p>
            <h2 className="jr-display mt-3 text-[var(--jr-ink)] text-[clamp(1.75rem,3.4vw,2.75rem)] normal-case">
              The Collection
            </h2>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-[var(--jr-ink-faint)] sm:text-right">
            Field notes, comparisons and climate studies from across Kashmir and India.
          </p>
        </div>

        {/* Topic navigation */}
        <nav
          aria-label="Filter articles by topic"
          className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-[var(--jr-line)] py-4 sm:mt-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              data-active={active === cat}
              className="jr-nav-item"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-24 lg:gap-28"
          >
            {filtered.map((article) => {
              const Layout = LAYOUTS[article.slot] ?? LandscapeArticle;
              return (
                <motion.div
                  key={article.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Layout article={article} reduce={reduce} />
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-16 text-center text-sm uppercase tracking-[0.2em] text-[var(--jr-ink-faint)]">
                No stories in this category yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
