'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { BRANDS } from '@/app/lib/brandsData';
import { BRAND_INTRO } from './data';

/**
 * Logo wall. The six brands, shown as brands are actually shown.
 *
 * Two constraints drove this, both from the assets themselves. The logos in
 * public/brandimages are transparent PNG/WEBP at wildly different aspect
 * ratios, a 2080x800 wordmark next to a near-square circular badge, so any
 * layout that crops them to a common box (`object-fit: cover`, which is what
 * the previous pass did) mangles half the set. They are `contain`ed inside a
 * fixed-height frame instead, each free to be whatever shape it is.
 *
 * And they carry their own colours, orange on transparent, red-and-grey on
 * transparent, dark wordmarks. There is no single tint or invert that flatters
 * all six on a near-black page, so each sits on a light tile. That is why every
 * dark site shows partner logos this way: the tile normalises the background,
 * so the logos stay correct and the wall stays even.
 *
 * The list comes from app/lib/brandsData, the same source /brands/[slug] and
 * /product read, so this page cannot disagree with the brand pages. Each tile
 * links to the brand page that already exists.
 */
export default function BrandWall() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.06), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {BRAND_INTRO.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 max-w-[12ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {BRAND_INTRO.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-4">
              {BRAND_INTRO.intro}
            </p>
          </Reveal>
        </div>

        {/* gap-px over a light background paints the hairline grid between
            tiles, so the wall reads as one object rather than six cards. */}
        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-3"
          stagger={0.07}
        >
          {BRANDS.map((brand) => (
            <RevealItem key={brand.slug}>
              <Link
                href={`/brands/${brand.slug}`}
                className="group relative flex h-full flex-col justify-between gap-6 bg-ink-950 p-5 transition-colors duration-500 hover:bg-ink-900 sm:p-7"
              >
                {/* Light plate. Fixed height + object-contain means a wide
                    wordmark and a square badge both sit correctly without
                    either being cropped or blown up. */}
                <span className="flex h-[86px] items-center justify-center rounded-xl bg-bone-100 px-5 transition-transform duration-500 group-hover:scale-[1.02] sm:h-[96px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.img}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    className="max-h-[54px] w-auto max-w-full object-contain sm:max-h-[62px]"
                  />
                </span>

                <span className="block">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-serif text-lg leading-none tracking-wide text-bone-100">
                      {brand.name}
                    </span>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden
                      className="shrink-0 text-bone-500 transition-all duration-300 group-hover:text-heat-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-bone-500">
                    {brand.origin}
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-bone-500/70">
            We are an authorised distributor for each of these, which is the
            part that matters after the invoice, a fault here is our callout
            rather than a claim form posted to another country.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
