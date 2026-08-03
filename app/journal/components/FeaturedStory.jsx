'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FEATURED } from '../data';

const EASE = [0.16, 1, 0.3, 1];

function setLight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

/**
 * Large magazine-style lead feature, immediately below the hero.
 * ~63% image / 37% text on desktop; image-first stack on mobile.
 */
export default function FeaturedStory() {
  const reduce = useReducedMotion();
  const article = FEATURED;
  if (!article) return null;

  return (
    <section className="relative bg-[var(--jr-paper)] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <a
          href={article.href}
          className="jr-card group flex flex-col lg:flex-row lg:items-stretch lg:gap-14"
        >
          {/* Image, ~63% */}
          <div className="relative lg:basis-[63%]">
            <div
              className="group/img relative w-full overflow-hidden aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5]"
              onMouseMove={reduce ? undefined : setLight}
              style={{ '--mx': '50%', '--my': '50%' }}
            >
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { clipPath: 'inset(6% round 2px)', opacity: 0.4 }}
                whileInView={{ clipPath: 'inset(0% round 2px)', opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.7, ease: EASE }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 1.12, filter: 'blur(12px)' }}
                  whileInView={{ scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 2, ease: EASE }}
                >
                  <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    priority
                    sizes="(min-width:1024px) 63vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                  />
                </motion.div>
              </motion.div>
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,214,166,0.28), transparent 60%)',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(23,19,15,0.02) 0%, transparent 30%, rgba(23,19,15,0.14) 100%)' }}
              />
            </div>
          </div>

          {/* Text, ~37% */}
          <div className="relative mt-8 flex flex-col justify-center lg:mt-0 lg:basis-[37%]">
            <span
              aria-hidden
              className="jr-display pointer-events-none absolute -top-6 right-0 select-none text-[6.5rem] leading-none text-[var(--jr-ink)]/[0.05] sm:text-[8rem] lg:-top-10 lg:right-auto lg:left-0"
            >
              01
            </span>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="relative"
            >
              <p className="jr-eyebrow text-[var(--jr-accent)]">
                Featured &mdash; 01 &middot; {article.category}
              </p>

              <h2 className="jr-display mt-5 text-[var(--jr-ink)] text-[clamp(2.1rem,4.2vw,3.5rem)] normal-case">
                <span className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] inline-block">
                  {article.title}
                </span>
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--jr-ink-soft)] transition-opacity duration-500 group-hover:opacity-85 sm:text-base">
                {article.dek}
              </p>

              <span className="relative mt-7 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--jr-ink)]">
                Read the Story
                <span aria-hidden className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5 text-[var(--jr-accent)]">
                  &#8599;
                </span>
                <span className="absolute left-0 -bottom-1.5 h-px w-full origin-left scale-x-0 bg-[var(--jr-accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </span>
            </motion.div>
          </div>
        </a>
      </div>
    </section>
  );
}
