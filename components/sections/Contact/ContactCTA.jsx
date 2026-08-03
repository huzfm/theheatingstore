'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { CTA, PHONE, PHONE_DISPLAY, WHATSAPP } from './data';

/**
 * Closing panel. Same raised heat-lit treatment as every other route's closer,
 * with the two immediate channels rather than the shared HeroCTAs pair, whose
 * primary button links to this page.
 *
 * The global footer is hidden on /contact, so this is genuinely the last thing
 * on the screen and carries a little extra bottom padding for it.
 */
export default function ContactCTA() {
  return (
    <section className="relative bg-ink-950 px-5 pb-32 pt-4 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(80% 120% at 50% 0%, rgba(255,138,61,0.22), transparent 60%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
            }}
          />
          <Reveal>
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-heat-400">
              {CTA.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mx-auto mt-5 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {CTA.title}
          </RevealText>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-bone-300">
              {CTA.sub}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2.5 rounded-full bg-heat-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400"
              >
                <Phone size={16} strokeWidth={1.9} aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-bone-500/30 px-7 py-3.5 text-sm font-semibold text-bone-100 transition-colors duration-200 hover:border-heat-500/60 hover:text-white"
              >
                <MessageCircle size={16} strokeWidth={1.9} aria-hidden />
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
