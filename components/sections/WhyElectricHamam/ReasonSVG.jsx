'use client';

/**
 * The five non-3D reason visuals, as self-contained animated SVG. Each is
 * product-relevant line-art in the site's warm heat language (matching the
 * WarmthReveal heating sheet), driven by SMIL so there's zero JS per frame and
 * nothing to unmount. `color` is the reason's accent.
 */

const common = {
  width: '78%',
  height: '78%',
  viewBox: '0 0 200 200',
  fill: 'none',
  style: { maxWidth: 320 },
};

/* 01 — Rapid Warmth: heating cable with heat flowing through it + rising wisps */
function Rapid({ color }) {
  const cable =
    'M28 150 H150 a22 22 0 0 0 0-44 H50 a22 22 0 0 1 0-44 H172';
  return (
    <svg {...common}>
      <defs>
        <linearGradient id="wsg-rapid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      {[70, 100, 130].map((x, i) => (
        <path key={x} d={`M${x} 60 q 9 -14 0 -26`} stroke={color} strokeWidth="3"
          strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 6;0 -26" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      <path d={cable} stroke={color} strokeWidth="8" strokeLinecap="round" strokeOpacity="0.18" />
      <path d={cable} stroke="url(#wsg-rapid)" strokeWidth="8" strokeLinecap="round"
        pathLength="100" strokeDasharray="22 78">
        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="2.4s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* 02 — Even Heat Distribution: a grid of floor tiles warming in an even,
   diagonal wave so the whole surface glows edge to edge — no cold spots. */
function Distribution({ color }) {
  const pos = [40, 72, 104, 136];
  const t = 24;
  return (
    <svg {...common}>
      {/* room / floor outline */}
      <rect x="30" y="30" width="140" height="140" rx="18"
        stroke={color} strokeOpacity="0.3" strokeWidth="3" fill="none" />
      {pos.map((y, r) =>
        pos.map((x, c) => (
          <rect key={`${r}-${c}`} x={x} y={y} width={t} height={t} rx="5"
            fill={color} fillOpacity="0.06" stroke={color} strokeOpacity="0.22" strokeWidth="1.5">
            <animate attributeName="fill-opacity" values="0.06;0.62;0.06"
              dur="2.8s" begin={`${(r + c) * 0.18}s`} repeatCount="indefinite" />
          </rect>
        ))
      )}
    </svg>
  );
}

/* 04 — Energy Efficient: a gauge sweeping to ~70% with a flame core */
function Efficiency({ color }) {
  // 240° arc, value ~70%
  const track = 'M46 158 A70 70 0 1 1 154 158';
  return (
    <svg {...common}>
      <path d={track} stroke="#ffffff" strokeOpacity="0.1" strokeWidth="10" strokeLinecap="round" />
      <path d={track} stroke={color} strokeWidth="10" strokeLinecap="round"
        pathLength="100" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="30" dur="1.4s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1" />
      </path>
      {/* flame */}
      <path d="M100 78 c14 12 18 24 18 34 a18 18 0 1 1-36 0 c0-6 4-14 10-18 c2 6 6 8 8 6 c2-4 0-14-0-22z"
        fill={color} fillOpacity="0.9">
        <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite" />
      </path>
      <text x="100" y="150" textAnchor="middle" fontSize="15" fontWeight="700" fill="#f5f1ec">70%</text>
    </svg>
  );
}

/* 05 — Lifetime Reliability: shield with a cable glyph + a year ring */
function Warranty({ color }) {
  return (
    <svg {...common}>
      <circle cx="100" cy="100" r="82" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" strokeDasharray="2 10" />
      <path d="M100 30 L160 54 V104 c0 40-32 58-60 72 c-28-14-60-32-60-72 V54 Z"
        stroke={color} strokeWidth="4" strokeOpacity="0.9" fill={color} fillOpacity="0.05" strokeLinejoin="round">
        <animate attributeName="fill-opacity" values="0.03;0.1;0.03" dur="3s" repeatCount="indefinite" />
      </path>
      {/* cable glyph inside */}
      <path d="M78 92 h30 a10 10 0 0 1 0 20 H86 a10 10 0 0 0 0 20 h36"
        stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* check */}
      <path d="M84 108 l12 12 l24 -26" stroke="#f5f1ec" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        pathLength="100" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.7s" begin="0.5s" fill="freeze" />
      </path>
    </svg>
  );
}

/* 06 — Healthier Comfort: gentle radiant warmth rising, clean air (no smoke) */
function Healthier({ color }) {
  return (
    <svg {...common}>
      {/* floor line */}
      <line x1="34" y1="150" x2="166" y2="150" stroke={color} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.5" />
      {[0, 1, 2].map((i) => (
        <path key={i} d="M60 150 q40 -30 80 0" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="3.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -74" dur="3.2s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* clean-air leaf + check */}
      <g transform="translate(100 58)">
        <path d="M0 -20 c18 4 26 20 20 38 c-18 -4 -26 -20 -20 -38z" fill={color} fillOpacity="0.85" />
        <path d="M-14 30 l8 8 l18 -20" stroke="#f5f1ec" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          pathLength="100" strokeDasharray="100" strokeDashoffset="100">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.7s" begin="0.6s" fill="freeze" />
        </path>
      </g>
    </svg>
  );
}

/* 07 — Fast Installation: heating mat + sweeping clock + check */
function Fast({ color }) {
  const serp = 'M56 96 H128 a12 12 0 0 1 0 24 H68 a12 12 0 0 0 0 24 H140';
  return (
    <svg {...common}>
      {/* mat */}
      <rect x="42" y="78" width="116" height="72" rx="12" stroke={color} strokeOpacity="0.35" strokeWidth="3" fill={color} fillOpacity="0.05" />
      <path d={serp} stroke={color} strokeWidth="4" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.1s" begin="0.2s" fill="freeze" />
      </path>
      {/* clock */}
      <g transform="translate(140 62)">
        <circle r="24" fill="#0f0e0d" stroke={color} strokeWidth="3" />
        <line x1="0" y1="0" x2="0" y2="-15" stroke="#f5f1ec" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="0" x2="11" y2="0" stroke={color} strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  );
}

const MAP = {
  rapid: Rapid,
  distribution: Distribution,
  efficiency: Efficiency,
  warranty: Warranty,
  healthier: Healthier,
  fast: Fast,
};

export default function ReasonSVG({ kind, color }) {
  const Comp = MAP[kind];
  return Comp ? <Comp color={color} /> : null;
}
