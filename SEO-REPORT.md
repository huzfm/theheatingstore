# SEO Audit & Remediation — theheatingstore.in

Six phases, audited and applied 2026-08-09. Next.js 16.1.6, App Router, Turbopack.

Everything below was verified against the **built HTML** in `.next/server/app`, not
against source. That distinction matters: the worst defects on this site came from
App Router metadata *inheritance* and from client-only rendering, neither of which
is visible by reading component files.

Two automated checks now enforce the results and should run after `next build`:

```bash
pnpm build
node scripts/check-metadata.mjs   # titles, descriptions, canonicals, OG, headings, uniqueness
node scripts/check-schema.mjs     # JSON-LD validity, required props, banned types
```

Both currently pass. `scripts/check-schema.mjs` fails the build if `AggregateRating`
or `Review` ever reappears.

---

## Before / after

| Metric | Before | After |
|---|---:|---:|
| Routes with a canonical | 22 / 55 | **53 / 56** |
| Routes with an `og:image` | 12 | **53** |
| External (Unsplash) OG images | 1 | **0** |
| `<meta name="keywords">` tags | 55 | **0** |
| Unique `twitter:description` | 8 | **52** |
| Titles over 60 characters | 44 | **0** |
| Descriptions outside 140–160 | 41 | **0** |
| Routes with ≠ 1 `<h1>` | 4 | **0** (¹) |
| Heading-level skips | 5 | **0** |
| Pages serving `0% Customers satisfied` | 1 | **0** |
| `hamam` / `hammam` spelling split | 499 / 51 | **all `hamam`** |
| Live `@electrichamam.in` addresses | 2 | **0** |
| Orphan pages (0 inbound links) | 13 | **0** (²) |
| Nav links missing from server HTML | 7 | **0** |
| Discarded (built-then-dropped) JSON-LD blocks | 18 | **0** |
| Invalid `Offer` blocks (no price) | 5 | **0** |
| Fabricated `AggregateRating` | 1 | **0** |
| Remote image hosts in production | 2 | **0** |
| Sitemap URLs | 40 (incl. 1 robots-blocked) | **47, none blocked** |
| Static JS chunks on disk | 8.2 MB | **4.7 MB** |
| Initial JS, `/why-choose-us` | 4589 KB | **811 KB** |
| Initial JS, homepage | 969 KB | **841 KB** |

¹ `/AboutSection` has none, correctly — it is a `permanentRedirect` and renders nothing.
² Excluding three 308 redirects, `/admin`, a noindex dev route, and `/hero` + `/landing`,
which are deliberately unlinked pending a decision (see *Requires human input*).

### Initial JS per route (uncompressed)

| Route | Before | After | |
|---|---:|---:|---:|
| `/why-choose-us` | 4589 KB | 811 KB | **−82%** |
| `/global-experience` | 4551 KB | 774 KB | **−83%** |
| `/landing` | 1057 KB | 884 KB | −16% |
| `/` | 969 KB | 841 KB | −13% |
| `/book-site-visit` | 947 KB | 818 KB | −14% |
| `/product` | 921 KB | 793 KB | −14% |
| `/installation` | 899 KB | 774 KB | −14% |
| `/contact` | 894 KB | 769 KB | −14% |
| **14 routes combined** | **20,690 KB** | **11,794 KB** | **−43%** |

---

## The five defects that mattered most

**1. Seven nav destinations had no `<a href>` anywhere on the site.**
The header's "More" dropdown rendered inside `{moreOpen && …}`, so its links existed
only after a human clicked. `/why-choose-us`, `/how-it-works`, `/working`, `/journal`,
`/certifications` and `/measuring-up` were unreachable by any crawler — while
`/why-choose-us` sat in the sitemap at priority 0.9 and absorbed two 308 redirects.
The panel is now always mounted, hidden with `visibility`/`opacity` and `inert`.

