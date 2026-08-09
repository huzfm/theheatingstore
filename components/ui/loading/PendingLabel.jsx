/**
 * Stable-width label swap for a pending control.
 *
 * There is no shared Button component in this codebase, every form styles its
 * own `<button>`, so the `pending` behaviour is packaged as the label instead
 * of as a button variant. Drop it inside whatever button already exists and
 * the button keeps its own styling.
 *
 * The problem it solves: "Send enquiry" -> "Sending…" is narrower, and
 * "Check Warranty" -> "Checking..." is wider, so the button resizes mid-submit
 * and drags the layout under it. Both labels are rendered into the same grid
 * cell and the inactive one is hidden with `visibility`, which keeps it in
 * layout. The button is therefore always as wide as its widest state and never
 * moves.
 *
 * `aria-hidden` on the inactive branch keeps the hidden text out of the
 * accessibility tree, since `visibility: hidden` alone would already exclude
 * it but the two branches must not both be readable during the swap.
 */
export default function PendingLabel({ pending, idle, busy }) {
  return (
    <span
      style={{
        display: 'inline-grid',
        gridTemplateAreas: '"label"',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      <span
        style={{
          gridArea: 'label',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          visibility: pending ? 'hidden' : 'visible',
        }}
        aria-hidden={pending ? 'true' : undefined}
      >
        {idle}
      </span>
      <span
        style={{
          gridArea: 'label',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          visibility: pending ? 'visible' : 'hidden',
        }}
        aria-hidden={pending ? undefined : 'true'}
      >
        {busy}
      </span>
    </span>
  );
}
