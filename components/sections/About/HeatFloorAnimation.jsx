'use client';

/**
 * Warm animated mesh-gradient — pure CSS, no WebGL.
 *
 * Soft blurred thermal orbs drift and breathe behind the glass, blending
 * (mix-blend: screen) into a living pool of warmth; embers rise and fade off a
 * gently glowing floor line. Slow, smooth easing so it reads as calm and
 * premium rather than busy. Frozen under prefers-reduced-motion into a still
 * warm gradient.
 */

// Deterministic (no Math.random) so server and client markup match.
const ORBS = [
  { c: '#ff8a3d', size: 62, x: 22, y: 30, dur: 17, delay: 0, k: 'a' },
  { c: '#ff4d6d', size: 54, x: 66, y: 24, dur: 21, delay: -4, k: 'b' },
  { c: '#ffd23f', size: 50, x: 58, y: 66, dur: 19, delay: -8, k: 'c' },
  { c: '#ff5e2c', size: 66, x: 30, y: 70, dur: 23, delay: -6, k: 'd' },
  { c: '#ff9e5e', size: 44, x: 46, y: 46, dur: 15, delay: -2, k: 'a' },
];

const EMBERS = [
  { x: 20, s: 5, dur: 7.5, delay: 0 },
  { x: 34, s: 3, dur: 9, delay: 2.2 },
  { x: 48, s: 6, dur: 8, delay: 1 },
  { x: 58, s: 3.5, dur: 10, delay: 3.4 },
  { x: 68, s: 5, dur: 8.6, delay: 0.6 },
  { x: 80, s: 4, dur: 9.6, delay: 2.8 },
  { x: 27, s: 3, dur: 11, delay: 4.5 },
  { x: 74, s: 4.5, dur: 7.8, delay: 5.2 },
];

export default function HeatFloorAnimation() {
  return (
    <div className="hf-wrap absolute inset-0 overflow-hidden">
      <style>{`
        .hf-wrap {
          background:
            radial-gradient(120% 100% at 50% 18%, #2a1207 0%, #140b07 55%, #0a0807 100%);
        }
        .hf-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(34px);
          mix-blend-mode: screen;
          opacity: 0.85;
          will-change: transform;
        }
        @keyframes hf-a {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(14%,-10%) scale(1.14); }
          66%     { transform: translate(-10%,8%) scale(0.92); }
        }
        @keyframes hf-b {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-16%,12%) scale(1.18); }
        }
        @keyframes hf-c {
          0%,100% { transform: translate(0,0) scale(0.96); }
          40%     { transform: translate(12%,10%) scale(1.12); }
          75%     { transform: translate(-8%,-12%) scale(1.02); }
        }
        @keyframes hf-d {
          0%,100% { transform: translate(0,0) scale(1.05); }
          50%     { transform: translate(10%,-14%) scale(0.9); }
        }
        .hf-floor {
          position: absolute;
          left: 8%; right: 8%; bottom: 14%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,180,110,0.9), transparent);
          box-shadow: 0 0 26px 6px rgba(255,138,61,0.5);
          animation: hf-floorpulse 5.5s ease-in-out infinite;
        }
        @keyframes hf-floorpulse {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 1; }
        }
        .hf-ember {
          position: absolute;
          bottom: 14%;
          border-radius: 50%;
          background: radial-gradient(circle, #fff2d6 0%, #ffb061 55%, rgba(255,138,61,0) 100%);
          filter: blur(0.4px);
          opacity: 0;
          will-change: transform, opacity;
          animation: hf-rise linear infinite;
        }
        @keyframes hf-rise {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          12%  { opacity: 0.9; }
          70%  { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-230px) scale(1.1); }
        }
        .hf-sheen {
          position: absolute; inset: 0;
          background: radial-gradient(60% 45% at 50% 30%, rgba(255,220,170,0.10), transparent 70%);
          animation: hf-breathe 7s ease-in-out infinite;
        }
        @keyframes hf-breathe {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 0.95; }
        }
        .hf-vig {
          position: absolute; inset: 0;
          background: radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(10,8,7,0.75) 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .hf-orb, .hf-floor, .hf-ember, .hf-sheen { animation: none !important; }
          .hf-ember { opacity: 0.5; }
        }
      `}</style>

      {ORBS.map((o, i) => (
        <span
          key={i}
          className="hf-orb"
          style={{
            width: `${o.size}%`,
            height: `${o.size}%`,
            left: `${o.x - o.size / 2}%`,
            top: `${o.y - o.size / 2}%`,
            background: `radial-gradient(circle, ${o.c} 0%, ${o.c}00 70%)`,
            animation: `hf-${o.k} ${o.dur}s ease-in-out ${o.delay}s infinite`,
          }}
        />
      ))}

      <div className="hf-sheen" />
      <div className="hf-floor" />

      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="hf-ember"
          style={{
            left: `${e.x}%`,
            width: `${e.s}px`,
            height: `${e.s}px`,
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}

      <div className="hf-vig" />
    </div>
  );
}