**2. `/about` served `0% Customers satisfied`.**
`CounterNumber` server-rendered its `from` value (0), not its target. The served HTML
read `0+ Years installing`, `0+ Systems supplied`, `0% Customers satisfied`. It now
renders the real figure and walks back to 0 on the client while off-screen, so the
count-up animation is intact.

**3. The site contradicted itself on every headline number.**
Install count was 5,000 and 6,000. The installation warranty was 5, 10, 25 and
lifetime years on different pages. Heat retention was 8–10, 6–10 and 6–8 hours.
Opening hours were stated three ways, twice in the same file. `/contact` published a
different email domain from the footer and the schema. All of it now derives from
`content/facts.ts`.

**4. Eighteen structured-data blocks were built and thrown away.**
`AreaPageTemplate` and `ProductPageTemplate` both accepted a `jsonLd` prop,
destructured it, and never rendered it. Fifteen area `LocalBusiness` objects and
three product schemas were constructed on every request and discarded.

**5. A 3.6 MB chunk to draw nine flags.**
`react-world-flags` inlines the entire ISO-3166 dataset — translations, demonyms,
currencies, borders — and loaded as a non-deferred `<script async>` on the site's
main credibility page. Replaced with nine 55 KB SVGs served as lazy `<img>`.

---

## What changed, by phase

### Phase 1 — Single source of truth
- **`content/facts.ts`** — frozen, typed, with provenance. Install counts, founding
  year, warranty, heat retention, phone, WhatsApp, email, hours, address, price range,
  `sameAs`, service areas.
- `yearsInBusiness()` and `currentYear()` are **computed**, so "15+ Years installing"
  and the footer copyright cannot go stale. The footer previously read `© 2011`.
- Spelling standardised to `hamam` (51 occurrences, including the site-wide `<title>`).
- Both `@electrichamam.in` addresses removed.

### Phase 2 — Metadata
- **`content/page-meta.ts`** — 47 approved title/description/twitter triples.
- **`app/lib/seo.js`** — was an empty file; now the single `pageMetadata(path)` builder.
  It **throws at build time** on an unknown path, so a typo can no longer fall back to
  root boilerplate — which is exactly how 48 routes came to share one description.
- Root cause of the missing OG images: in the App Router a page-level `openGraph`
  *replaces* the parent's. Pages declaring `openGraph: { title, description }` silently
  dropped the root image.
- **`/public/og/default.jpg`** (1200×630) generated by `scripts/build-og-image.mjs`
  via Playwright, so the card's source is markup in the repo.
- `/landing` and `/book-site-visit` were `'use client'` page files, which cannot export
  `metadata`; both split into the server-page + client-component pattern.

### Phase 3 — Structured data
- **`components/seo/JsonLd.tsx`** + **`components/seo/schema.js`**, all values from `facts.ts`.
- `LocalBusiness` in the root layout; `FAQPage` generated from the **same 31-question
  array** the accordion renders; `Service` on `/installation`; `BreadcrumbList` on `/brands/*`.
- The old hand-written homepage `FAQPage` claimed service across "Delhi NCR, Mumbai,
  Bangalore…" and named Heatmiser, Salus, EPH and Nuheat — four brands not in
  `brandsData.js`. Gone.
- Five `Product` blocks had `offers` with `priceCurrency` but **no `price`**, which
  Google rejects. Converted to `Service` with no `offers`.
- Four pages declared a second `LocalBusiness` with no `@id` — rival entities at the
  same address. Consolidated to one `@id`.
- `AggregateRating` (4.8, 50 reviews) removed from `/landing`; "Rated 4.9/5 by
  homeowners" removed from the homepage hero. **Both on the owner's instruction.**

### Phase 4 — Crawlability
- `app/robots.js` replaces `public/robots.txt` (deleted — a static file shadows the
  route). Removed the `Disallow` on the CTA destination, the `Disallow` on a URL the
  sitemap simultaneously submitted, and `Crawl-delay`. Fixed `Disallow: /admin/`,
  which never matched `/admin`.
