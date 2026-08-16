import { NextResponse } from "next/server";

/**
 * Warranty lookup proxy.
 *
 *   GET /api/warranty/check?phone=…
 *   GET /api/warranty/check?warrantyId=…
 *
 * Forwards to the warranty register at
 * https://api.theheatingstore.in/api/warranty/lookup and is the only thing on
 * the site that talks to it. Going through here rather than calling the API
 * from the browser keeps the request same-origin (no CORS on the backend, no
 * preflight) and keeps the API host out of the page source.
 *
 * ── The contract this route guarantees ──────────────────────────────────────
 * 2xx  ->  { results: Warranty[] }   always an array, [] meaning "searched,
 *                                    found nothing", which is an answer, not
 *                                    an error
 * 4xx/5xx -> { message: string }
 *
 * That guarantee is the point of the file. The backend has been observed to
 * answer a miss with 404 + { message: "No warranty found" } and a hit with the
 * record in any of several envelopes, and WarrantyLookup used to unwrap all of
 * those client-side. Its last fallback wrapped the entire response body in an
 * array, so an error payload rendered as a warranty record with every field
 * blank. One unwrapper, here.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.theheatingstore.in";

/** Every envelope the register has been seen to use, flattened to an array. */
function normalizeResults(payload) {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.result)) return payload.result;
  if (payload.record) return [payload.record];
  if (payload.data && typeof payload.data === "object") return [payload.data];
  if (payload.result && typeof payload.result === "object") return [payload.result];

  // A bare record, recognised by a field only a record carries. Anything else
  // (a stray { message } on a 200, say) is not a warranty and returns nothing
  // rather than a card full of blanks.
  if (payload.warrantyId || payload.expiryDate || payload.installationDate) return [payload];

  return [];
}

/**
 * The visitor's IP, as the register will see it.
 *
 * This matters more than it looks. The lookup endpoint throttles itself to 15
 * requests per minute per IP, and it reads `x-forwarded-for` before falling
 * back to the socket address. Proxying without this header means every visitor
 * arrives as the same address — this server — so the whole site shares one
 * 15/min budget and starts collecting 429s under trivial load. Forwarding the
 * real client IP restores the limit to what it was designed to be: per person.
 */
function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "";
}

export async function GET(req) {
  const phone = req.nextUrl.searchParams.get("phone");
  const warrantyId = req.nextUrl.searchParams.get("warrantyId");

  if (!phone && !warrantyId) {
    return NextResponse.json(
      { message: "Phone number or warranty ID is required" },
      { status: 400 }
    );
  }

  try {
    const ip = clientIp(req);

    // POST, not GET. The register documents POST as the shape for the public
    // lookup precisely so the search term travels in a body: a customer's phone
    // number in a query string ends up in access logs and Referer headers. The
    // handler answers both, so this is a free correction.
    const backendRes = await fetch(`${BACKEND}/api/warranty/lookup`, {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(phone ? { phone } : { warrantyId }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(ip ? { "x-forwarded-for": ip } : {}),
      },
      // A warranty lookup that has not answered in ten seconds is a failure the
      // visitor should be told about, not a spinner that runs until the tab is
      // closed. Without this the fetch inherits the platform default, which on
      // a hung upstream is effectively no limit.
      signal: AbortSignal.timeout(10_000),
    });

    const text = await backendRes.text();

    // The register is not guaranteed to answer in JSON on an error path (a
    // gateway timeout is usually HTML), so parsing is allowed to fail without
    // taking the route down with it.
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!backendRes.ok) {
      // 404 is the register's way of saying "no such record". That is a
      // successful search with nothing in it, and the page renders its own
      // "no record found" state for it.
      if (backendRes.status === 404) {
        return NextResponse.json({ results: [] }, { status: 200 });
      }
      return NextResponse.json(
        { message: data?.message || "Warranty lookup failed" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ results: normalizeResults(data) }, { status: 200 });
  } catch (err) {
    // TimeoutError from AbortSignal.timeout above, or a genuine network fault.
    const timedOut = err?.name === "TimeoutError";
    console.error("Warranty proxy error:", err);
    return NextResponse.json(
      {
        message: timedOut
          ? "The warranty register did not respond in time. Please try again."
          : "Server error",
      },
      { status: timedOut ? 504 : 500 }
    );
  }
}
