/**
 * Approved per-route metadata strings.
 *
 * Every title, description and twitter description on this site lives here and
 * nowhere else. Page files call pageMetadata(path) from app/lib/seo.js, which
 * reads this map and assembles the canonical, Open Graph and Twitter blocks
 * around it.
 *
 * Why one file rather than a metadata object per page:
 *
 *  - Before this, 48 of 55 routes emitted an IDENTICAL twitter:description,
 *    inherited from the root layout, because in the App Router a page that
 *    declares openGraph without declaring twitter silently keeps the parent's.
 *    Centralising makes that class of accident visible: a missing entry here
 *    throws at build time instead of quietly serving site-wide boilerplate.
 *  - Titles and descriptions are held to hard limits (title <= 60 characters,
 *    description 140-160) enforced by scripts/check-metadata.mjs. Policing
 *    that across 46 scattered metadata objects is not realistic.
 *
 * Every commercial route carries "Electric Hamam" in its title or description.
 * Where the head term is a different product (underfloor heating, radiant
 * floor heating), the phrase sits in the description so the title keeps the
 * term the page actually competes for.
 *
 * Strings approved by the site owner on 2026-08-09.
 */

export type PageMeta = {
  /** Rendered verbatim as <title>. Max 60 characters. */
  readonly title: string;
  /** Rendered as <meta name="description">. 140-160 characters. */
  readonly description: string;
  /** Rendered as <meta name="twitter:description">. Must be unique site-wide. */
  readonly twitter: string;
};

