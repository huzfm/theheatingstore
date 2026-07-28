'use client';

import ImagePanel from './ImagePanel';

/**
 * One benefit, one complete presentation card, in one of two editorial
 * compositions (`mode`, chosen per scene by SceneManager's SCENE_MODE map):
 *  - 'a'  image-dominant beside a frosted glass copy panel (the site's
 *         existing template, just re-proportioned so the photo leads)
 *  - 'b'  the image fills nearly the whole frame and the copy sits directly
 *         on top of it, on a side-anchored scrim
 * Image is placed on alternating sides scene to scene so the sequence has
 * editorial rhythm rather than a repeated template — and, per
 * usePinnedTimeline's getFrameMotion/getImageDrift/getCopyPanelMotion, the
 * entry motion itself mirrors on alternating scenes too, so an
 * image-on-left scene doesn't just inherit the same rightward hinge/pan as
 * its image-on-right neighbour with the layout flipped underneath it. Both
 * modes share that same alternation and the same ref API below — `mode`
 * only changes which JSX/CSS those refs land on, never the motion math.
 *
 * The copy block carries two independent layers of motion, both driven
 * imperatively by usePinnedTimeline (never React state): a faint
 * whole-block depth-offset (`copyRef`, see getCopyPanelMotion) so it
 * doesn't move as one rigid unit with the image, and a four-stop
 * decelerating stagger across its own children (`copyIndexRef` →
 * `copyHeadingRef` → `copyBodyRef` → `copyRowstatRef`, see the
 * getScene*Motion family in timeline.js) so the card reads like a held
 * breath rather than everything landing on the same beat. The counter-stat
 * badge, where present, isn't its own stop — it shares the index's exact
 * timing (`copyCounterRef`, same getSceneIndexMotion call), both being
 * top-of-card framing rather than part of the two-beat heading/body
 * narrative arc.
 */
export default function Scene({
  scene,
  mode = 'a',
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
  const isModeB = mode === 'b';
  const textSide = imageOnRight ? 'left' : 'right';

  const copyBlock = (
    <div
      ref={copyRef}
      className={isModeB ? 'weh-scene-overlay-copy' : 'weh-scene-copy'}
      style={{ '--weh-accent': scene.accent }}
    >
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
  );

  if (isModeB) {
    return (
      <div ref={rootRef} className="weh-beat weh-scene weh-scene--modeB" data-scene={scene.id}>
        <div className={`weh-scene-full weh-scene-full--text${textSide}`}>
          <ImagePanel
            src={scene.image}
            alt={scene.title}
            accent={scene.accent}
            imageRef={imageRef}
            frameRef={frameRef}
            sweepRef={sweepRef}
            strongScrim
            textSide={textSide}
            className="weh-scene-image weh-scene-image--full"
          />
          {copyBlock}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="weh-beat weh-scene weh-scene--modeA" data-scene={scene.id}>
      <div className={`weh-scene-grid ${imageOnRight ? 'weh-scene-grid--right' : 'weh-scene-grid--left'}`}>
        {copyBlock}
        <ImagePanel
          src={scene.image}
          alt={scene.title}
          accent={scene.accent}
          imageRef={imageRef}
          frameRef={frameRef}
          sweepRef={sweepRef}
          className="weh-scene-image weh-scene-image--dominant"
        />
      </div>
    </div>
  );
}
