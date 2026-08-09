'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { AlertTriangle, Check, Eye, Minus, Plus, X } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { ECONOMICS } from './data';

/**
 * Project cost configurator, carried across from the product-page calculator.
 *
 * Every number this section produces comes from the original implementation
 * unchanged, mat catalogue and prices, the brute-force combination search, the
 * civil-works ratios and the summary total. Only the surface changed.
 *
 *   heatedArea = clamp(round(width x length), 50, 500) x coverage%
 *   combos     = every 1-6 mat mix covering heatedArea, fewest mats then
 *                cheapest, first four kept, first one recommended
 *   total      = selected mat cost + thermostat upgrade
 *
 * Civil works (aggregate, sand, cement, labour, mason) are quantities only and
 * deliberately sit outside the total, as they did before.
 *
 * Tone: the rest of /measuring-up is ink-on-ink, and a form is the one thing
 * on the page you work *in* rather than read. So the configurator sits on a
 * warm bone worksheet, lit from the dark section around it, with the summary
 * left dark so the running total stays the one high-contrast object on screen.
 *
 * Mobile, since this is a form and most of the traffic is phones:
 *   - Every input is 16px on small screens. Below that iOS zooms the viewport
 *     on focus and leaves the user scrolled sideways into a form they then
 *     have to pinch back out of.
 *   - Tap targets are 44px, and the mat steppers and thermostat rows go full
 *     width rather than wrapping into orphaned half-rows.
 *   - The running total is a fixed bar while the configurator is on screen.
 *     Stacked, the summary is a long scroll below four cards, so the number
 *     you are changing would otherwise never be visible while you change it.
 */

const BRANDS = ['ProWarm', 'Warmup', 'ThermoSphere', 'AmberHeat', 'FastWarm', 'nVent'];

const MATS = [
  { sqft: 50, price: 8500, label: '50 sq ft Mat' },
  { sqft: 70, price: 11500, label: '70 sq ft Mat' },
  { sqft: 80, price: 13500, label: '80 sq ft Mat' },
];

const THERMOSTATS = {
  free: {
    label: 'Standard Thermostat',
    sublabel: 'Included free',
    price: 0,
    image: '/images/stock/1585771724684-38269d6639fd-600.webp',
    description:
      'A reliable and straightforward thermostat included with every installation. Features a simple dial or basic digital display for manual temperature control. Ideal for single-zone setups where smart connectivity is not required.',
  },
  modular: {
    label: 'Modular Thermostat',
    sublabel: '+ ₹2,500',
    price: 2500,
    image: '/images/stock/1558618666-fcd25c85cd64-600.webp',
    description:
      'A programmable modular thermostat with a clean digital interface. Supports weekly scheduling and floor sensor input for accurate temperature management. A popular upgrade for homeowners wanting more control without Wi-Fi dependency.',
  },
  wifi: {
    label: 'Wi-Fi Smart Thermostat',
    sublabel: '+ ₹5,500',
    price: 5500,
    image: '/images/stock/1513694203232-719a280e022f-600.webp',
    description:
      'A fully connected smart thermostat controllable via smartphone from anywhere. Compatible with Alexa and Google Home. Features energy usage reports, geo-fencing, and adaptive scheduling — ideal for modern smart homes.',
  },
};

