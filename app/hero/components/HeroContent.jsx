'use client';

import ThermalLine from './ThermalLine';
import HeroCTAs from '@/components/ui/HeroCTAs';

/**
 * The copy column, four acts, one idea at a time.
 *
 * On tier 2 (`ScrollController`'s `cinematic` mode) each `.hero__act` group
 * occupies the same position in a stacked grid (see `hero.css`) and is
 * revealed, then fully retired, before the next one arrives, Act 1 (badge +
 * headline) at load, Acts 2–4 on the scroll timeline defined in
 * `lib/sceneTimeline.js`'s `ACT` windows. On every other tier there is no
 * room for a scroll story, so the acts simply stack as an ordinary column and
 * all arrive together, as the hero has always done for that tier.
 *
 * The stat rail and the trust line that used to sit here are both gone 
 * by explicit direction, to keep the closing shot to exactly three things:
 * the scene, the line, the CTAs.
 *
 * The `group` names still map to cue points in `IgnitionTimeline` /
 * `ScrollController`, that contract is unchanged; `.hero__act` is a layout
 * concern layered on top of it, not a replacement for it.
 */

const HEADLINE = [
  { text: 'Underfloor Heating &', tone: 'ivory' },
  { text: 'Electric Hamam Systems.', tone: 'ivory' },
  { text: 'Installed Across India', tone: 'copper' },
  { text: 'with global experience.', tone: 'copper' },
];

export default function HeroContent() {
  return (
    <div className="hero__content" data-content>
      <div className="hero__col">
        {/* Act 1, typography only. */}
        <div className="hero__act hero__act--1">
          <ThermalLine group="badge" className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            India&apos;s Largest Underfloor Heating Seller Since 2011
          </ThermalLine>

          <h1 className="hero__heading">
            {HEADLINE.map((line) => (
              <ThermalLine
                key={line.text}
                group="headline"
                className="hero__line"
                soft
                color={line.tone === 'copper' ? 'var(--copper-light)' : 'var(--ivory)'}
                // Only the copper lines take the firelight sweep. On all four
                // it would read as an effect applied to a headline; on the
                // two that carry the brand colour it reads as the fire in
                // the room.
                sweep={line.tone === 'copper'}
              >
                {line.text}
              </ThermalLine>
            ))}
          </h1>
        </div>

        {/* Act 2, Engineering Story: how the system gets designed and
            installed, arriving left-set against a rule as the camera settles
            on the exhibit. */}
        <div className="hero__act hero__act--2">
          <ThermalLine as="p" group="paragraph" className="hero__paragraph" soft>
            From custom designs and consultation to certified installations. The Heating
            Store delivers advanced electric heating system trusted by homeowners,
            architects, and builders.
          </ThermalLine>
        </div>

        {/* Act 3, Thermal Technology: proven performance, set right against
            a mirrored rule so the frame's balance visibly swaps sides from
            Act 2, as the floor opens and the pipes come into view. */}
        <div className="hero__act hero__act--3">
          <ThermalLine as="p" group="climate" className="hero__climate hero__climate--act">
            Proven performance in extreme climates down to &minus;25&deg;C across Ladakh,
            Dras, Kargil, and Kashmir
          </ThermalLine>
        </div>

        {/* Act 4, the closing shot. Everything has settled: the camera has
            nearly stopped, the thermal flow has slowed, the room has dimmed
            a touch so the type is the only thing left to look at. The
            heading is split into two lines on purpose, `ScrollController`
            slides them in from opposite edges to meet at centre, which is
            why they're separate elements rather than one text node. The one
            new line in this hero, by explicit direction, every other word
            on this page is the original copy, untouched. Mounted full-bleed
            and centred (see hero.css §7), not inside the left-set column the
            other acts share. */}
        <div className="hero__act hero__act--4">
          <h2 className="hero__finale-heading" data-reveal="finale">
            <span className="hero__finale-line hero__finale-line--left">Ready to experience</span>
            <span className="hero__finale-line hero__finale-line--right">radiant comfort?</span>
          </h2>

          <div className="hero__finale-ctas">
            <ThermalLine group="cta" className="hero__cta-row">
              <HeroCTAs center />
            </ThermalLine>
          </div>
        </div>
      </div>
    </div>
  );
}
