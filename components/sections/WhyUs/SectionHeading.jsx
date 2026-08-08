'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';

/**
 * The eyebrow + headline (+ optional intro) block that opens every section on
 * this page.
 *
 * It existed seven times across the three routes being merged, copy-pasted with
 * the same clamp, the same tracking and the same `[&_span]:leading-[inherit]`
 * escape hatch, and it had already drifted — some copies used a heat-400
 * eyebrow, some bone-500, for no reason anyone could point at. One component
 * means the page's section rhythm is defined once.
 *
 * Two layouts, chosen by whether an intro is supplied: a stacked heading when
 * the section speaks for itself, and a two-column split with the intro set
 * opposite the headline when it needs a line of setup.
 *
 * `titleWidth` is a max-width class for the headline. Short headlines want a
 * tighter measure so they break where the writing intends rather than wherever
 * the column happens to end.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  titleWidth = '',
  children,
}) {
  const heading = (
    <div>
      <Reveal>
        <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
          <span className="h-px w-8 bg-heat-500/60" />
          {eyebrow}
        </span>
      </Reveal>
      <RevealText
        as="h2"
        className={`mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit] ${titleWidth}`}
      >
        {title}
      </RevealText>
    </div>
  );

  if (!intro && !children) {
    return <div className="max-w-2xl">{heading}</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {heading}
      <Reveal delay={0.12}>
        <div className="lg:mt-4">
          {intro && (
            <p className="max-w-xl text-base leading-relaxed text-bone-300">
              {intro}
            </p>
          )}
          {children}
        </div>
      </Reveal>
    </div>
  );
}