- `app/sitemap.js` rewritten as **derived** — area and brand entries generate from the
  same constants the routes use, and it **throws** if a URL lacks a metadata entry.
  `lastModified` now comes from `git log` per source path instead of `new Date()`.
- `/SpaceVerification` → **`/book-site-visit`**, 308 registered, 52 pages updated.
- Footer restored to nine routes that had none, including `/product`, `/installation`,
  `/contact` and all six `/brands/*`. `/experience` keeps its exclusion — it ships its
  own footer.
- The footer previously contained **one** internal link. It now carries a four-column
  sitemap, which is what closed the orphan problem.

### Phase 5 — Performance
- `react-world-flags` removed; dependency dropped from `package.json`.
- GSAP + ScrollTrigger + Lenis moved to `await import()` inside the effect. They were
  in every route's bundle — including mobile, where `SmoothScroll` then *disables*
  Lenis below 768px. Kashmir mobile visitors downloaded the stack and had it switched off.
- Two below-fold GSAP timelines code-split (`ThermostatDial`, `WhyElectricHamam`).
- 61 Unsplash URLs → 45 local WebP files. `formats: ['image/avif','image/webp']` added.
- `/landing` loaded three font families via a render-blocking runtime
  `@import url('https://fonts.googleapis.com/…')`. Converted to `next/font`.
- `priority` removed from the header logo, which competed with every page's LCP. The
  homepage hero is now the only preloaded image.

---

## Requires human input

Nothing below has been changed. Each needs a decision or information only you have.

### 1. Two install figures cannot be corroborated
`facts.installationsLocal` = **550,000** and `facts.installationsWorldwide` =
**2,000,000**, both owner-supplied on 2026-08-09 and flagged inline in
`content/facts.ts`. Nothing in this repository supports either. For context, the area
pages tell visitors "hundreds of systems across the valley", and `brandsData.js`
credits Warmup alone with 2.5 million systems worldwide. If a competitor or a
journalist checks one number on this site, it will be this one.

### 2. `noindex` decisions still open
| Route | Situation |
|---|---|
| `/hero` | Legacy WebGL demo duplicating the homepage. Unlinked and removed from the sitemap, but still indexable. |
| `/landing` | Second landing page duplicating the homepage. Same state. |
| `/admin` | Internal dashboard. Now `Disallow`ed in robots, but has no `noindex`, so it can still be indexed if linked externally. |

### 3. `geo` coordinates for `LocalBusiness`
Deliberately absent. The old block pointed at 34.0836 / 74.7973 — Lal Chowk, roughly
3 km from the Rajbagh showroom. A wrong pin is worse than none: it is the coordinate
Google uses for "near me" distance. Right-click the showroom door in Google Maps, copy
the lat/long, add `geo: { latitude, longitude }` to `content/facts.ts`. The builder
emits the block automatically once it exists.

### 4. The footer links to a Facebook page you did not confirm exists
Facebook and LinkedIn are out of `sameAs`, but `app/components/footer.jsx` still
renders a Facebook icon linking to `facebook.com/theheatingstore` on every route where
the footer appears. Either the page exists and belongs back in `sameAs`, or the link
should be removed.

### 5. Real photography — the largest remaining content gap
**51 stock photographs** across the site. The worst concentrations:

| Location | Count | Note |
|---|---:|---|
| `components/sections/About/data.js` | 11 | Includes the "Srinagar, 2011, four engineers" origin gallery |
| `app/book-site-visit/BookSiteVisitClient.jsx` | 6 | Room and floor pickers |
| `app/installation/InstallationClient.jsx` | **5** | **All five install steps, one used twice** |
| `components/sections/WhyChooseUs/data.js` | 5 | See below |

`/installation` is the page whose entire argument is "we do this work", and every
image on it is stock. "Concrete Screed" and "Final Layer" are the *same file*.

