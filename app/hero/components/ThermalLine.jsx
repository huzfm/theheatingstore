'use client';

/**
 * The thermal reveal primitive.
 *
 * Every piece of text in the hero arrives through this component, and the
 * scroll exit runs the same primitive backwards. That single shared mechanism
 * is what makes the entrance and the exit read as one motion system instead of
 * a load animation followed by an unrelated scroll effect.
 *
 * The component itself renders no animation logic. It publishes a `data-reveal`
 * group name and lets `IgnitionTimeline` and `ScrollController` drive `--t`,
 * which `hero.css` turns into a travelling mask, a resolving blur, and a colour
 * warming from cold grey to its final value. Keeping the markup declarative and
 * the timing central means re-cueing the hero is a one-file edit.
 */
export default function ThermalLine({
  as: Tag = 'span',
  /** Cue group, must match a key in IgnitionTimeline's CUE map. */
  group,
  /** Adds the blur pass. Reserved for large type; it is the expensive part. */
  soft = false,
  /**
   * Final colour once fully warmed. Passed through as a custom property so the
   * `color-mix` ramp in CSS has something to interpolate toward.
   */
  color,
  /**
   * Renders an aria-hidden duplicate that a bright band sweeps across once the
   * line has landed, the firelight crossing the copper headline lines.
   */
  sweep = false,
  className = '',
  style,
  children,
  ...rest
}) {
  const classes = ['h-warm', soft ? 'is-soft' : '', className].filter(Boolean).join(' ');

  return (
    <Tag
      data-reveal={group}
      className={classes}
      style={color ? { '--line-color': color, ...style } : style}
      {...rest}
    >
      {children}
      {sweep && (
        <span className="hero__sweep" data-sweep aria-hidden="true">
          {children}
        </span>
      )}
    </Tag>
  );
}
