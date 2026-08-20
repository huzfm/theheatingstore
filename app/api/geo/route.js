import { NextResponse } from 'next/server';

/**
 * Place search and reverse geocoding for the public forms' location field.
 *
 *   GET /api/geo?q=rajbagh            -> search
 *   GET /api/geo?lat=34.1&lng=74.8    -> reverse ("use my current location")
 *
 * Both answer the same shape:
 *
 *   2xx     -> { results: [{ label, lat, lng }] }   [] means "found nothing"
 *   4xx/5xx -> { message }
 *
 * OpenStreetMap's Nominatim backs it, not Google Places: this project has no
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY set anywhere, so a Places autocomplete would
 * render its "add an API key" fallback for every visitor. Nominatim needs no
 * key, and it is the same provider the leads API itself falls back to when it
 * re-resolves the address on arrival, so the two agree on what a place is.
 *
 * It is proxied rather than called from the browser for three reasons: the
 * usage policy wants an identifying User-Agent, which a browser will not let a
 * page set; results are cached here, so a repeated search costs nothing
 * upstream; and the request stays same-origin, so no CORS preflight.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org';

/**
 * Sent on every upstream call, as the usage policy requires. A contact address
 * in the agent string is what stops the whole site being blocked over one
 * misbehaving client.
 */
const USER_AGENT = 'TheHeatingStore-Site/1.0 (+https://theheatingstore.in; info@theheatingstore.in)';

/**
 * Results are biased to Jammu & Kashmir rather than restricted to it. Every
 * customer is in the region, so a bare "rajbagh" should find the Srinagar one
 * first — but a viewbox that excluded everything else would leave someone
 * enquiring about a property elsewhere unable to enter their own address.
 */
const JK_VIEWBOX = '73.8,32.2,80.3,35.7';

const SEARCH_TTL_SECONDS = 60 * 60 * 24;

/** One upstream call, with the shared headers and cache policy. */
async function nominatim(path, params) {
  const url = new URL(`${NOMINATIM}/${path}`);
  url.searchParams.set('format', 'jsonv2');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
    next: { revalidate: SEARCH_TTL_SECONDS },
  });
  if (!res.ok) throw new Error(`Geocoder answered ${res.status}`);
  return res.json();
}

/** Nominatim's lat/lon arrive as strings; a place with unusable ones is dropped. */
function toResult(entry) {
  const lat = Number.parseFloat(entry?.lat);
  const lng = Number.parseFloat(entry?.lon);
  const label = entry?.display_name;
  if (!label || Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { label, lat, lng };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  try {
    if (lat && lng) {
      const latitude = Number.parseFloat(lat);
      const longitude = Number.parseFloat(lng);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return NextResponse.json({ message: 'Invalid coordinates' }, { status: 400 });
      }

      const place = await nominatim('reverse', {
        lat: String(latitude),
        lon: String(longitude),
        zoom: '18',
      });
      const result = toResult(place);
      // A reverse lookup that finds no street still located the customer. The
      // coordinates are the useful half, so they are returned with a plain
      // coordinate label rather than as an empty result the form must handle.
      return NextResponse.json({
        results: [
          result || { label: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, lat: latitude, lng: longitude },
        ],
      });
    }

    // Two characters is below what Nominatim can answer usefully and every
    // keystroke before that would be one wasted upstream call.
    if (!q || q.length < 3) return NextResponse.json({ results: [] });

    const places = await nominatim('search', {
      q,
      limit: '6',
      addressdetails: '0',
      countrycodes: 'in',
      viewbox: JK_VIEWBOX,
      bounded: '0',
    });

    const results = (Array.isArray(places) ? places : []).map(toResult).filter(Boolean);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Geo lookup failed:', error);
    return NextResponse.json({ message: 'Location lookup is unavailable right now' }, { status: 502 });
  }
}
