/**
 * A country flag, as a static SVG file.
 *
 * Replaces `react-world-flags`, which was the single most expensive thing on
 * this site. That package inlines its entire ISO-3166 dataset, 250 countries
 * with translations, demonyms, currencies, borders, alt-spellings and
 * sub-regions, into the client bundle. It compiled to a 3.6 MB uncompressed
 * chunk loaded as a non-deferred <script async> on /why-choose-us and
 * /global-experience, and it existed to draw NINE flags.
 *
 * On the mobile networks this site is actually read on, that is the difference
 * between a page and a wait.
 *
 * The nine SVGs we need were lifted out of that package into /public/flags and
 * are served as ordinary images: 55 KB total, cached, lazy by default, and
 * zero JavaScript. Adding a country means dropping its ISO alpha-2 SVG into
 * that folder.
 *
 * `alt` is empty by default because these flags sit immediately beside the
 * country name in every current usage, so announcing "flag of Sweden, Sweden"
 * to a screen reader is noise. Pass an explicit `alt` if a flag ever stands
 * alone.
 */
export default function Flag({ code, alt = '', className = '', style, ...rest }) {
  if (!code) return null;
  const iso = String(code).toLowerCase();

  return (
    <img
      src={`/flags/${iso}.svg`}
      alt={alt}
      // Intrinsic 4:3, the aspect the source SVGs are drawn at. Given so the
      // browser reserves the box before the file lands instead of reflowing
      // the row it sits in.
      width={40}
      height={30}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
      {...rest}
    />
  );
}
