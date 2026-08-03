'use client';

import { ArrowUpRight, CalendarDays, Mail, MessageCircle, Phone } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { CHANNELS } from './data';

const ICONS = {
  phone: Phone,
  whatsapp: MessageCircle,
  mail: Mail,
  calendar: CalendarDays,
};

/**
 * The four ways to reach us. gap-px over a light background paints the
 * hairline grid, the same construction as the index sections on the other
 * routes.
 *
 * Each tile is a link rather than a card containing a link, so the whole
 * target is tappable. The old page had two of the four with no action at all,
 * just a phone number in a paragraph.
 */
export default function ContactChannels() {
  return (
    <section className="relative bg-ink-950 px-5 pb-4 pt-20 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <RevealGroup
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {CHANNELS.map((c) => {
            const Icon = ICONS[c.icon] ?? Phone;
            return (
              <RevealItem key={c.title} className="h-full">
                <a
                  href={c.action.href}
                  {...(c.action.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex h-full flex-col bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 sm:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-heat-500/25 bg-heat-500/10 text-heat-400">
                    <Icon size={18} strokeWidth={1.6} aria-hidden />
                  </span>

                  <h3 className="mt-5 font-serif text-xl leading-tight tracking-wide text-bone-100">
                    {c.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-bone-300">
                    {c.body}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-heat-400">
                    {c.action.label}
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.8}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="mt-3 block border-t border-white/10 pt-3 text-[11.5px] leading-relaxed text-bone-500">
                    {c.note}
                  </span>
                </a>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
