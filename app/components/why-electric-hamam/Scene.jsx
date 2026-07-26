'use client';

import ImagePanel from './ImagePanel';

/**
<<<<<<< HEAD
 * One benefit, one complete presentation card, image, kicker, heading,
 * body, and stat all arrive, hold and leave together as a single
 * composition (see usePinnedTimeline: only `root` is animated here, so
 * everything below inherits its motion rather than staggering on its own
 * schedule). Image is placed on alternating sides scene to scene so the
 * sequence has editorial rhythm rather than a repeated template.
 *
 * The copy sits on its own frosted glass panel, the "premium glass
 * surface" the brief calls for on the text side to match the photograph's
 * own glass-edged frame, rather than type floating directly on the page
 * background.
=======
 * One benefit, one complete presentation card. Image is placed on
 * alternating sides scene to scene so the sequence has editorial rhythm
 * rather than a repeated template — and, per usePinnedTimeline's
 * getFrameMotion/getImageDrift/getCopyPanelMotion, the entry motion itself
 * mirrors on alternating scenes too, so an image-on-left scene doesn't
 * just inherit the same rightward hinge/pan as its image-on-right
 * neighbour with the layout flipped underneath it.
 *
 * The copy panel sits on its own frosted glass surface — matching the
 * photograph's own glass-edged frame — and carries two independent layers
 * of motion, both driven imperatively by usePinnedTimeline (never React
 * state): a faint whole-panel depth-offset (`copyRef`, see
 * getCopyPanelMotion) so it doesn't move as one rigid unit with the image,
 * and a four-stop decelerating stagger across its own children
 * (`copyIndexRef` → `copyHeadingRef` → `copyBodyRef` → `copyRowstatRef`,
 * see the getScene*Motion family in timeline.js) so the card reads like a
 * held breath rather than everything landing on the same beat. The
 * counter-stat badge, where present, isn't its own stop — it shares the
 * index's exact timing (`copyCounterRef`, same getSceneIndexMotion call),
 * both being top-of-card framing rather than part of the two-beat
 * heading/body narrative arc.
>>>>>>> 8199ed9 (latest changes)
 */
export default function Scene({
  scene,
  rootRef,
  imageRef,
  frameRef,
  sweepRef,
  copyRef,
  copyIndexRef,
  copyCounterRef,
  copyHeadingRef,
  copyBodyRef,
  copyRowstatRef,
}) {
  const imageOnRight = scene.index % 2 === 1;

  return (
    <div ref={rootRef} className="weh-beat weh-scene" data-scene={scene.id}>
      <div className={`weh-scene-grid ${imageOnRight ? 'weh-scene-grid--right' : 'weh-scene-grid--left'}`}>
        <div ref={copyRef} className="weh-scene-copy" style={{ '--weh-accent': scene.accent }}>
          <span ref={copyIndexRef} className="weh-scene-index">
            {String(scene.index).padStart(2, '0')}
          </span>

          {scene.counterStat && (
            <p ref={copyCounterRef} className="weh-scene-counter">
              {scene.counterStat.value}
              <span className="weh-scene-counter-label">{scene.counterStat.label}</span>
            </p>
          )}

          <h3 ref={copyHeadingRef} className="weh-scene-title">
            {scene.title}
          </h3>
          <p ref={copyBodyRef} className="weh-scene-body">
            {scene.body}
          </p>

          {scene.rowStat && (
            <div ref={copyRowstatRef} className="weh-scene-rowstat">
              <span className="weh-scene-rowstat-value">{scene.rowStat.value}</span>
              <span className="weh-scene-rowstat-label">{scene.rowStat.label}</span>
            </div>
          )}
        </div>

        <ImagePanel
          src={scene.image}
          alt={scene.title}
          accent={scene.accent}
          imageRef={imageRef}
          frameRef={frameRef}
          sweepRef={sweepRef}
          className="weh-scene-image"
        />
      </div>
    </div>
  );
}
