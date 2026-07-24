'use client';

/**
 * Content for the "Why Electric Hamam — 7 Reasons" showcase.
 *
 * Copy is reused verbatim from the previous FiveReasonsSection. The only
 * additions are presentation metadata:
 *  - `accent`  a warm hue (all pulled toward the heat palette so nothing
 *              clashes on the near-black ground)
 *  - `visual`  which product-relevant visual represents the reason. Two are
 *              real R3F 3D ('cable', 'floor'); the rest are animated SVG.
 *  - `Icon`    a small line glyph reused for the badge + reduced-motion list
 */

// Which visuals are rendered in the shared WebGL canvas vs. as SVG.
export const IS_3D = { cable: true, floor: true };

const s = (paths) => ({ size = 22, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths}
  </svg>
);

const Icons = {
  Zap: s(
    <>
      <path d="M14.5 2.5L5 13.5H12.5L9.5 21.5L19 10.5H11.5L14.5 2.5Z" />
      <path d="M12 8L10 12" strokeOpacity="0.4" strokeWidth="1" />
    </>
  ),
  Grid: s(
    <>
      <path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" />
      <path d="M3 12H21" />
      <path d="M12 3C9 7 9 17 12 21" />
      <path d="M12 3C15 7 15 17 12 21" />
    </>
  ),
  Layers: s(
    <>
      <path d="M3 7L12 3L21 7L12 11L3 7Z" />
      <path d="M3 12L12 16L21 12" />
      <path d="M3 17L12 21L21 17" />
    </>
  ),
  Dollar: s(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6V18" />
      <path d="M15 9.5C15 8.1 13.7 7 12 7C10.3 7 9 8.1 9 9.5C9 10.9 10.3 12 12 12C13.7 12 15 13.1 15 14.5C15 15.9 13.7 17 12 17C10.3 17 9 15.9 9 14.5" />
    </>
  ),
  Shield: s(
    <>
      <path d="M12 21.5C12 21.5 3.5 17.5 3.5 11V5.5L12 2.5L20.5 5.5V11C20.5 17.5 12 21.5 12 21.5Z" />
      <path d="M8.5 12L10.5 14L15.5 9.5" />
    </>
  ),
  Heart: s(
    <>
      <path d="M12 20.5C12 20.5 2.5 14.5 2.5 8.5C2.5 5.5 4.9 3 8 3C9.9 3 11.6 4 12 5.5C12.4 4 14.1 3 16 3C19.1 3 21.5 5.5 21.5 8.5C21.5 14.5 12 20.5 12 20.5Z" />
    </>
  ),
  Clock: s(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12.5L15.5 15" />
    </>
  ),
};

export const REASONS = [
  {
    num: '01',
    title: 'Rapid Warmth',
    desc: 'Our electric hamam systems reach operating temperature in 45–60 minutes — far faster than wood-fired hamams.',
    stat: '45–60 min',
    statLabel: 'to full warmth',
    accent: '#ff8a3d',
    visual: 'rapid',
    Icon: Icons.Zap,
  },
  {
    num: '02',
    title: 'Even Heat Distribution',
    desc: 'Electric underfloor heating delivers consistent warmth across the entire floor surface, eliminating cold spots for a more comfortable room.',
    stat: 'Edge to edge',
    statLabel: 'no cold spots',
    accent: '#ffb061',
    visual: 'cable',
    Icon: Icons.Grid,
  },
  {
    num: '03',
    title: 'Low Floor Build-Up',
    desc: 'Engineered for efficient installation with minimal floor height increase — only 2.5–3 inches including insulation, heating and finish.',
    stat: '2.5–3 in',
    statLabel: 'total build-up',
    accent: '#f2681c',
    visual: 'floor',
    Icon: Icons.Layers,
  },
  {
    num: '04',
    title: 'Energy Efficient Heating',
    desc: 'A heated hamam system is up to 70% more energy efficient than traditional wood-fired heating methods.',
    stat: 'Up to 70%',
    statLabel: 'more efficient',
    accent: '#ffc65c',
    visual: 'efficiency',
    Icon: Icons.Dollar,
  },
  {
    num: '05',
    title: 'Lifetime Reliability',
    desc: 'Designed to last for decades with zero maintenance. Systems include a lifetime warranty with 10–25 year product guarantees.',
    stat: '10–25 yr',
    statLabel: 'guarantee',
    accent: '#ff7a3c',
    visual: 'warranty',
    Icon: Icons.Shield,
  },
  {
    num: '06',
    title: 'Healthier Indoor Comfort',
    desc: 'Gentle radiant warmth without smoke, dry air or dust circulation — unlike wood fires, harsh ACs or gas heaters.',
    stat: 'Zero',
    statLabel: 'smoke & dust',
    accent: '#ff9e4f',
    visual: 'healthier',
    Icon: Icons.Heart,
  },
  {
    num: '07',
    title: 'Fast Installation',
    desc: 'From civil prep and heating install to final floor finishing and guarantee registration — typically completed within 5–6 hours.',
    stat: '5–6 hrs',
    statLabel: 'start to finish',
    accent: '#f2861c',
    visual: 'fast',
    Icon: Icons.Clock,
  },
];
