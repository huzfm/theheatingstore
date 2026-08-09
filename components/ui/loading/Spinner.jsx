/**
 * Inline spinner, for pending controls.
 *
 * Deliberately not a page overlay: it is sized in `em`-ish pixel steps to sit
 * next to a label inside a button, which is the only place this site should
 * be spinning anything.
 *
 * `currentColor` on the arc means it inherits the button's text colour, so
 * the same component works on the copper CTAs, the outline buttons and the
 * dark `.exp` controls without a colour prop. The track is the same colour at
 * low alpha via `opacity`, for the same reason.
 *
 * Decorative by default: a spinner inside a button whose label already says
 * what is happening does not need its own announcement, and the button's
 * `disabled` state is what conveys "not yet". Pass a `label` only when the
 * spinner is the sole indication.
 */
export default function Spinner({ size = 16, strokeWidth = 2.5, label, className = '', ...rest }) {
  return (
    <>
      <svg
        className={`eh-spinner ${className}`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="eh-sr-only">{label}</span> : null}
    </>
  );
}
