'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, X, ShieldCheck } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────────────
   HOW TO ADD YOUR VIDEOS (Cloudinary)
   ─────────────────────────────────────────────────────────────────
   1. cloudinary.com par free account banao. Dashboard ke top pe
      "Cloud Name" milega (e.g. "theheatingstore"), wahi CLOUD_NAME
      neeche daalna hai.
   2. Media Library kholo → "Upload" button → apni 4-5 videos
      drag-drop karo. Organize rakhne ke liye ek folder bana lo,
      jaise "trust-videos".
   3. Upload hone ke baad har video par click karo → "Copy URL"
      (secure_url) le lo. Kuch aisa dikhega:
      https://res.cloudinary.com/theheatingstore/video/upload/v1721234567/trust-videos/customer1.mp4
   4. Performance ke liye URL mein /upload/ ke baad transformation
      params daal do, f_auto (best format browser ke hisaab se,
      webm/mp4) aur q_auto (auto compression). Isse site smooth
      chalegi, heavy raw video load nahi hogi:
      .../upload/f_auto,q_auto/v1721234567/trust-videos/customer1.mp4
   5. Thumbnail/poster ke liye same public id se ek frame nikaal lo 
      extension .mp4 se .jpg kardo aur so_1 (second 1 ka frame) daalo:
      .../upload/so_1,f_auto,q_auto/v1721234567/trust-videos/customer1.jpg
   6. Dono URLs (video + poster) neeche VIDEOS array mein paste karo.
   Bas itna hi, ye component khud video ko lazy-load karta hai,
   sirf thumbnail dikhta hai jab tak user play na kare, isliye page
   load pe koi video download nahi hoti.
   ───────────────────────────────────────────────────────────────── */

const CLOUD_NAME = 'dn93qohq'; 

const VIDEOS = [
  {
    id: 'v1',
    name: 'Bilal Ahmad',
    location: 'Rajbagh, Srinagar',
    // Replace with your real Cloudinary video URL:
    src: `https://res.cloudinary.com/dn93qohq/video/upload/f_auto,q_auto/C8011_b23li0.mp4`,
    poster: `https://res.cloudinary.com/dn93qohq/video/upload/so_1,f_auto,q_auto/C8011_b23li0.jpg`,
  },
  {
    id: 'v2',
    name: 'Nusrat Jan',
    location: 'Hyderpora, Srinagar',
    src: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/trust-videos/customer2.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,f_auto,q_auto/trust-videos/customer2.jpg`,
  },
  {
    id: 'v3',
    name: 'Owais Bhat',
    location: 'Anantnag',
    src: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/trust-videos/customer3.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,f_auto,q_auto/trust-videos/customer3.jpg`,
  },
  {
    id: 'v4',
    name: 'Farhana Khan',
    location: 'Baramulla',
    src: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/trust-videos/customer4.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,f_auto,q_auto/trust-videos/customer4.jpg`,
  },
  {
    id: 'v5',
    name: 'Imran Sofi',
    location: 'Sopore',
    src: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/trust-videos/customer5.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1,f_auto,q_auto/trust-videos/customer5.jpg`,
  },
];

function VideoCard({ video, index, onOpen }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.button
      ref={ref}
      type="button"
      className="tv-card"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.06 }}
      aria-label={`Play video testimonial from ${video.name}`}
    >
      <div className="tv-card-media">
        <img src={video.poster} alt={`${video.name} testimonial`} loading="lazy" />
        <div className="tv-card-overlay" />
        <span className="tv-play-btn">
          <Play size={18} fill="#14110D" strokeWidth={0} />
        </span>
      </div>
      <div className="tv-card-info">
        <p className="tv-card-name">{video.name}</p>
        <p className="tv-card-loc">{video.location}</p>
      </div>
    </motion.button>
  );
}

