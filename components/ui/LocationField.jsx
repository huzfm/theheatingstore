'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Spinner from '@/components/ui/loading/Spinner';
import styles from './LocationField.module.css';

/**
 * One address field for the public lead forms.
 *
 * It produces the location half of a lead payload — `{ address, lat, lng }`,
 * which `submitLead` turns into customerAddress/customerLat/customerLng/
 * googleMapsLink — by any of three routes, in the order a customer is likely
 * to reach for them:
 *
 *  1. Typing, which searches (debounced) and offers real places to pick from.
 *  2. The crosshair, which asks the browser for a GPS fix and turns it back
 *     into a readable address.
 *  3. Typing and picking nothing, which still submits the text. Coordinates
 *     are then null and the API geocodes the address on arrival — a lead is
 *     never lost because a search found nothing.
 *
 * Only 1 and 2 attach coordinates, and the hint line below the field says
 * which of those happened, because "pinned" and "typed" mean different things
 * to whoever has to find the house.
 *
 * Searching goes through /api/geo (see that route for why it is proxied).
 */

const DEBOUNCE_MS = 450;
const MIN_QUERY = 3;

function PinIcon(props) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

/**
 * @param {object} props
 * @param {{address: string, lat: number|null, lng: number|null}|null} props.value
 * @param {(place: {address: string, lat: number|null, lng: number|null}) => void} props.onChange
 * @param {'dark'|'light'} [props.variant]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required]
 * @param {string} [props.id]
 */
export default function LocationField({
  value,
  onChange,
  variant = 'dark',
  placeholder = 'Search your area, street or landmark…',
  required = false,
  id,
}) {
  const generatedId = useId();
  const inputId = id || `loc-${generatedId}`;
  const listboxId = `${inputId}-listbox`;

  const [query, setQuery] = useState(value?.address || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState('');

  const rootRef = useRef(null);
  /**
   * Set whenever the text in the box came from us rather than from typing — a
   * picked suggestion, a GPS fix. Without it, writing the resolved address into
   * the input fires the search effect again and the panel reopens on top of the
   * answer the person just chose.
   */
  const suppressSearch = useRef(false);
  /** Discards a slow response that lost the race to a newer keystroke. */
  const requestSeq = useRef(0);

  const pinned = typeof value?.lat === 'number' && typeof value?.lng === 'number';

  /* ── Debounced search ── */
  useEffect(() => {
    const term = query.trim();

    // Checked before the suppression flag, not after: a cleared field must
    // close the panel whoever cleared it, and leaving the flag set here would
    // swallow the next real keystroke instead.
    if (term.length < MIN_QUERY) {
      suppressSearch.current = false;
      setResults([]);
      setSearching(false);
      setOpen(false);
      return;
    }

    if (suppressSearch.current) {
      suppressSearch.current = false;
      return;
    }

    setSearching(true);
    const seq = ++requestSeq.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        if (seq !== requestSeq.current) return;
        setResults(res.ok && Array.isArray(data.results) ? data.results : []);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (seq !== requestSeq.current) return;
        // A failed lookup is not a failed form: the typed address still posts.
        setResults([]);
        setOpen(false);
      } finally {
        if (seq === requestSeq.current) setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Follows the parent when it changes the value out from under us — in
   * practice, a form clearing itself after a successful submit. Typing already
   * reports the same string back through `onChange`, so in the common case the
   * two agree and this does nothing.
   */
  useEffect(() => {
    const address = value?.address || '';
    if (address === query) return;
    suppressSearch.current = true;
    setQuery(address);
  }, [value?.address, query]);

  /* ── Close on an outside click ── */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const commit = useCallback(
    (place) => {
      suppressSearch.current = true;
      setQuery(place.address);
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      setError('');
      onChange(place);
    },
    [onChange]
  );

  const handleType = (event) => {
    const next = event.target.value;
    setQuery(next);
    setError('');
    // Coordinates belong to the place that was picked, not to whatever is
    // typed over it. Dropping them here stops a lead going out with one
    // person's address and the previous pick's pin.
    onChange({ address: next, lat: null, lng: null });
  };

  const handleKeyDown = (event) => {
    if (!open || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      // Only swallowed when a suggestion is highlighted, so Enter still submits
      // the form in every other state.
      event.preventDefault();
      const picked = results[activeIndex];
      commit({ address: picked.label, lat: picked.lat, lng: picked.lng });
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleGps = () => {
    if (!navigator.geolocation) {
      setError('This device cannot share its location. Please type your address.');
      return;
    }

    setGpsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/geo?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          const place = res.ok ? data.results?.[0] : null;
          commit({
            // The fix is the useful part; if the address lookup fails the
            // coordinates still go through, labelled as coordinates.
            address: place?.label || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            lat: latitude,
            lng: longitude,
          });
        } catch {
          commit({
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            lat: latitude,
            lng: longitude,
          });
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        setError('Could not read your location. Please search for your area instead.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={styles.root} data-variant={variant} ref={rootRef}>
      <div className={styles.inputWrap}>
        <span className={styles.leadingIcon}>
          <PinIcon />
        </span>

        <input
          id={inputId}
          type="text"
          className={styles.input}
          value={query}
          onChange={handleType}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        />

        <span className={styles.trailing}>
          <button
            type="button"
            className={styles.gpsButton}
            onClick={handleGps}
            disabled={gpsLoading}
            aria-label="Use my current location"
            title="Use my current location"
          >
            {gpsLoading ? <Spinner size={13} /> : <CrosshairIcon />}
          </button>
        </span>
      </div>

      {open && (
        <ul className={styles.panel} id={listboxId} role="listbox">
          {results.map((place, index) => (
            <li key={`${place.lat},${place.lng},${index}`} role="presentation">
              <button
                type="button"
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                data-active={index === activeIndex}
                className={styles.option}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit({ address: place.label, lat: place.lat, lng: place.lng })}
              >
                <span className={styles.optionIcon}>
                  <PinIcon width="13" height="13" />
                </span>
                {place.label}
              </button>
            </li>
          ))}
          {results.length === 0 && !searching && (
            <li className={styles.status} role="presentation">
              No match. You can still type the address as you know it.
            </li>
          )}
        </ul>
      )}

      {/* One live line, so a screen reader hears the pin land rather than only
          seeing the input text change under it. */}
      <p className={styles.hint} role="status" aria-live="polite">
        {searching ? (
          <>Searching…</>
        ) : pinned ? (
          <span className={styles.hintPinned}>Location pinned — we will find you exactly.</span>
        ) : (
          <>Pick a suggestion or tap the crosshair to use your current location.</>
        )}
      </p>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