export default function InstallationEconomics() {
  const configuratorRef = useRef(null);
  // The margins stop the bar flashing on as the panel's last pixels leave.
  const configuratorInView = useInView(configuratorRef, {
    margin: '-12% 0px -22% 0px',
  });

  const [brand, setBrand] = useState('ProWarm');
  const [thermostat, setThermostat] = useState('free');
  const [modalThermostat, setModalThermostat] = useState(null);

  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [coveragePct, setCoveragePct] = useState(80);

  const rawArea =
    width !== '' && length !== '' ? parseFloat(width || 0) * parseFloat(length || 0) : 0;
  const effectiveArea = rawArea > 0 ? Math.min(500, Math.max(50, Math.round(rawArea))) : 0;
  const heatedArea = effectiveArea > 0 ? Math.round(effectiveArea * (coveragePct / 100)) : 0;
  // 80% is the recommendation; 75% is where we say something about it.
  const isCoverageLow = coveragePct < 75;

  const [manualMats, setManualMats] = useState({ 50: 0, 70: 0, 80: 0 });

  const generateCombinations = (area) => {
    const results = [];

    for (let a = 0; a <= 5; a++) {
      for (let b = 0; b <= 5; b++) {
        for (let c = 0; c <= 5; c++) {
          const coverage = a * 80 + b * 70 + c * 50;
          if (coverage >= area && a + b + c > 0 && a + b + c <= 6) {
            const cost = a * 13500 + b * 11500 + c * 8500;
            const mats = [];
            if (a > 0) mats.push({ sqft: 80, count: a });
            if (b > 0) mats.push({ sqft: 70, count: b });
            if (c > 0) mats.push({ sqft: 50, count: c });
            results.push({ mats, coverage, cost, totalCount: a + b + c });
          }
        }
      }
    }

    results.sort((x, y) => x.totalCount - y.totalCount || x.cost - y.cost);

    const seen = new Set();
    const unique = results.filter((r) => {
      const key = r.mats.map((m) => `${m.count}x${m.sqft}`).join('+');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.slice(0, 4);
  };

  const generatedCombos = heatedArea > 0 ? generateCombinations(heatedArea) : [];

  const [selectedComboIndex, setSelectedComboIndex] = useState(null);

  const manualCoverage = manualMats[50] * 50 + manualMats[70] * 70 + manualMats[80] * 80;
  const manualCost = manualMats[50] * 8500 + manualMats[70] * 11500 + manualMats[80] * 13500;
  const manualTotalCount = manualMats[50] + manualMats[70] + manualMats[80];
  const hasCustomMats = manualTotalCount > 0;

  const getSelectedMats = () => {
    if (hasCustomMats) {
      const mats = [];
      if (manualMats[50] > 0) mats.push({ sqft: 50, count: manualMats[50] });
      if (manualMats[70] > 0) mats.push({ sqft: 70, count: manualMats[70] });
      if (manualMats[80] > 0) mats.push({ sqft: 80, count: manualMats[80] });
      return { mats, coverage: manualCoverage, cost: manualCost, isCustom: true };
    }
    if (selectedComboIndex !== null && generatedCombos[selectedComboIndex]) {
      return { ...generatedCombos[selectedComboIndex], isCustom: false };
    }
    if (generatedCombos.length > 0) {
      return { ...generatedCombos[0], isCustom: false };
    }
    return null;
  };

  const selectedMats = getSelectedMats();
  const displayCombo = selectedMats
    ? selectedMats.mats.flatMap((m) =>
        Array(m.count)
          .fill(null)
          .map(() => MATS.find((mat) => mat.sqft === m.sqft))
      )
    : [];

  const handleSelectGeneratedCombo = (index) => {
    setManualMats({ 50: 0, 70: 0, 80: 0 });
    setSelectedComboIndex(index);
  };

  const matCost = displayCombo.reduce((s, m) => s + (m?.price || 0), 0);
  const totalCoverage = displayCombo.reduce((s, m) => s + (m?.sqft || 0), 0);
  const labourCount = effectiveArea > 180 ? 2 : 1;
  const masonCount = effectiveArea > 180 ? 2 : 1;
  const thermo = THERMOSTATS[thermostat].price;
  const total = matCost + thermo;

  const formatCombo = (combo) => {
    if (!combo || combo.length === 0) return '—';
    const counts = {};
    combo.forEach((m) => {
      counts[m.sqft] = (counts[m.sqft] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => b - a)
      .map(([sqft, cnt]) => `${cnt}× ${sqft} sq ft`)
      .join(' + ');
  };

  // Civil works is crew, not money, so it stays outside the total. The
  // aggregate/sand/cement bag counts that used to sit here read as "10B · 10S
  // · 3C", which needs a legend to decode and is a materials list rather than
  // anything you decide from, so the row is crew only. It also appears only
  // once there is an area, otherwise the default "1 Labour · 1 Mason" reads as
  // an answer when nothing has been entered.
  const breakdown = [
    {
      label: 'Heating Mats',
      value: formatCombo(displayCombo),
      sub:
        displayCombo.length > 0
          ? `${displayCombo.length} mat${displayCombo.length > 1 ? 's' : ''} selected`
          : 'No mats selected',
    },
    {
      label: 'Total Coverage',
      value: totalCoverage > 0 ? `${totalCoverage} sq ft` : '—',
      sub: rawArea > 0 ? `Room area: ${Math.round(rawArea)} sq ft` : 'Enter room dimensions',
    },
    {
      label: 'Mat Cost',
      value: matCost > 0 ? `₹ ${matCost.toLocaleString()}` : '—',
      sub: '',
    },
    {
      label: 'Civil Works',
      value: 'civilworks',
      sub: '',
      hidden: effectiveArea === 0,
    },
    {
      label: 'Thermostat',
      value: thermo === 0 ? 'Included' : `₹ ${thermo.toLocaleString()}`,
      sub: THERMOSTATS[thermostat].label,
    },
  ].filter((row) => !row.hidden);

  const handleDimensionChange = (field, val) => {
    if (field === 'width') setWidth(val);
    if (field === 'length') setLength(val);
  };

  // Lock the page behind the dialog, otherwise the body scrolls under it on
  // iOS while the sheet stays put.
  useEffect(() => {
    if (!modalThermostat) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setModalThermostat(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalThermostat]);

  // ── shared surface classes ────────────────────────────────────────────────
  const card =
    'rounded-[18px] border border-ink-950/[0.08] bg-white/75 p-5 shadow-[0_1px_2px_rgba(20,16,12,0.04)] sm:rounded-[22px] sm:p-7';
  const stepBadge =
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-heat-700/25 bg-heat-500/15 text-[11px] font-semibold text-heat-700';
  const cardTitle = 'font-serif text-[17px] tracking-wide text-ink-900 sm:text-lg';
  // text-base (16px) below sm, anything smaller and iOS zooms on focus.
  const inputCls =
    'ie-num w-full rounded-xl border border-ink-950/12 bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors duration-200 placeholder:text-ink-700/35 focus:border-heat-600 focus:ring-2 focus:ring-heat-500/25 sm:text-[15px]';
  const fieldLabel =
    'mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-700/55';
  const chip = 'rounded-full border border-ink-950/10 bg-white px-3 py-1.5 text-[11.5px] text-ink-700';

  // ── summary (dark, against the bone worksheet) ────────────────────────────
  const summaryHeader = (
    <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-heat-400">
        Summary
      </p>
      <h3 className="mt-1 font-serif text-base tracking-wide text-bone-100">
        Cost breakdown
      </h3>
    </div>
  );

  const summaryRows = (
    <div className="px-5 sm:px-6">
      {breakdown.map(({ label, value, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="flex items-start justify-between gap-4 border-b border-white/[0.07] py-3 last:border-0"
        >
          <div className="min-w-0">
            <p className="text-[12.5px] text-bone-300">{label}</p>
            {sub && <p className="mt-0.5 text-[10.5px] text-bone-500/80">{sub}</p>}
          </div>
          {label === 'Civil Works' ? (
            <span className="shrink-0 text-right text-[12.5px] font-medium text-bone-100">
              {labourCount} Labour · {masonCount} Mason
            </span>
          ) : (
            <motion.span
              key={value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 text-right text-[12.5px] font-medium text-bone-100"
            >
              {value}
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );

  const summaryFooter = (
    <>
      <div className="mx-5 mb-5 mt-4 rounded-2xl border border-heat-500/25 bg-heat-500/[0.08] p-5">
        <p className="text-[9.5px] uppercase tracking-[0.22em] text-heat-400">
          Mat + thermostat cost
        </p>
        <motion.p
          key={total}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-1.5 font-serif text-[2rem] leading-none text-bone-100"
        >
          ₹ {total.toLocaleString()}
        </motion.p>
      </div>

      <div className="mx-5 mb-5">
        <a
          href="/contact"
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-heat-500 px-6 text-[13.5px] font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400"
        >
          Request detailed quotation
        </a>
      </div>
    </>
  );

  return (
    <section className="relative bg-ink-950 px-4 py-20 text-bone-100 sm:px-8 sm:py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60vw 40vh at 50% 0%, rgba(255,138,61,0.09), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ── Header, still on the dark page ── */}
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.24em] text-heat-400 sm:text-[11px] sm:tracking-[0.28em]">
              <span className="h-px w-8 bg-heat-500/60" />
              {ECONOMICS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-6 font-serif text-[clamp(1.75rem,6vw,3.25rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit] sm:mt-7 sm:leading-[1.02]"
          >
            {ECONOMICS.title}
          </RevealText>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone-300 sm:text-base">
              {ECONOMICS.intro}
            </p>
          </Reveal>
        </div>

        {/* ── The worksheet: warm bone panel lifted off the dark section ── */}
        <Reveal delay={0.1}>
          <div
            ref={configuratorRef}
            className="mt-10 overflow-hidden rounded-[22px] border border-white/10 p-4 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)] sm:mt-12 sm:rounded-[28px] sm:p-7 lg:p-8"
            style={{
              background:
                'radial-gradient(90% 60% at 0% 0%, rgba(255,176,97,0.22), transparent 60%), linear-gradient(165deg, #faf7f2 0%, #f1ebe2 55%, #e9e1d6 100%)',
            }}
          >
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_340px]">
              {/* ── Left column: the four steps ── */}
              <div className="space-y-4 sm:space-y-5">
                {/* 1 · Brand */}
                <div className={card}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={stepBadge}>1</span>
                    <h3 className={cardTitle}>Heating system brand</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {BRANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBrand(b)}
                        aria-pressed={brand === b}
                        className={`relative min-h-[48px] rounded-xl px-3 py-3 text-[13px] font-medium transition-colors duration-200 ${
                          brand === b
                            ? 'border border-heat-600 bg-heat-500/15 text-heat-700'
                            : 'border border-ink-950/10 bg-white text-ink-800 hover:border-heat-500/50 hover:text-heat-700'
                        }`}
                      >
                        {b}
                        {brand === b && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-heat-600 text-white">
                            <Check size={11} strokeWidth={3} aria-hidden />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2 · Room dimensions */}
                <div className={card}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={stepBadge}>2</span>
                    <h3 className={cardTitle}>Room dimensions</h3>
                  </div>

                  <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-2">
                    <motion.span
                      key={effectiveArea}
                      initial={{ scale: 0.94, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="font-serif text-[2.2rem] leading-none text-heat-700 sm:text-[2.4rem]"
                    >
                      {effectiveArea || '—'}
                    </motion.span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-700/55">
                      sq ft
                    </span>
                    {width && length && (
                      <span className={`${chip} ml-auto sm:ml-2`}>
                        {width} × {length} ft
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:gap-3">
                    <div>
                      <label htmlFor="ie-width" className={fieldLabel}>
                        Width (ft)
                      </label>
                      <input
                        id="ie-width"
                        type="number"
                        inputMode="decimal"
                        min={1}
                        max={200}
                        value={width}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                        placeholder="15"
                        className={inputCls}
                      />
                    </div>

                    <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-ink-950/10 bg-white text-[13px] text-heat-700 sm:h-8 sm:w-8 sm:text-sm">
                      ×
                    </div>

                    <div>
                      <label htmlFor="ie-length" className={fieldLabel}>
                        Length (ft)
                      </label>
                      <input
                        id="ie-length"
                        type="number"
                        inputMode="decimal"
                        min={1}
                        max={200}
                        value={length}
                        onChange={(e) => handleDimensionChange('length', e.target.value)}
                        placeholder="20"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {width && length && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2 rounded-xl border border-heat-600/25 bg-heat-500/[0.10] px-4 py-2.5"
                    >
                      <Check
                        size={14}
                        strokeWidth={2.4}
                        className="mt-0.5 shrink-0 text-heat-700"
                        aria-hidden
                      />
                      <p className="text-[12.5px] leading-snug text-ink-800">
                        {parseFloat(width)} × {parseFloat(length)} ={' '}
                        <span className="font-medium text-heat-700">
                          {Math.round(parseFloat(width) * parseFloat(length))} sq ft
                        </span>{' '}
                        calculated
                      </p>
                    </motion.div>
                  )}

                  {width && length && parseFloat(width) * parseFloat(length) > 500 && (
                    <p className="mt-3 rounded-xl border border-ink-950/10 bg-white px-4 py-3 text-[12.5px] leading-relaxed text-ink-700">
                      Area capped at 500 sq ft. Contact us for larger projects.
                    </p>
                  )}

                  <div className="mt-6 border-t border-ink-950/[0.08] pt-5">
                    <label htmlFor="ie-coverage" className={fieldLabel}>
                      Floor coverage %
                    </label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-[88px] shrink-0 sm:w-24">
                        <input
                          id="ie-coverage"
                          type="number"
                          inputMode="numeric"
                          min={10}
                          max={100}
                          step={5}
                          value={coveragePct}
                          onChange={(e) =>
                            setCoveragePct(
                              Math.min(100, Math.max(10, parseInt(e.target.value) || 10))
                            )
                          }
                          className={`${inputCls} pr-8`}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-700/50">
                          %
                        </span>
                      </div>
                      {/* py-3 gives the 2px track a 44px tall drag area on touch */}
                      <input
                        type="range"
                        aria-label="Floor coverage percentage"
                        min={10}
                        max={100}
                        step={5}
                        value={coveragePct}
                        onChange={(e) => setCoveragePct(parseInt(e.target.value))}
                        className="ie-range h-11 flex-1 cursor-pointer appearance-none bg-transparent"
                        style={{
                          '--ie-fill': `${((coveragePct - 10) / 90) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-3 text-[12.5px] leading-relaxed text-ink-700/70">
                      Recommended{' '}
                      <span className="font-medium text-heat-700">80%</span> coverage for
                      even heat distribution.
                    </p>

                    {/* Under 75% the mats stop reading as a heated floor and
                        start reading as warm patches, so the setting is worth
                        arguing with rather than silently pricing. */}
                    <AnimatePresence>
                      {isCoverageLow && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          role="status"
                          className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#b45309]/25 bg-[#b45309]/[0.08] px-4 py-3"
                        >
                          <AlertTriangle
                            size={15}
                            strokeWidth={1.9}
                            aria-hidden
                            className="mt-0.5 shrink-0 text-[#b45309]"
                          />
                          <p className="text-[12.5px] leading-relaxed text-ink-800">
                            <span className="font-medium text-[#b45309]">
                              {coveragePct}% is below the 75% minimum we advise.
                            </span>{' '}
                            At this density the floor warms in patches rather than
                            evenly, cold strips are noticeable underfoot, and the
                            thermostat runs longer to reach the same room
                            temperature. Worth checking the layout before ordering.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 3 · Mats */}
                <div className={card}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={stepBadge}>3</span>
                    <h3 className={cardTitle}>Heating mats required</h3>
                  </div>

                  {rawArea > 0 ? (
                    <div className="space-y-6">
                      <p className={`${chip} inline-block leading-snug`}>
                        {Math.round(rawArea)} sq ft room · {coveragePct}% ={' '}
                        <span className="font-medium text-heat-700">
                          {heatedArea} sq ft
                        </span>{' '}
                        heated
                      </p>

                      <div className="space-y-2.5">
                        {generatedCombos.map((combo, i) => {
                          const isSelected = !hasCustomMats && selectedComboIndex === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSelectGeneratedCombo(i)}
                              aria-pressed={isSelected}
                              className={`w-full rounded-2xl border p-4 text-left transition-colors duration-200 ${
                                isSelected
                                  ? 'border-heat-600 bg-heat-500/[0.10]'
                                  : 'border-ink-950/10 bg-white hover:border-heat-500/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="min-w-0 flex-1">
                                  {i === 0 && (
                                    <span className="mb-2 inline-flex rounded-full border border-heat-700/25 bg-heat-500/15 px-2.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-heat-700">
                                      Recommended
                                    </span>
                                  )}
                                  <p className="text-[14px] leading-snug text-ink-900">
                                    {combo.mats
                                      .map((m) => `${m.count}× ${m.sqft} sq ft`)
                                      .join(' + ')}
                                  </p>
                                  <p className="mt-1 text-[11.5px] text-ink-700/60">
                                    Total coverage: {combo.coverage} sq ft
                                  </p>
                                </div>
                                <p
                                  className={`shrink-0 font-serif text-[16px] sm:text-[17px] ${
                                    i === 0 ? 'text-heat-700' : 'text-ink-900'
                                  }`}
                                >
                                  ₹ {combo.cost.toLocaleString()}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Manual builder. One full-width row per mat on phones:
                          wrapping the label and its stepper independently left
                          orphaned +/- controls next to the wrong mat. */}
                      <div className="border-t border-ink-950/[0.08] pt-5">
                        <p className="mb-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-700/55">
                          Build your own combination
                        </p>

                        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                          {MATS.map((mat) => (
                            <div
                              key={mat.sqft}
                              className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  if (manualMats[mat.sqft] === 0) {
                                    setManualMats((prev) => ({ ...prev, [mat.sqft]: 1 }));
                                  }
                                }}
                                className={`min-h-[48px] flex-1 rounded-xl border px-4 text-[13.5px] transition-colors duration-200 sm:min-h-0 sm:flex-none sm:py-2.5 sm:text-[13px] ${
                                  manualMats[mat.sqft] > 0
                                    ? 'border-heat-600 bg-heat-500/[0.12] text-heat-700'
                                    : 'border-ink-950/10 bg-white text-ink-800 hover:border-heat-500/50 hover:text-heat-700'
                                }`}
                              >
                                {mat.label}
                              </button>

                              {manualMats[mat.sqft] > 0 && (
                                <div className="flex shrink-0 items-center gap-1">
                                  <button
                                    type="button"
                                    aria-label={`Remove one ${mat.label}`}
                                    onClick={() =>
                                      setManualMats((prev) => ({
                                        ...prev,
                                        [mat.sqft]: Math.max(0, prev[mat.sqft] - 1),
                                      }))
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-800 transition-colors duration-200 hover:border-heat-500/50 hover:text-heat-700 sm:h-9 sm:w-9"
                                  >
                                    <Minus size={14} strokeWidth={2} aria-hidden />
                                  </button>
                                  <span className="w-6 text-center text-[14px] font-medium text-ink-900">
                                    {manualMats[mat.sqft]}
                                  </span>
                                  <button
                                    type="button"
                                    aria-label={`Add one ${mat.label}`}
                                    onClick={() =>
                                      setManualMats((prev) => ({
                                        ...prev,
                                        [mat.sqft]: Math.min(6, prev[mat.sqft] + 1),
                                      }))
                                    }
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-800 transition-colors duration-200 hover:border-heat-500/50 hover:text-heat-700 sm:h-9 sm:w-9"
                                  >
                                    <Plus size={14} strokeWidth={2} aria-hidden />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {hasCustomMats && (
                          <button
                            type="button"
                            onClick={() => setSelectedComboIndex(null)}
                            className="mt-4 w-full rounded-2xl border border-heat-600 bg-heat-500/[0.10] p-4 text-left"
                          >
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                              <div className="min-w-0 flex-1">
                                <span className="mb-2 inline-flex rounded-full border border-heat-700/25 bg-heat-500/15 px-2.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-heat-700">
                                  Custom
                                </span>
                                <p className="text-[14px] leading-snug text-ink-900">
                                  {Object.entries(manualMats)
                                    .filter(([, c]) => c > 0)
                                    .map(([sqft, count]) => `${count}× ${sqft} sq ft`)
                                    .join(' + ')}
                                </p>
                                <p className="mt-1 text-[11.5px] text-ink-700/60">
                                  Total coverage: {manualCoverage} sq ft
                                </p>
                              </div>
                              <p className="shrink-0 font-serif text-[16px] text-heat-700 sm:text-[17px]">
                                ₹ {manualCost.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        )}
                      </div>

                      {displayCombo.length > 0 && (
                        <div className="rounded-2xl border border-ink-950/[0.08] bg-white/70 p-4 sm:p-5">
                          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-700/55">
                            Selected mat breakdown
                          </p>
                          <div className="space-y-2">
                            {displayCombo.map((mat, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 text-[13.5px]"
                              >
                                <span className="text-ink-700">{mat?.label}</span>
                                <span className="shrink-0 text-ink-900">
                                  ₹ {mat?.price.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink-950/[0.08] pt-3 text-[13.5px]">
                            <span className="text-ink-900">Mat cost total</span>
                            <span className="shrink-0 font-serif text-[16px] text-heat-700">
                              ₹ {matCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-ink-950/15 bg-white/50 px-5 py-9 text-center">
                      <p className="text-[13.5px] leading-relaxed text-ink-700/70">
                        Enter room dimensions above to see mat recommendations.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4 · Thermostat */}
                <div className={card}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={stepBadge}>4</span>
                    <h3 className={cardTitle}>Thermostat control</h3>
                  </div>

                  <div className="space-y-2.5">
                    {Object.entries(THERMOSTATS).map(([k, v]) => (
                      <div
                        key={k}
                        role="button"
                        tabIndex={0}
                        onClick={() => setThermostat(k)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setThermostat(k);
                          }
                        }}
                        className={`relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors duration-200 sm:px-5 sm:py-4 ${
                          thermostat === k
                            ? 'border-heat-600 bg-heat-500/[0.10]'
                            : 'border-ink-950/10 bg-white hover:border-heat-500/50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] leading-snug text-ink-900">{v.label}</p>
                          <p className="mt-0.5 text-[11.5px] text-ink-700/60">{v.sublabel}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={`More about the ${v.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalThermostat(k);
                          }}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-700/70 transition-colors duration-200 hover:border-heat-500/50 hover:text-heat-700 sm:h-10 sm:w-10"
                        >
                          <Eye size={16} strokeWidth={1.7} aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right column: sticky summary, desktop ── */}
              <div className="hidden lg:block">
                <div className="sticky top-6 overflow-hidden rounded-[22px] border border-white/10 bg-ink-900">
                  {summaryHeader}
                  {summaryRows}
                  {summaryFooter}
                </div>
              </div>

              {/* ── Stacked summary, tablet and phone ── */}
              <div className="overflow-hidden rounded-[18px] border border-white/10 bg-ink-900 lg:hidden">
                {summaryHeader}
                {summaryRows}
                {summaryFooter}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Running total, pinned while the configurator is on screen ── */}
      <AnimatePresence>
        {configuratorInView && !modalThermostat && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 px-4 py-3 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-bone-500">
                  Mat + thermostat
                </p>
                <p className="truncate font-serif text-[1.35rem] leading-tight text-bone-100">
                  ₹ {total.toLocaleString()}
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-heat-500 px-5 text-[13px] font-semibold text-ink-950"
              >
                Get a quotation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Spinners eat 20px of an already narrow field on mobile. */
        .ie-num::-webkit-inner-spin-button,
        .ie-num::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .ie-num { -moz-appearance: textfield; }

        /* Track drawn on the pseudo-element so the input can stay 44px tall. */
        .ie-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(to right, #f2681c var(--ie-fill), rgba(20,16,12,0.12) var(--ie-fill));
        }
        .ie-range::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(to right, #f2681c var(--ie-fill), rgba(20,16,12,0.12) var(--ie-fill));
        }
        .ie-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          margin-top: -9px;
          border-radius: 9999px;
          background: #f2681c;
          border: 4px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20,16,12,0.25);
        }
        .ie-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #f2681c;
          border: 4px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20,16,12,0.25);
        }
        .ie-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(255,138,61,0.35); }
      `}</style>

      {/* ── Thermostat detail dialog. Bottom sheet on phones, centred above. ── */}
      <AnimatePresence>
        {modalThermostat && (
          <>
            <motion.div
              key="ie-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalThermostat(null)}
              className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm"
            />
            <motion.div
              key="ie-modal"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-5"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={THERMOSTATS[modalThermostat].label}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto max-h-[88svh] w-full overflow-y-auto overscroll-contain rounded-t-[24px] border border-ink-950/10 bg-bone-100 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] sm:max-w-md sm:rounded-[24px]"
              >
                <div className="relative h-[170px] sm:h-[190px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={THERMOSTATS[modalThermostat].image}
                    alt={THERMOSTATS[modalThermostat].label}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setModalThermostat(null)}
                    aria-label="Close"
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-ink-950/55 text-bone-100 backdrop-blur-sm transition-colors duration-200 hover:bg-ink-950/75"
                  >
                    <X size={16} strokeWidth={1.8} aria-hidden />
                  </button>
                </div>

                <div
                  className="p-5 sm:p-7"
                  style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
                >
                  <h3 className="font-serif text-[1.35rem] leading-tight tracking-wide text-ink-900 sm:text-[1.45rem]">
                    {THERMOSTATS[modalThermostat].label}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-700/80">
                    {THERMOSTATS[modalThermostat].description}
                  </p>
                  <span className="mt-5 inline-flex rounded-full border border-heat-700/25 bg-heat-500/15 px-4 py-1.5 text-[12.5px] font-medium text-heat-700">
                    {THERMOSTATS[modalThermostat].sublabel}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