export const PAGE_META: Readonly<Record<string, PageMeta>> = Object.freeze({
  "/book-site-visit": {
    title: "Book a Free Electric Hamam Site Visit, Kashmir",
    description: "Tell us about the space and an engineer visits, measures the rooms, checks the floor build-up and the supply, and leaves you with a written quotation.",
    twitter: "An engineer measures the rooms and leaves you with a written quotation.",
  },
  "/": {
    title: "Electric Hamam Installation in Srinagar, Kashmir",
    description: "Electric hamam and underfloor heating installed across Kashmir by the team that surveys your floor. Free site visit, UK systems, lifetime warranty.",
    twitter: "Kashmir’s electric hamam specialists. Free site survey, UK-imported systems, lifetime warranty on every install.",
  },
  "/about": {
    title: "About Us | Electric Hamam Engineers in Srinagar",
    description: "Heating engineers in Srinagar since 2011, installing electric hamam and underfloor heating built for sub-zero Kashmir winters and daily power cuts.",
    twitter: "Engineers, not resellers. Building floors for the Kashmir winter since 2011.",
  },
  "/product": {
    title: "Electric Hamam Products & Brands in Kashmir",
    description: "The six underfloor heating brands we stock and support, with a walkthrough of a real Kashmir electric hamam install from groundwork to commissioning.",
    twitter: "Six underfloor heating brands, and a walkthrough of a real Kashmir install.",
  },
  "/installation": {
    title: "Electric Hamam Installation, Step by Step",
    description: "How we install an electric hamam in Kashmir: insulation, screed, cable layout, thermostat commissioning and the lifetime warranty you are left with.",
    twitter: "Five stages, from subfloor prep to commissioning. What a real install looks like.",
  },
  "/contact": {
    title: "Contact Us | Free Electric Hamam Survey, Kashmir",
    description: "Call, WhatsApp or email the team that does the installing. Free electric hamam site survey across Kashmir, Jammu and Ladakh, or visit our Srinagar showroom.",
    twitter: "Talk to the people who do the install. Free survey across Kashmir, Jammu and Ladakh.",
  },
  "/why-choose-us": {
    title: "Why Choose Us | Electric Hamam Kashmir, Since 2011",
    description: "A 0.01% fault rate, 10-25 year manufacturer cover and a lifetime installation warranty. Our Srinagar team, the towns we cover and the standards we work to.",
    twitter: "The Srinagar team, the brands we carry, and the standards every install is held to.",
  },
  "/how-it-works": {
    title: "Electric Hamam Process | Survey to Handover",
    description: "What actually happens when you install an electric hamam in Kashmir: the free site visit, the heat design and quote, the install, curing and commissioning.",
    twitter: "From first phone call to a warm floor. Every stage, and what you have to do.",
  },
  "/working": {
    title: "How Electric Hamam Underfloor Heating Works",
    description: "The physics of an electric hamam: radiant heat instead of blown air, the floor layers from carpet down to insulation, and what it costs to run in Kashmir.",
    twitter: "Radiant heat, not blown air. The floor layers, the thermostat, the running cost.",
  },
  "/certifications": {
    title: "Electric Hamam Certifications | CE, IEC, ISO",
    description: "Every standard our electric hamam and underfloor heating systems are certified to: CE and UKCA marks, IEC 60335 safety, ISO 9001 and BS 7671 installation.",
    twitter: "CE, UKCA, IEC 60335, ISO 9001, BS 7671. What each mark actually governs.",
  },
  "/measuring-up": {
    title: "Measure Up for an Electric Hamam | Calculator",
    description: "Work out how much of your floor can actually be heated. Measure the room, deduct fixed fittings, apply the perimeter allowance, and get your quote figure.",
    twitter: "The heatable-area calculator every underfloor heating quote is built from.",
  },
  "/journal": {
    title: "The Journal | Warmth, Interiors & Electric Hamam",
    description: "Studies on how invisible heating shapes the way a home feels, from Kashmir’s coldest winters to its quietest interiors. Comparisons, climate notes, guides.",
    twitter: "Writing on warmth, comfort and the architecture of a Kashmiri winter home.",
  },
  "/blog": {
    title: "Electric Hamam Blog | Underfloor Heating Guides",
    description: "Guides on electric hamam installation, underfloor heating running costs, floor build-ups and choosing a system that survives a Kashmir winter and power cuts.",
    twitter: "Guides on installation, running cost and choosing a system for Kashmir.",
  },
  "/bloginfo": {
    title: "Electric Hamam Features & Technology, Kashmir",
    description: "The technology behind our electric hamam systems: smart thermostats, the layered screed method for heat retention, safety sensors and install innovations.",
    twitter: "Smart thermostats, the layered screed method, safety sensors and site process.",
  },
  "/areasweserve": {
    title: "Electric Hamam Across Srinagar | Areas We Serve",
    description: "We supply and install electric hamam and underfloor heating across Srinagar, from Rajbagh and Lal Chowk to Bemina, Hyderpora, Nishat and Pantha Chowk.",
    twitter: "Fifteen Srinagar neighbourhoods, all covered by our Rajbagh-based install team.",
  },
  "/heatingequipmentsupplier": {
    title: "Heating Equipment Supplier in Srinagar, Kashmir",
    description: "Electric hamam, underfloor heating and radiant floor systems supplied and installed across Kashmir. UK-imported, certified, fitted by our Srinagar team.",
    twitter: "Electric hamam, underfloor and radiant heating, supplied and fitted in Kashmir.",
  },
  "/heatingequipmentsupplier/electrichamam": {
    title: "Electric Hamam Supplier in Srinagar, Kashmir",
    description: "Premium UK-imported electric hamam systems, certified safe for wet areas and engineered for sub-zero Kashmir floors. Supplied and installed from Srinagar.",
    twitter: "UK-imported electric hamam systems, wet-area certified, fitted across Kashmir.",
  },
  "/heatingequipmentsupplier/electricfloorheating": {
    title: "Electric Floor Heating Supplier in Srinagar",
    description: "UK-imported electric floor heating and electric hamam systems for Kashmir homes, laid on insulated subfloor and sealed in screed. No radiators, no fans.",
    twitter: "Electric floor heating laid in screed, engineered for sub-zero Kashmir floors.",
  },
  "/heatingequipmentsupplier/heatingsystems": {
    title: "Heating Systems Supplier in Srinagar, Kashmir",
    description: "UK-imported heating systems and electric hamam installations for Kashmir homes, hotels and commercial spaces, certified to CE and IEC 60335 standards.",
    twitter: "UK-imported heating systems for homes, hotels and commercial buildings.",
  },
  "/heatingequipmentsupplier/underfloorheating": {
    title: "Underfloor Heating in Srinagar & Kashmir",
    description: "Underfloor heating and electric hamam cables sealed in screed, engineered for Kashmir winters. Silent radiant warmth, installed by our Srinagar team.",
    twitter: "Cables and mats sealed in screed. Radiant warmth with nothing on the walls.",
  },
  "/heatingequipmentsupplier/radiantfloorheating": {
    title: "Radiant Floor Heating in Srinagar, Kashmir",
    description: "Radiant floor heating and electric hamam systems for Kashmir homes and hotels. The screed acts as thermal mass, giving even warmth with nothing to service.",
    twitter: "Thermal mass in the screed, radiant warmth above it, nothing to service.",
  },
  "/heatingequipmentsupplier/homeheatingsolutions": {
    title: "Home Heating Solutions in Srinagar, Kashmir",
    description: "Electric hamam and underfloor heating for Kashmir homes, villas and apartments. Designed around your layout, installed by our Srinagar team, free survey.",
    twitter: "Heating designed around your home’s layout, surveyed and fitted from Srinagar.",
  },
  "/heatingequipmentsupplier/commercialheatingsystems": {
    title: "Commercial Heating Systems in Kashmir",
    description: "Electric hamam and underfloor heating for Kashmir hotels, guest houses, offices and schools. In-house team, written timeline, single point of contact.",
    twitter: "Heating for hotels, guest houses, offices and schools across the valley.",
  },
  "/dealer": {
    title: "Become a Dealer | Electric Hamam, Kashmir & India",
    description: "Join The Heating Store dealer network. Authorised dealer programme for electric hamam and underfloor heating systems across Kashmir and the rest of India.",
    twitter: "Authorised dealer programme for electric hamam and underfloor heating systems.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | The Heating Store",
    description: "How The Heating Store collects, uses and protects your data. Meta Pixel disclosure, cookies, and your rights under Indian data protection law.",
    twitter: "How we handle your data, Meta Pixel disclosure, and your rights.",
  },
  "/warranty-check": {
    title: "Check Your Electric Hamam Warranty | Kashmir",
    description: "Verify your electric hamam or underfloor heating warranty. Enter your product details to check validity, coverage terms and whether a claim is eligible.",
    twitter: "Check your electric hamam warranty status, coverage terms and claim eligibility.",
  },
  "/experience": {
    title: "The Experience | Electric Hamam, Engineered",
    description: "An interactive look beneath a Kashmiri floor: the layers of an electric hamam, how the heat moves through screed, and what the install actually involves.",
    twitter: "Look beneath the floor. The layers, the heat, and how an install goes together.",
  },
  "/areasweserve/rajbagh": {
    title: "Electric Hamam in Rajbagh, Srinagar",
    description: "Electric hamam and underfloor heating in Rajbagh, Srinagar. Our showroom is here. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Rajbagh, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/jawaharnagar": {
    title: "Electric Hamam in Jawahar Nagar, Srinagar",
    description: "Electric hamam and underfloor heating in Jawahar Nagar, Srinagar. Minutes from us. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Jawahar Nagar, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/lalchowk": {
    title: "Electric Hamam in Lal Chowk, Srinagar",
    description: "Electric hamam and underfloor heating in Lal Chowk, Srinagar. Heritage homes included. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Lal Chowk, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/sonwar": {
    title: "Electric Hamam in Sonwar, Srinagar",
    description: "Electric hamam and underfloor heating in Sonwar, Srinagar. Coldest wind in the city. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Sonwar, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/gogjibagh": {
    title: "Electric Hamam in Gogji Bagh, Srinagar",
    description: "Electric hamam and underfloor heating in Gogji Bagh, Srinagar. Quiet residential lanes. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Gogji Bagh, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/dalgate": {
    title: "Electric Hamam in Dalgate, Srinagar",
    description: "Electric hamam and underfloor heating in Dalgate, Srinagar. Lake damp, certified safe. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Dalgate, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/bemina": {
    title: "Electric Hamam in Bemina, Srinagar",
    description: "Electric hamam and underfloor heating in Bemina, Srinagar. We know its concrete floors. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Bemina, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/hyderpora": {
    title: "Electric Hamam in Hyderpora, Srinagar",
    description: "Electric hamam and underfloor heating in Hyderpora, Srinagar. Flats, villas and shops. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Hyderpora, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/sanatnagar": {
    title: "Electric Hamam in Sanat Nagar, Srinagar",
    description: "Electric hamam and underfloor heating in Sanat Nagar, Srinagar. Airport-side colony. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Sanat Nagar, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/chanapora": {
    title: "Electric Hamam in Chanapora, Srinagar",
    description: "Electric hamam and underfloor heating in Chanapora, Srinagar. Fast-growing area. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Chanapora, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/rawalpora": {
    title: "Electric Hamam in Rawalpora, Srinagar",
    description: "Electric hamam and underfloor heating in Rawalpora, Srinagar. Colony and roads around it. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Rawalpora, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/nowgam": {
    title: "Electric Hamam in Nowgam, Srinagar",
    description: "Electric hamam and underfloor heating in Nowgam, Srinagar. Outskirts and bypass. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Nowgam, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/nishat": {
    title: "Electric Hamam in Nishat, Srinagar",
    description: "Electric hamam and underfloor heating in Nishat, Srinagar. Lakeside damp and cold. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Nishat, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/hazratbal": {
    title: "Electric Hamam in Hazratbal, Srinagar",
    description: "Electric hamam and underfloor heating in Hazratbal, Srinagar. Homes near the shrine. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Hazratbal, Srinagar. Free survey, UK-imported systems.",
  },
  "/areasweserve/panthachowk": {
    title: "Electric Hamam in Pantha Chowk, Srinagar",
    description: "Electric hamam and underfloor heating in Pantha Chowk, Srinagar. The southern approach. UK-imported, wet-area certified, lifetime warranty. Free site survey.",
    twitter: "Electric hamam installation in Pantha Chowk, Srinagar. Free survey, UK-imported systems.",
  },
  "/brands/prowarm": {
    title: "ProWarm Underfloor Heating | The Heating Store",
    description: "ProWarm is the UK's best-selling electric underfloor heating brand, CE certified. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "ProWarm underfloor heating, supplied and installed across Kashmir.",
  },
  "/brands/warmup": {
    title: "Warmup Underfloor Heating | The Heating Store",
    description: "Warmup is the world's best-selling floor heating brand, ISO 9001 certified. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "Warmup underfloor heating, supplied and installed across Kashmir.",
  },
  "/brands/thermosphere": {
    title: "ThermoSphere Underfloor Heating | The Heating Store",
    description: "ThermoSphere is British-made, with TwistedTwin cable and an IP68 rating. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "ThermoSphere underfloor heating, supplied and installed across Kashmir.",
  },
  "/brands/amberheat": {
    title: "AmberHeat Underfloor Heating | The Heating Store",
    description: "AmberHeat is engineered for Himalayan winters and rated down to -30°C. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "AmberHeat underfloor heating, supplied and installed across Kashmir.",
  },
  "/brands/fastwarm": {
    title: "FastWarm Underfloor Heating | The Heating Store",
    description: "FastWarm is a complete one-box heating kit built to IEC and CE standards. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "FastWarm underfloor heating, supplied and installed across Kashmir.",
  },
  "/brands/nvent": {
    title: "nVent Underfloor Heating | The Heating Store",
    description: "nVent is the global leader in self-regulating heating cable, IEC certified. Supplied and installed across Kashmir as part of our electric hamam range.",
    twitter: "nVent underfloor heating, supplied and installed across Kashmir.",
  },
});

export default PAGE_META;
