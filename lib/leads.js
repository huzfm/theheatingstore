/**
 * The one place the site talks to the leads API.
 *
 * Every public form — the contact page, the landing page, the hero popup —
 * posts the same document to the same endpoint, so the endpoint, the payload
 * shape and the error handling live here rather than being copied into each
 * form and drifting apart, which is what had already happened: three forms,
 * three different hardcoded hosts, two of them stale.
 *
 *   POST {LEADS_API_BASE}/api/leads
 *   {
 *     name, phone, message, source, location,
 *     customerAddress, customerLat, customerLng, googleMapsLink
 *   }
 *
 * The location half of that payload is what `LocationField` produces. The
 * backend re-resolves it on arrival — an explicit pin wins, then a pasted map
 * link, then a geocode of the address — so sending the address alone is valid;
 * the coordinates just make the answer exact rather than inferred.
 *
 * `source` is deliberately not used to say which form was filled in. The API
 * collapses every public source to "Website Enquiry" and refuses anything else,
 * so the form's identity is carried in the first line of `message` instead,
 * which is where the team actually reads it.
 */

/**
 * The API host. The live one in every environment, development included —
 * these forms used to fall back to http://localhost:5050 when NODE_ENV was not
 * production, which meant a form tested locally silently posted nowhere unless
 * a backend happened to be running on that port.
 *
 * Both env names are read because both are already in use on this site: the
 * warranty proxy reads NEXT_PUBLIC_API_URL, the landing page read
 * NEXT_PUBLIC_API_BASE_URL. Either one, set anywhere, wins — a deployment does
 * not have to know which file asked for which, and pointing at a local backend
 * is still a matter of setting one of them.
 */
const DEFAULT_API_BASE = 'https://api.theheatingstore.in';

export const LEADS_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;

/** The public source value the API accepts. Anything else is rewritten to it. */
export const LEAD_SOURCE = 'Website Enquiry';

/** @typedef {{ address: string, lat: number|null, lng: number|null }} PickedPlace */

export function buildGoogleMapsLink(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return '';
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * The districts `DetailedLead.location` can hold. The backend detects these
 * from the address itself, so this is only a hint sent alongside it — but
 * sending it means a lead is filed correctly even if the address is phrased in
 * a way the server-side matcher misses.
 */
const KNOWN_DISTRICTS = ['Srinagar', 'Anantnag', 'Baramulla'];

export function detectDistrict(text = '') {
  const value = String(text).toLowerCase();
  if (!value) return '';
  if (value.includes('srinagar')) return 'Srinagar';
  if (value.includes('anantnag') || value.includes('islamabad')) return 'Anantnag';
  if (value.includes('baramulla') || value.includes('baramula')) return 'Baramulla';
  return '';
}

/**
 * A one-line, human-readable record of where the pin ended up, folded into the
 * message so the address survives even for a reader looking only at the
 * WhatsApp alert, which does not render the coordinate fields.
 */
export function describePlace(place) {
  if (!place?.address && place?.lat == null) return '';
  const parts = [];
  if (place.address) parts.push(place.address);
  if (typeof place.lat === 'number' && typeof place.lng === 'number') {
    parts.push(`${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`);
    parts.push(buildGoogleMapsLink(place.lat, place.lng));
  }
  return `Pinned location: ${parts.join(' — ')}`;
}

/**
 * Posts a lead.
 *
 * @param {object} input
 * @param {string} input.name
 * @param {string} input.phone
 * @param {string} [input.message]  Free text from the customer.
 * @param {string} [input.formLabel] Which form this was, e.g. 'Contact form'.
 * @param {PickedPlace|null} [input.place] Output of `LocationField`.
 * @param {string} [input.location] Fallback district when no place was picked.
 * @param {string[]} [input.notes] Extra lines appended to the message (ad tags).
 * @returns {Promise<object>} The created lead.
 * @throws {Error} On a network failure or a non-2xx response.
 */
export async function submitLead({
  name,
  phone,
  message = '',
  formLabel = '',
  place = null,
  location = '',
  notes = [],
}) {
  const hasPin = typeof place?.lat === 'number' && typeof place?.lng === 'number';
  const address = place?.address?.trim() || '';

  const messageLines = [
    formLabel,
    ...notes.filter(Boolean),
    message.trim(),
    describePlace(place),
  ].filter(Boolean);

  const body = {
    name: name.trim(),
    phone: phone.trim(),
    message: messageLines.join('\n'),
    source: LEAD_SOURCE,
    location: detectDistrict(address) || detectDistrict(location) || location || 'Unknown',
    customerAddress: address,
    customerLat: hasPin ? place.lat : null,
    customerLng: hasPin ? place.lng : null,
    googleMapsLink: hasPin ? buildGoogleMapsLink(place.lat, place.lng) : '',
  };

  const res = await fetch(`${LEADS_API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // The API answers a rejected lead with { message }. Surfacing that beats a
    // generic failure line, since the common case is a phone number the
    // backend would not accept.
    let detail = '';
    try {
      detail = (await res.json())?.message || '';
    } catch {
      /* non-JSON error body, the status is all we have */
    }
    throw new Error(detail || `Lead submission failed (${res.status})`);
  }

  return res.json();
}

export { KNOWN_DISTRICTS };
