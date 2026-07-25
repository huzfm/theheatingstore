'use client';

import ImagePanel from './ImagePanel';

/**
 * One benefit, one complete presentation card — image, kicker, heading,
 * body, and stat all arrive, hold and leave together as a single
 * composition (see usePinnedTimeline: only `root` is animated here, so
 * everything below inherits its motion rather than staggering on its own
 * schedule). Image is placed on alternating sides scene to scene so the
 * sequence has editorial rhythm rather than a repeated template.
 *
 * The copy sits on its own frosted glass panel — the "premium glass
 * surface" the brief calls for on the text side to match the photograph's
 * own glass-edged frame, rather than type floating directly on the page
 * background.
 */
export default function Scene({ scene, rootRef, imageRef, frameRef, sweepRef }) {
  const imageOnRight = scene.index % 2 === 1;

  return (
    <div ref={rootRef} className="weh-beat weh-scene" data-scene={scene.id}>
      <div className={`weh-scene-grid ${imageOnRight ? 'weh-scene-grid--right' : 'weh-scene-grid--left'}`}>
        <div className="weh-scene-copy" style={{ '--weh-accent': scene.accent }}>
          <span className="weh-scene-index">{String(scene.index).padStart(2, '0')}</span>

          {scene.counterStat && (
            <p className="weh-scene-counter">
              {scene.counterStat.value}
              <span className="weh-scene-counter-label">{scene.counterStat.label}</span>
            </p>
          )}

          <h3 className="weh-scene-title">{scene.title}</h3>
          <p className="weh-scene-body">{scene.body}</p>

          {scene.rowStat && (
            <div className="weh-scene-rowstat">
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