Writing honest `alt` text for `/why-choose-us` exposed worse:

| Caption | What the photograph actually shows |
|---|---|
| Free consultation | A retail shop counter with a card reader |
| Service support that answers | An empty warehouse aisle |
| Price match promise | A concrete slab covered in reinforcing bar |
| Lifetime warranty options | A hand signing a document |

The `alt` text now describes what is in frame rather than what the caption wishes were
in frame, because alt text that lies is worse than none. The mismatch is documented in
`WhyChooseUs/data.js` under a `NEEDS REAL PHOTOGRAPHY` header.

### 6. Twenty-four brand product images 404
`app/lib/brandsData.js` references `/brandimages/products/*.webp`. **That directory
does not exist.** All six brand pages fire 24 failed requests each. `BrandImage`
catches the error and shows brand initials, so it degrades — but the product grids
have never shown a product.

### 7. Two testimonials quote a warranty that no longer matches
`components/sections/WhyUs/data.js:190` and `WhyChooseUs/data.js:180`, both attributed
to *Syed Faizan, Head of Development, Faizan Developments*, say "The 25-year warranty…"
while the site now states a lifetime installation warranty. I did not edit them —
changing an attributed quote falsifies a testimonial. Either the quote is real and the
warranty wording needs rethinking, or the testimonial is not real and should go.

### 8. Google Business Profile
Not addressed by any code change and the single highest-value remaining action for
local ranking. The `LocalBusiness` markup, the address, the hours and the service
areas are now consistent and ready to be matched against a claimed profile.

### 9. Reviews
There are none, anywhere, from any verified source. No `Review` or `AggregateRating`
markup has been added and `scripts/check-schema.mjs` will fail the build if any
appears. Collecting real reviews on a claimed Google Business Profile is the only
route to rating rich results.

---

## Known remaining, lower priority

- **`/areasweserve/*` pages share ~52% of their text.** Fifteen pages from one
  template differing by area name, one paragraph and a directions line. The metadata
  is now genuinely differentiated, but the body copy is not.
- **`/heatingequipmentsupplier/*` pages share ~42%.**
- **`/blog` has no server-rendered posts.** Articles are fetched client-side from an
  external API, so the served HTML has the heading and no articles. `/blog/[slug]` is
  absent from the sitemap for the same reason: there is no build-time list of slugs.
- **Dead code**: `lib/smooth-scroll.js` and `components/sections/WarmthRevealSection.jsx`
  are imported nowhere; `components/sections/WhyUs/*` and `WhyChooseUs/*` are two
  near-identical copies of the same section set.
- **`/images/ll.png`** is a 1536×1024, 538 KB PNG rendered at 220 px wide. `next/image`
  downscales it, but it should be re-exported at the size it is used.
- **18 `NEEDS-REAL-INFO` / `PLACEHOLDER` markers** remain in
  `components/sections/About/data.js` — the origin story, the timeline milestones for
  2015/2019/2023, and the "100% Customers satisfied" figure.

---

## Corrections to the Phase 0 audit

Stated here because the original audit is quoted in the phase reports.

- **`/about` heading hierarchy** — reported as "H2 for Principle 01, H3 for 02 and 03".
  Refuted: `Principles.jsx` renders one H2 and three H3s, and the component is not even
  mounted. `/about` always had one H1 and no skipped levels.
- **`/brands/*` duplication** — suspected heavy. Refuted: ~14% shared, ~86% unique.
  These are the best-differentiated pages on the site.
- **`/product` vs brand pages** — suspected duplication. Refuted: 1–4%.
- **`/AboutSection`** — reported as "builds and renders nothing", recommended for
  deletion. Wrong: it is a working `permanentRedirect('/about')` and should stay.
- **Heat retention** — reported as one outlier. Actually three values across six
  locations; the original regex had a malformed bracket expression.
- **`metadataBase`** — Phase 2 asked for it to be added. It already existed.
