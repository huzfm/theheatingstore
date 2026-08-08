'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { HERO } from './data';

/**
 * Dark cinematic opener: word-stagger headline, standfirst, CTAs and a
 * three-figure fact strip, stacked on one centred axis over a relevant,
 * heavily-darkened backdrop.
 *
 * The right half used to carry a framed instrument panel: ThermostatDial (kept,
 * and still used by /working) over HeatFloorAnimation (kept, ditto), auto-
 * cycling through an installed system's states. It drove the status chip above
 * the headline and a grid caption of its own. Panel and dial are both gone with
 * nothing in their place, and so is every claim they made about live grid
 * state, since nothing here reports a real reading any more.
 *
 * The copy was then re-set from left-aligned to centred, which is not a class
 * swap: the background's directional ramps, the standfirst's left rule and the
 * fact strip's flush-left first cell were all built to anchor a column against
 * the left edge, and each is re-derived for the axis below. Every block keeps
 * its own measure, so nothing runs the container's full 1280px.
 *
 * The heating mat itself is the subject of StoryRail further down the page, so
 * the hero doesn't pre-empt it.
 */
export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-bone-100">
      {/* Full-bleed backdrop image. The source is dark to begin with, so the
          overlays below can only ever subtract from an already-low exposure,
          which is why it is lifted here at the source rather than by thinning
          the overlays further, past the point where the copy stays readable. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/abo.png')`,
          filter: 'brightness(1.35) contrast(0.96) saturate(1.06)',
        }}
      />
      {/* Legibility + mood. The horizontal ramp used to be left-weighted
          (0.94 → 0.55) to sink the copy column into the dark side and leave the
          photograph readable on the right. With the copy centred there is no
          light side to protect, so it is symmetric: darkest at both edges,
          lifting slightly at the middle so the backdrop still shows through
          behind the headline rather than being flattened to black. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.52) 50%, rgba(10,10,10,0.78) 100%), linear-gradient(180deg, rgba(10,10,10,0.22), rgba(10,10,10,0.72))',
        }}
      />
      {/* Ambient heat wash, slow breathing pulse, stilled under reduced motion.
          Re-centred: the main pool sat at 74% because that is where the dial
          was, and left behind it would have lit an empty half. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60vw 45vh at 50% 28%, rgba(255,138,61,0.16), transparent 62%), radial-gradient(70vw 35vh at 50% 100%, rgba(255,138,61,0.08), transparent 65%)',
        }}
      />
      {/* Vignette, pulls the eye off the frame edges and onto the copy. Eased
          back with the rest: it lands on the corners, where the two ramps above
          are already at their darkest, so it was the layer crushing them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 85% at 50% 40%, transparent 52%, rgba(0,0,0,0.42) 100%)',
        }}
      />
      {/* Fine grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* svh not vh: on mobile `100vh` is measured with the URL bar hidden, so
          it overflows by the height of the bar and pushes content under the
          fold.

          One centred column at every width now the panel is gone. Each block
          keeps its own measure and is centred on the axis rather than filling
          the 1280px container: a centred headline that runs the full container
          width is unreadable, and the whole point of centring is that the eye
          returns to the same line start every time. */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-32 lg:pt-36">
        {/* Copy */}
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Eyebrow as a chip rather than a bare line: it reads as a badge
              against a photographic backdrop, where a hairline + text alone
              gets lost in whatever is behind it. The dot used to mirror the
              dial's outage state; with the dial gone it is decorative, so it
              just holds the heat colour and breathes. */}
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-4 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-300 backdrop-blur-sm sm:text-[11px] sm:tracking-[0.28em]">
              <motion.span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: '#ff8a3d',
                  boxShadow: '0 0 10px 2px rgba(255,138,61,0.75)',
                }}
                animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {HERO.eyebrow}
            </span>
          </Reveal>

          {/* Two blocks, not one: the second half carries the heat gradient,
              which is the whole point of the sentence. aria-label on the
              wrapper keeps the h1 a single readable string, and the halves are
              aria-hidden so a screen reader doesn't hear it twice.
              [&_span]:leading-[inherit]: RevealText wraps each word in a bare
              <span>, which globals.css gives line-height 1.75. Without this
              the headline's wrapped lines on a phone sit nearly twice as far
              apart as the clamp asks for. */}
          <h1
            aria-label={HERO.headline}
            className="mx-auto mt-5 max-w-[19ch] font-serif tracking-[0.005em] sm:mt-7"
            // Inline, not a text-* utility: globals.css sizes `h1` outside any
            // cascade layer (clamp(2.5rem, 6vw, 5rem)), and unlayered rules beat
            // Tailwind utilities, so a class here is silently ignored. Inline
            // wins, and is the only way to give this headline its own scale.
            style={{ fontSize: 'clamp(1.95rem, 6.6vw, 4.5rem)', lineHeight: 1.03 }}
          >
            {/* style={{lineHeight:'inherit'}} on both halves for the same
                reason as the h1's inline font-size: these wrappers are spans,
                and globals.css's unlayered `span { line-height: 1.75 }` would
                otherwise double-space the headline whatever the h1 says. */}
            <RevealText
              as="span"
              aria-hidden
              className="block text-bone-100"
              style={{ lineHeight: 'inherit' }}
            >
              {HERO.headlineLead}
            </RevealText>
            <RevealText
              as="span"
              aria-hidden
              delay={0.18}
              className="block bg-gradient-to-br from-heat-300 via-heat-500 to-heat-500/55 bg-clip-text text-transparent"
              style={{ lineHeight: 'inherit' }}
            >
              {HERO.headlineAccent}
            </RevealText>
          </h1>

          {/* The standfirst used to hang off a rule down its left edge, tying
              it to the headline as a caption. Centred, that rule would read as
              a stray mark, so it becomes a short horizontal one on the axis
              doing the same job: it separates the two blocks and keeps the
              paragraph from reading as the next thing down. Fades out both
              ways so it sits in the layout rather than cutting across it. */}
          <Reveal delay={0.12}>
            <span
              aria-hidden
              className="mx-auto mt-6 block h-px w-16 sm:mt-8 sm:w-20"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,138,61,0.6), transparent)',
              }}
            />
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-[13.5px] leading-[1.7] text-bone-300 sm:mt-8 sm:text-lg sm:leading-relaxed">
              {HERO.sub}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <HeroCTAs center className="mt-8 sm:mt-11" />
          </Reveal>

          {/* Three figures the page then backs up, so the opener carries proof
              and not only claims. This was sm-up only while the dial shared the
              phone's first screen, it being the block that pushed the dial
              below the fold. With the panel gone the room is back, so it shows
              at every width; the smaller half of its type scale was always
              here, waiting for exactly that. */}
          <Reveal delay={0.4}>
            {/* Centred, the cells share one rhythm instead of the old left-set
                one: the first cell no longer drops its divider and left padding
                (that was so the strip aligned flush with the copy edge), so the
                three read as equal columns either side of the middle one. */}
            <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-3 border-t border-white/10 pt-7 sm:mt-14 sm:pt-8">
              {HERO.facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`px-2 sm:px-5 ${i > 0 ? 'border-l border-white/10' : ''}`}
                >
                  <dt className="font-serif text-[clamp(1.15rem,4.6vw,1.5rem)] leading-none text-heat-400 sm:text-[clamp(1.6rem,2.6vw,2.1rem)]">
                    {f.value}
                  </dt>
                  <dd
                    className="mx-auto mt-2.5 max-w-[20ch] text-[10.5px] leading-snug text-bone-500 sm:mt-3 sm:text-[13px] sm:leading-relaxed"
                    style={{ hyphens: 'auto' }}
                  >
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

      </div>

      {/* Scroll cue. Desktop only: on a phone the fold already lands close
          under the CTAs, and a cue there would collide with the floating
          widget this route carries bottom-left. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 hidden justify-center lg:flex">
        <motion.span
          aria-hidden
          className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/15 pt-2"
          animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className="block h-1.5 w-[3px] rounded-full bg-heat-500"
            animate={reduce ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.span>
      </div>

      {/* Seam glow into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
      />
    </section>
  );
}
