'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { CALC } from './data';

/**
 * Heatable area calculator.
 *
 * The arithmetic is carried across from the previous implementation unchanged,
 * because it is the one thing on this page a customer might act on:
 *
 *   roomTotal   = width x length
 *   unheatable  = sum of each obstruction's width x length
 *   netArea     = max(0, roomTotal - unheatable)
 *   heatable    = netArea x 0.9        <- 10% perimeter + mat spacing
 *   percentage  = netArea / roomTotal  <- warn under 80%
 *
 * Dimensions are entered in feet and areas read in square feet, matching the
 * configurator below, which prices mats by the square foot. The formula is
 * unit-agnostic, only the labels changed.
 *
 * Window sill height is captured for installation planning and is deliberately
 * not part of any of the above; it stays in millimetres, which is how sill
 * heights are specified whatever the floor is measured in, and is only echoed
 * back in the summary.
 *
 * The panel is a warm bone worksheet rather than another ink-on-ink block: it
 * is the part of the page you work in rather than read, and it matches the
 * configurator below it. The result card stays dark so the answer remains the
 * one high-contrast object on the surface.
 *
 * Mobile: inputs are 16px below sm, because anything smaller makes iOS zoom
 * the viewport on focus; width and length share a row, name/W/L/remove never
 * costs more than two lines, and every control clears 44px.
 */
