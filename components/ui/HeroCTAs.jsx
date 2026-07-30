import Link from 'next/link';
import styles from './HeroCTAs.module.css';

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The home hero's two calls to action, reusable on any route.
 *
 * The pair is fixed rather than configurable, that is the point: "Talk to an
 * Expert" then "Book a Free Site Visit", in that order, going to the same two
 * destinations wherever it appears. A props API for the labels would let the
 * copy drift page by page, which is exactly what this exists to prevent.
 *
 * Server component, there is no state or event handler here, only styled links.
 */
export default function HeroCTAs({ center = false, className = '' }) {
  return (
    <div className={`${styles.ctas} ${center ? styles.center : ''} ${className}`}>
      <Link href="/contact" className={`${styles.btn} ${styles.primary}`}>
        Talk to an Expert
        <ArrowIcon />
      </Link>
      <Link href="/SpaceVerification" className={`${styles.btn} ${styles.ghost}`}>
        Book a Free Site Visit
      </Link>
    </div>
  );
}
