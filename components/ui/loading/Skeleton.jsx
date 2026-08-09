/**
 * Skeleton, a sized placeholder for content that has not arrived.
 *
 * The rule this component exists to enforce: a skeleton reserves the exact
 * box its real content will occupy. A skeleton of the wrong height is worse
 * than blank space, because blank space shifts once and a wrong skeleton
 * shifts twice. Callers therefore pass real dimensions, never "roughly".
 *
 * Two tones, matching the two palettes already in the codebase:
 *   warm, the cream marketing pages (#FFF8F0 ground). Base #f0d5c0 is the
 *         value the blog skeletons were already using.
 *   dark, the `.exp` system (ink ground, white-alpha surfaces).
 *
 * The shimmer, its reduced-motion behaviour and the tone tokens all live in
 * app/globals.css under `.eh-skel`, so there is one animation on the page
 * rather than one per instance.
 *
 * Accessibility: individual blocks are decorative and marked aria-hidden.
 * Announcing eight separate bars would be noise. Wrap a group in
 * <SkeletonGroup label="…"> for the single status message.
 */
export function Skeleton({
  tone = 'warm',
  className = '',
  rounded = 'rounded',
  style,
  ...rest
}) {
  return (
    <div
      aria-hidden="true"
      className={`eh-skel eh-skel-${tone} ${rounded} ${className}`}
      style={style}
      {...rest}
    />
  );
}

/**
 * The announced wrapper around one or more Skeletons.
 *
 * `aria-busy` marks the region as still resolving; the visually hidden label
 * is what a screen reader actually reads, once, instead of the blocks.
 */
export function SkeletonGroup({ label, className = '', children, ...rest }) {
  return (
    <div role="status" aria-busy="true" className={className} {...rest}>
      <span className="eh-sr-only">{label}</span>
      {children}
    </div>
  );
}

export default Skeleton;