function VideoLightbox({ video, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="tv-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" className="tv-lightbox-close" onClick={onClose} aria-label="Close video">
        <X size={20} />
      </button>
      <motion.div
        className="tv-lightbox-inner"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          key={video.id}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="tv-lightbox-video"
        />
        <div className="tv-lightbox-caption">
          <p className="tv-lightbox-name">{video.name}</p>
          <p className="tv-lightbox-loc">{video.location}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TrustVideos() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const handleOpen = useCallback((i) => setOpenIndex(i), []);
  const handleClose = useCallback(() => setOpenIndex(null), []);
  const handlePrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + VIDEOS.length) % VIDEOS.length)),
    []
  );
  const handleNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % VIDEOS.length)),
    []
  );

  return (
    <section className="tv-section" ref={sectionRef}>
      <style>{`
        /* Re-authored against the site's own tokens and faces.
           ─────────────────────────────────────────────────────
           This section was built for the old /landing design and named
           'Fraunces', 'Instrument Sans' and 'IBM Plex Mono' directly. Those
           three faces were loaded by app/landing/page.jsx and nothing else,
           so once that route moved onto the site's Bebas Neue / Hanken
           Grotesk pair the names resolved to nothing and every heading here
           fell back to the browser's default serif. It is now set in
           --font-heading / --font-body like the rest of the site, and its
           palette is the ink/copper/ivory ramp from HomeHero.css.

           It sits directly under Testimonials, which is on the same warm
           cream ground, so this one takes the darker ink treatment: two
           adjacent cream sections with centred headings read as one section
           that lost its place. */
        .tv-section {
          --ink: #0a0705;
          --copper: #a86b3f;
          --copper-light: #c99669;
          --copper-bright: #e7c39b;
          --ivory: #f6f2ec;
          --line: rgba(246,242,236,0.12);
          font-family: var(--font-body);
          background: linear-gradient(180deg, #150e08 0%, #0d0906 55%, var(--ink) 100%);
          padding: clamp(4rem, 8vw, 6.5rem) clamp(1.25rem, 5vw, 2.5rem);
        }
        .tv-inner { max-width: 1160px; margin: 0 auto; }
        .tv-head { text-align: center; max-width: 620px; margin: 0 auto 52px; }
        .tv-eyebrow {
          display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 100px;
          background: rgba(168,107,63,0.16); border: 1px solid rgba(231,195,155,0.28);
          color: var(--copper-bright); font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 18px; font-family: var(--font-body);
        }
        .tv-title {
          font-family: var(--font-heading); font-weight: 400;
          font-size: clamp(2rem, 4.2vw, 3.25rem); line-height: 0.98;
          letter-spacing: 0.005em; text-transform: uppercase;
          color: var(--ivory); margin: 0 0 16px;
        }
        .tv-title em {
          font-style: normal;
          background: linear-gradient(100deg, var(--copper-light) 0%, var(--copper-bright) 45%, var(--copper) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tv-sub { font-size: 15px; color: rgba(246,242,236,0.6); line-height: 1.7; margin: 0; }

        .tv-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
        }
        /* The dark-glass card the whole site uses (.hhero__card / .whc-card). */
        .tv-card {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
            rgba(20,13,8,0.5);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          text-align: left;
          font-family: var(--font-body);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
        }
        .tv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 70px rgba(0,0,0,0.5),
            0 0 30px -10px rgba(184,107,69,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .tv-card-media {
          position: relative;
          aspect-ratio: 9 / 13;
          background: #150e08;
        }
        .tv-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .tv-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,7,5,0) 40%, rgba(10,7,5,0.7) 100%);
        }
        .tv-play-btn {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #e7c39b, #c99669 55%, #a86b3f);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 30px -6px rgba(200,120,55,0.6), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .tv-play-btn svg { margin-left: 2px; }
        .tv-card-info { padding: 12px 14px 14px; }
        .tv-card-name { font-size: 13.5px; font-weight: 600; color: var(--ivory); margin: 0; }
        .tv-card-loc {
          font-size: 10.5px; margin: 4px 0 0; font-family: var(--font-body);
          font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(246,242,236,0.5);
        }

        /* Lightbox */
        .tv-lightbox {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(10,7,5,0.9);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .tv-lightbox-close {
          position: absolute; top: 22px; right: 26px;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(246,242,236,0.08); border: 1px solid rgba(246,242,236,0.22);
          color: var(--ivory); display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .tv-lightbox-inner { max-width: 420px; width: 100%; }
        .tv-lightbox-video {
          width: 100%; max-height: 76vh; border-radius: 16px; background: #000;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
        .tv-lightbox-caption { text-align: center; margin-top: 14px; }
        .tv-lightbox-name { color: var(--ivory); font-size: 14px; font-weight: 600; margin: 0; }
        .tv-lightbox-loc {
          color: rgba(246,242,236,0.55); font-size: 11px; margin: 4px 0 0;
          font-family: var(--font-body); font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
        }

        @media (max-width: 1024px) {
          .tv-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .tv-section { padding: 64px 20px; }
          .tv-head { margin-bottom: 36px; }
          .tv-grid {
            grid-template-columns: none;
            grid-auto-flow: column;
            grid-auto-columns: 62%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 6px;
            margin: 0 -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .tv-card { scroll-snap-align: start; }
        }
      `}</style>

      <div className="tv-inner">
        <motion.div
          className="tv-head"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Was "Real homes, real warmth" — word for word the heading the
              Testimonials section directly above this one already carries.
              Two sections running the same headline back to back reads as a
              duplicated block rather than a second kind of proof, so this one
              names what is actually different about it: these are on camera. */}
          <span className="tv-eyebrow"><ShieldCheck size={12} /> In Their Own Words</span>
          <h2 className="tv-title">On <em>Camera</em></h2>
          <p className="tv-sub">Hear directly from families across Kashmir about their underfloor heating install and how it&apos;s changed their winters.</p>
        </motion.div>

        <div className="tv-grid">
          {VIDEOS.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <VideoLightbox
          video={VIDEOS[openIndex]}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