export default function AreaCalculator() {
  const reduce = useReducedMotion();

  const [roomWidth, setRoomWidth] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [windowSillHeight, setWindowSillHeight] = useState('');
  const [areas, setAreas] = useState([{ id: 1, name: '', width: '', length: '' }]);
  const [showResult, setShowResult] = useState(false);

  const windowSillHeightNum = parseFloat(windowSillHeight);
  const hasWindowSillHeight =
    windowSillHeight !== '' &&
    !Number.isNaN(windowSillHeightNum) &&
    windowSillHeightNum > 0;

  const roomTotal = useMemo(
    () => (parseFloat(roomWidth) || 0) * (parseFloat(roomLength) || 0),
    [roomWidth, roomLength]
  );

  const unheatable = useMemo(
    () =>
      areas.reduce(
        (sum, a) => sum + (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0),
        0
      ),
    [areas]
  );

  const netArea = Math.max(0, roomTotal - unheatable);
  const heatableArea = (netArea * 0.9).toFixed(2);
  const heatablePercentage = roomTotal > 0 ? (netArea / roomTotal) * 100 : 100;
  const isBelowMinimum = roomTotal > 0 && heatablePercentage < 80;

  const hasRoomDims =
    roomWidth !== '' &&
    roomLength !== '' &&
    parseFloat(roomWidth) > 0 &&
    parseFloat(roomLength) > 0;

  const addArea = () =>
    setAreas((prev) => [...prev, { id: Date.now(), name: '', width: '', length: '' }]);

  const removeArea = (id) =>
    setAreas((prev) => (prev.length === 1 ? prev : prev.filter((a) => a.id !== id)));

  const updateArea = (id, field, value) =>
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  const handleCalculate = () => {
    if (!hasRoomDims) return;
    setShowResult(true);
    setTimeout(() => {
      document
        .getElementById('calculator-result')
        ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }, 80);
  };

  // text-base (16px) below sm: any smaller and iOS zooms the viewport when the
  // field takes focus, leaving the user scrolled sideways into the form.
  const field =
    'mu-num w-full rounded-xl border border-ink-950/12 bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors duration-200 placeholder:text-ink-700/35 focus:border-heat-600 focus:ring-2 focus:ring-heat-500/25 sm:text-[15px]';
  const label =
    'mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-700/55';

  return (
    <section className="relative bg-ink-950 px-4 py-20 text-bone-100 sm:px-8 sm:py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.07), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {CALC.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {CALC.title}
          </RevealText>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-300">
              {CALC.intro}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="relative isolate mt-10 overflow-hidden rounded-[22px] border border-white/10 p-5 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)] sm:mt-12 sm:rounded-[28px] sm:p-9 lg:p-10"
            style={{
              background:
                'radial-gradient(90% 60% at 0% 0%, rgba(255,176,97,0.22), transparent 60%), linear-gradient(165deg, #faf7f2 0%, #f1ebe2 55%, #e9e1d6 100%)',
            }}
          >
            {/* ── Room ── */}
            <fieldset className="border-0 p-0">
              <legend className="mb-5 font-serif text-[17px] tracking-wide text-ink-900 sm:text-lg">
                The room
              </legend>
              {/* Width and length pair up even on the narrowest phone, they
                  read as one measurement. The optional sill gets its own row. */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <label htmlFor="mu-w" className={label}>
                    Width (ft)
                  </label>
                  <input
                    id="mu-w"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                    placeholder="0.00"
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="mu-l" className={label}>
                    Length (ft)
                  </label>
                  <input
                    id="mu-l"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={roomLength}
                    onChange={(e) => setRoomLength(e.target.value)}
                    placeholder="0.00"
                    className={field}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="mu-sill" className={label}>
                    Sill height (mm) · optional
                  </label>
                  <input
                    id="mu-sill"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={windowSillHeight}
                    onChange={(e) => setWindowSillHeight(e.target.value)}
                    placeholder="—"
                    className={field}
                  />
                </div>
              </div>

              {roomTotal > 0 && (
                <p className="mt-4 text-[13px] text-ink-700/70">
                  Gross floor area{' '}
                  <span className="font-medium text-heat-700">
                    {roomTotal.toFixed(2)} sq ft
                  </span>
                </p>
              )}
            </fieldset>

            {/* ── Obstructions ── */}
            <fieldset className="mt-9 border-0 p-0 sm:mt-10">
              <legend className="mb-2 font-serif text-[17px] tracking-wide text-ink-900 sm:text-lg">
                Fixed obstructions
              </legend>
              <p className="mb-5 max-w-xl text-[13px] leading-relaxed text-ink-700/70">
                One row per item that will never move. Leave the single empty
                row if there are none.
              </p>

              <div className="space-y-3">
                {areas.map((a, i) => (
                  <div
                    key={a.id}
                    // On a phone the name takes its own row and W, L and the
                    // remove button share the next one, so a row never costs
                    // more than two lines of height.
                    className="grid grid-cols-[1fr_1fr_auto] items-end gap-3 rounded-2xl border border-ink-950/[0.08] bg-white/70 p-3.5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4 sm:p-4"
                  >
                    <div className="col-span-3 sm:col-span-1">
                      <label htmlFor={`mu-n-${a.id}`} className={label}>
                        What is it
                      </label>
                      <input
                        id={`mu-n-${a.id}`}
                        type="text"
                        value={a.name}
                        onChange={(e) => updateArea(a.id, 'name', e.target.value)}
                        placeholder={i === 0 ? 'Kitchen island' : 'Fixture'}
                        className={field}
                      />
                    </div>
                    <div className="sm:w-[110px]">
                      <label htmlFor={`mu-aw-${a.id}`} className={label}>
                        W (ft)
                      </label>
                      <input
                        id={`mu-aw-${a.id}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={a.width}
                        onChange={(e) => updateArea(a.id, 'width', e.target.value)}
                        placeholder="0.00"
                        className={field}
                      />
                    </div>
                    <div className="sm:w-[110px]">
                      <label htmlFor={`mu-al-${a.id}`} className={label}>
                        L (ft)
                      </label>
                      <input
                        id={`mu-al-${a.id}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={a.length}
                        onChange={(e) => updateArea(a.id, 'length', e.target.value)}
                        placeholder="0.00"
                        className={field}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeArea(a.id)}
                        disabled={areas.length === 1}
                        aria-label={`Remove ${a.name || 'obstruction'}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-950/10 bg-white text-ink-700/60 transition-colors duration-200 hover:border-heat-500/50 hover:text-heat-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink-950/10 disabled:hover:text-ink-700/60"
                      >
                        <Trash2 size={16} strokeWidth={1.6} aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={addArea}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink-950/12 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors duration-200 hover:border-heat-500/50 hover:text-heat-700"
                >
                  <Plus size={15} strokeWidth={1.8} aria-hidden />
                  Add another
                </button>
                {unheatable > 0 && (
                  <p className="text-[13px] text-ink-700/70">
                    Deducted{' '}
                    <span className="font-medium text-heat-700">
                      {unheatable.toFixed(2)} sq ft
                    </span>
                  </p>
                )}
              </div>
            </fieldset>

            <div className="mt-9 border-t border-ink-950/[0.08] pt-7 sm:mt-10 sm:pt-8">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!hasRoomDims}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-heat-600 px-8 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(242,104,28,0.8)] transition-colors duration-200 hover:bg-heat-700 disabled:cursor-not-allowed disabled:bg-ink-950/10 disabled:text-ink-700/40 disabled:shadow-none sm:w-auto"
              >
                Calculate heatable area
              </button>
              {!hasRoomDims && (
                <p className="mt-3 text-[12.5px] text-ink-700/60">
                  Enter the room width and length to continue.
                </p>
              )}
            </div>

            {/* ── Result ── */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  id="calculator-result"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  // Left dark on the bone worksheet: the answer is the one
                  // thing here you are meant to walk away with.
                  className="mt-8 scroll-mt-28 rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-8"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                    Your heatable area
                  </p>
                  <p className="mt-3 font-serif text-[clamp(2.6rem,13vw,4.5rem)] leading-none text-bone-100">
                    {heatableArea}
                    <span className="ml-2 text-[0.32em] text-bone-500">sq ft</span>
                  </p>

                  <dl className="mt-7 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:mt-8 sm:grid-cols-3">
                    {[
                      ['Gross room area', `${roomTotal.toFixed(2)} sq ft`],
                      ['Fixed obstructions', `− ${unheatable.toFixed(2)} sq ft`],
                      ['Perimeter allowance', `− 10%`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-ink-950/90 px-5 py-4">
                        <dt className="text-[10px] uppercase tracking-[0.18em] text-bone-500">
                          {k}
                        </dt>
                        <dd className="mt-1.5 text-[15px] text-bone-100">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {hasWindowSillHeight && (
                    <p className="mt-5 text-[13px] text-bone-500">
                      Sill height noted for installation planning:{' '}
                      <span className="text-bone-300">{windowSillHeightNum} mm</span>.
                      It does not affect the area above.
                    </p>
                  )}

                  {isBelowMinimum && (
                    <p className="mt-5 rounded-xl border border-white/10 bg-ink-950/60 p-4 text-[13.5px] leading-relaxed text-bone-300">
                      Only {heatablePercentage.toFixed(0)}% of this room is
                      heatable. Below about 80% the system has to work harder
                      through less floor, and it is worth revisiting the layout
                      or the room before specifying.
                    </p>
                  )}

                  <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-bone-500/70">
                    {CALC.note}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <style>{`
        /* Spinners eat 20px of an already narrow field on a phone, and every
           number here is typed rather than nudged. */
        .mu-num::-webkit-inner-spin-button,
        .mu-num::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .mu-num { -moz-appearance: textfield; }
      `}</style>
    </section>
  );
}
