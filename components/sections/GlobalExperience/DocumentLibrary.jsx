'use client';

import { Download } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { DOCS } from './data';

/**
 * Manufacturer documentation. The most genuinely useful thing on this page,
 * and the previous version had it as a row of logos where the PDF link was the
 * least prominent element in each card. Here the document is the subject and
 * the logo is the identifier.
 *
 * Logos sit on light plates for the same reason as the brand wall on
 * /local-experience: these are transparent files at wildly different aspect
 * ratios carrying their own colours, and there is no single tint that flatters
 * all of them on near-black. Danfoss has no logo file at all, the old page
 * pointed at a /brandimages/danfoss.webp that does not exist and rendered a
 * broken image, so a missing logo falls back to a wordmark.
 *
 * download + the encoded href: one filename contains a space.
 */
export default function DocumentLibrary() {
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
                {DOCS.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 max-w-[14ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {DOCS.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-4">
              {DOCS.intro}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {DOCS.list.map((d) => (
            <RevealItem key={d.name}>
              <a
                href={encodeURI(d.pdf)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-5 rounded-[22px] border border-white/10 bg-ink-900/60 p-5 transition-colors duration-500 hover:border-heat-500/30 hover:bg-ink-900 sm:p-6"
              >
                {/* Light plate, fixed height, object-contain: a wide wordmark
                    and a square badge both sit correctly, neither cropped. */}
                <span className="flex h-[74px] items-center justify-center rounded-xl bg-bone-100 px-5">
                  {d.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={d.logo}
                      alt={`${d.name} logo`}
                      loading="lazy"
                      className="max-h-[46px] w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="font-serif text-2xl tracking-wide text-ink-950">
                      {d.name}
                    </span>
                  )}
                </span>

                <span className="flex flex-1 flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-heat-400">
                    {d.docType}
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-tight tracking-wide text-bone-100">
                    {d.docTitle}
                  </span>

                  <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[11.5px] text-bone-500">
                    <span>
                      PDF · {d.pages}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-heat-400">
                      Open
                      <Download
                        size={13}
                        strokeWidth={1.8}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-y-0.5"
                      />
                    </span>
                  </span>
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
