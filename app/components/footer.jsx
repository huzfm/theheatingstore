'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Contact block, as a definition list rather than a row of icons.
 *
 * The previous footer put a small amber glyph beside each line. At three items
 * the glyphs read as decoration rather than as information, and they compete
 * with the wordmark for the only saturated colour on the page. A letterspaced
 * label in the left column carries the same meaning, sets type against type,
 * and lets the values themselves be the largest thing in the column.
 */
const CONTACT = [
  { label: 'Telephone', value: '+91 9070907035', href: 'tel:+919070907035' },
  { label: 'Email', value: 'info@theheatingstore.in', href: 'mailto:info@theheatingstore.in' },
  { label: 'Kashmir', value: 'Srinagar · Anantnag · Baramulla', href: null },
];

/**
 * One line, as it is set in the header. It was stacked a word per line, which
 * turned a three-word name into three separate words, and "The" on a line of
 * its own reads as a stray article rather than as part of the mark.
 */
const WORDMARK = [
  { text: 'The', accent: false },
  { text: 'Heating', accent: true },
  { text: 'Store', accent: false },
];

/**
 * Social, deliberately monochrome.
 *
 * These used to fill with each platform's own brand colour on hover, which put
 * WhatsApp green, Instagram magenta and Facebook blue into a panel whose only
 * other colour is the amber of the mark. Hovering to amber instead keeps the
 * footer on one palette and matches how every other link here behaves.
 */
const SOCIAL = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919070907035',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/theheatingstore?igsh=dnQ4NzZlbGhuZmlj',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/theheatingstore',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
];

export default function Footer() {
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2B1E1A 0%, #17100D 100%)' }}
    >
      {/* Hairline of light along the top edge, the seam between the page and
          the footer. Brightest at centre so it reads as a light source rather
          than as a border. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(232,147,58,0.55) 50%, transparent 100%)',
        }}
      />

      {/* Warm bloom under that seam, and a cooler pool bottom-right so the
          panel has a direction of light instead of being flatly lit. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 34% at 50% 0%, rgba(184,107,69,0.26), transparent 68%),' +
            'radial-gradient(45% 40% at 88% 100%, rgba(232,147,58,0.07), transparent 70%)',
        }}
      />

      {/* Grain, at the threshold of visible. Without it the two gradients band
          on wide displays, which is what makes a dark panel look cheap. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')", opacity: 0.035 }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-10 sm:px-10 lg:pt-32">
        {/* Wordmark left, everything said about the company right. Two columns
            rather than five: with the link lists gone, a wide gutter between
            two blocks is what makes the remaining content look deliberate
            instead of stranded. */}
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          {/* ── WORDMARK ── */}
          <motion.div {...rise(0)}>
            <Link href="/" className="inline-block no-underline">
              <span
                className="flex flex-wrap items-baseline gap-x-[0.28em]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  // Clamped rather than stepped: the mark is the largest thing
                  // in the footer at every width, and stepping it leaves it
                  // looking undersized through the middle of the range. The
                  // ceiling is what keeps the full name on one line inside the
                  // left column at desktop widths.
                  fontSize: 'clamp(1.9rem, 4.4vw, 3.25rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                }}
              >
                {WORDMARK.map(({ text, accent }) => (
                  <span
                    key={text}
                    style={{
                      fontWeight: accent ? 700 : 300,
                      color: accent ? '#E8933A' : 'rgba(255,255,255,0.88)',
                    }}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </Link>

            {/* Short rule under the mark, drawn on scroll. Origin-left so it
                reads as being ruled rather than as fading in. */}
            <motion.div
              aria-hidden
              className="mt-8 h-px w-24 origin-left"
              style={{
                background: 'linear-gradient(90deg, rgba(232,147,58,0.85), transparent)',
              }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            />

            {/* Social. Sits under the mark rather than under the contact list,
                so the right column stays a single unbroken table. */}
            <motion.div {...rise(0.32)} className="mt-8 flex gap-3">
              {SOCIAL.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] no-underline transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#E8933A]/55 hover:bg-[#E8933A]/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                    aria-hidden
                    className="text-white/55 transition-colors duration-500 group-hover:text-[#E8933A]"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── TAGLINE + CONTACT ── */}
          <div className="lg:pt-3">
            <motion.p
              {...rise(0.12)}
              className="max-w-md"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.85,
                color: 'rgba(226,212,199,0.86)',
              }}
            >
              Premium electric hammam &amp; underfloor heating, engineered for
              Kashmir&rsquo;s extreme winters and India&rsquo;s most demanding
              spaces.
            </motion.p>

            <dl className="mt-12">
              {CONTACT.map(({ label, value, href }, i) => {
                const isLink = Boolean(href);

                return (
                  <motion.div
                    key={label}
                    {...rise(0.22 + i * 0.08)}
                    /* Rule above every row, including the first, so the block
                       reads as a ruled table and the tagline above it gets a
                       clean edge to sit on. */
                    className="grid grid-cols-1 gap-1 border-t border-white/[0.09] py-5 sm:grid-cols-[7.5rem_1fr] sm:items-baseline sm:gap-6"
                  >
                    <dt
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10.5,
                        fontWeight: 500,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.34)',
                      }}
                    >
                      {label}
                    </dt>
                    <dd className="m-0">
                      {isLink ? (
                        <a
                          href={href}
                          className="group inline-block no-underline"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 17,
                            color: 'rgba(240,232,225,0.94)',
                            transition: 'color 0.35s cubic-bezier(0.16,1,0.3,1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#E8933A';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(240,232,225,0.94)';
                          }}
                        >
                          <span className="relative">
                            {value}
                            {/* Underline wipes in from the left on hover, the
                                same gesture as the rule under the wordmark. */}
                            <span
                              aria-hidden
                              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#E8933A] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                            />
                          </span>
                        </a>
                      ) : (
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 17,
                            lineHeight: 1.5,
                            color: 'rgba(240,232,225,0.94)',
                          }}
                        >
                          {value}
                        </span>
                      )}
                    </dd>
                  </motion.div>
                );
              })}
            </dl>
          </div>
        </div>

        <motion.p
          {...rise(0.5)}
          className="mt-20 border-t border-white/[0.07] pt-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11.5,
            letterSpacing: '0.06em',
            color: 'rgba(240,232,225,0.36)',
          }}
        >
          © 2011 The Heating Store. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}
