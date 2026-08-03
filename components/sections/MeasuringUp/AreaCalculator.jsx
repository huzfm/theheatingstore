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
 * Window sill height is captured for installation planning and is deliberately
 * not part of any of the above; it is stored in millimetres and only echoed
 * back in the summary.
 *
 * Inputs are dark here rather than the previous light-on-dark fields, which
 * were the only white input surfaces on the site. Contrast is carried by the
 * border and the focus ring instead.
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

  const field =
    'w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-bone-100 outline-none transition-colors duration-200 placeholder:text-bone-500/50 focus:border-heat-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-heat-500/20';
  const label =
    'mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-bone-500';

  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
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
            className="relative isolate mt-12 overflow-hidden rounded-[28px] border border-white/10 p-6 sm:p-9 lg:p-10"
            style={{
              background:
                'radial-gradient(85% 120% at 0% 0%, rgba(255,138,61,0.10), transparent 58%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
            }}
          >
            {/* ── Room ── */}
            <fieldset className="border-0 p-0">
              <legend className="mb-5 font-serif text-lg tracking-wide text-bone-100">
                The room
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="mu-w" className={label}>
                    Width (m)
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
                    Length (m)
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
                <div>
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
                <p className="mt-4 text-[13px] text-bone-500">
                  Gross floor area{' '}
                  <span className="text-heat-400">{roomTotal.toFixed(2)} m²</span>
                </p>
              )}
            </fieldset>

            {/* ── Obstructions ── */}
            <fieldset className="mt-10 border-0 p-0">
              <legend className="mb-2 font-serif text-lg tracking-wide text-bone-100">
                Fixed obstructions
              </legend>
              <p className="mb-5 max-w-xl text-[13px] leading-relaxed text-bone-500">
                One row per item that will never move. Leave the single empty
                row if there are none.
              </p>

              <div className="space-y-3">
                {areas.map((a, i) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4"
                  >
                    <div className="col-span-2 sm:col-span-1">
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
                        W (m)
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
                        L (m)
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
                    <div className="col-span-2 flex justify-end sm:col-span-1 sm:block">
                      <button
                        type="button"
                        onClick={() => removeArea(a.id)}
                        disabled={areas.length === 1}
                        aria-label={`Remove ${a.name || 'obstruction'}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-bone-500 transition-colors duration-200 hover:border-heat-500/40 hover:text-heat-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-bone-500"
                      >
                        <Trash2 size={16} strokeWidth={1.6} aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={addArea}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[13px] font-medium text-bone-300 transition-colors duration-200 hover:border-heat-500/40 hover:text-heat-400"
                >
                  <Plus size={15} strokeWidth={1.8} aria-hidden />
                  Add another
                </button>
                {unheatable > 0 && (
                  <p className="text-[13px] text-bone-500">
                    Deducted{' '}
                    <span className="text-heat-400">{unheatable.toFixed(2)} m²</span>
                  </p>
                )}
              </div>
            </fieldset>

            <div className="mt-10 border-t border-white/10 pt-8">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!hasRoomDims}
                className="inline-flex items-center justify-center rounded-full bg-heat-500 px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-bone-500 disabled:shadow-none"
              >
                Calculate heatable area
              </button>
              {!hasRoomDims && (
                <p className="mt-3 text-[12.5px] text-bone-500">
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
                  className="mt-8 scroll-mt-28 rounded-2xl border border-heat-500/25 bg-heat-500/[0.06] p-6 sm:p-8"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                    Your heatable area
                  </p>
                  <p className="mt-3 font-serif text-[clamp(2.6rem,8vw,4.5rem)] leading-none text-bone-100">
                    {heatableArea}
                    <span className="ml-2 text-[0.4em] text-bone-500">m²</span>
                  </p>

                  <dl className="mt-8 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3">
                    {[
                      ['Gross room area', `${roomTotal.toFixed(2)} m²`],
                      ['Fixed obstructions', `− ${unheatable.toFixed(2)} m²`],
                      ['Perimeter allowance', `− 10%`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-ink-950/80 px-5 py-4">
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
    </section>
  );
}
