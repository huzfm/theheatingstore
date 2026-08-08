'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { BRANDS } from '@/app/lib/brandsData';
import SectionHeading from './SectionHeading';
import { BRAND_INTRO } from './data';

/**
 * Logo wall. The six brands, shown as brands are actually shown.
 *
 * Two constraints drove this, both from the assets. The logos in
 * public/brandimages are transparent PNG/WEBP at wildly different aspect
 * ratios — a 2080x800 wordmark next to a near-square badge — so any layout that
 * crops them to a common box mangles half the set. They are `contain`ed inside
 * a fixed-height frame instead, each free to be whatever shape it is.
 *
 * And they carry their own colours. There is no single tint or invert that
 * flatters all six on a near-black page, so each sits on a light tile; that is
 * why every dark site shows partner logos this way.
 *
 * The list comes from app/lib/brandsData, the same source /brands/[slug] and
 * /product read, so this page cannot disagree with the brand pages it links to.
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
        <SectionHeading
          eyebrow={BRAND_INTRO.eyebrow}
          title={BRAND_INTRO.title}
          titleWidth="max-w-[12ch]"
          intro={BRAND_INTRO.intro}
        />

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
                      className="shrink-0 text-bone-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-heat-400"
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
      </div>
    </section>
  );
}
