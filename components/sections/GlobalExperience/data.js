/**
 * Content for /global-experience, "the standards we import".
 *
 * Lane: this page is about everything that arrives here from outside — the
 * countries these systems are proven in, the manufacturers behind them, and
 * the documentation that comes with them. Its sibling /local-experience covers
 * what we do on the ground here. The physics is /working, the process is
 * /how-it-works, the build is /installation.
 *
 * The five-step "Our Installation Process" the previous version carried is
 * deliberately gone: it was the same five stages /how-it-works exists to
 * explain, told worse and in less detail. The page links there instead.
 *
 * Figures are carried from the previous version of this page and agree with
 * the ones used elsewhere on the site (2M+ installations and the 0.01% rate
 * also appear in the Why Choose Us copy).
 */

export const HERO = {
  eyebrow: 'Global experience · Standards we import',
  // RevealText animates word-by-word, so this must stay a plain string.
  headline: 'Proven in eight winters colder than ours.',
  sub: 'The systems we install here are not designed here. They come from the countries that have been heating floors through hard winters for decades, and they arrive with the certification and the paperwork to prove it.',
  /* 1736x906. The previous version of this page used /images/floor1.jpg here,
     which is a 330x330 thumbnail, stretched across a full-bleed 100svh hero it
     was upscaled roughly five times and read as a blur. Every other candidate
     in public/ was checked for pixel size before this one was picked. */
  bgImage: '/images/y.png',
  facts: [
    { value: '2M+', label: 'Installations worldwide' },
    { value: '500K+', label: 'Across Kashmir and India' },
    { value: '0.01%', label: 'Fault rate across those systems' },
  ],
};

/**
 * The narrative beat, same shape as About's ORIGIN so OriginStory's layout can
 * be mirrored. Absorbs what the old "Technology Behind Our Kashmir Systems"
 * section carried, as prose rather than a tick-list.
 */
export const STORY = {
  eyebrow: 'What that actually buys you',
  title: 'Certification is not a sticker.',
  paragraphs: [
    'A heating cable spends its whole life buried in screed, under a floor nobody intends to lift again. There is no servicing it, no inspecting it, and no second chance at the insulation. Everything that decides whether it lasts twenty-five years is decided before it goes in.',
    'That is what the international standards are for. Fluoropolymer cable construction, multi-layer conductive cores, waterproof insulation, and IEC compliance are not marketing lines, they are the specific reasons a cable survives a screed pour, a wet bathroom, and three decades of thermal cycling.',
    'We import to those standards rather than to a price, because the failure mode here is not an inconvenience. It is a floor coming up.',
  ],
  image: '/images/floor2.webp',
  imageAlt: 'Electric heating cable beneath a floor build-up',
};

/**
 * Countries these systems are installed and proven in. `code` is an ISO 3166-1
 * alpha-2 for react-world-flags, which is already a dependency.
 */
export const COUNTRIES = {
  eyebrow: 'Where these systems run',
  title: 'Eight countries, mostly colder than here.',
  intro:
    'Northern Europe has been solving this problem for longer than we have. The systems we carry are the ones that hold up there.',
  list: [
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Turkey', code: 'TR' },
    { name: 'UAE', code: 'AE' },
    { name: 'Bhutan', code: 'BT' },
  ],
};

/** The building types these systems go into. */
export const PROJECTS = {
  eyebrow: 'What we heat',
  title: 'Six kinds of floor, one system.',
  list: [
    {
      label: 'Mosques & Religious Buildings',
      image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1200&q=80',
      desc: 'Gentle radiant warmth across Kashmiri prayer halls, designed for winter prayers and power-cut resilience.',
      featured: true,
    },
    {
      label: 'Residential Homes',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      desc: 'Warm, energy-efficient heating for every room in a family home.',
    },
    {
      label: 'Villas',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      desc: 'Premium underfloor systems tailored to high-end villa interiors.',
    },
    {
      label: 'Hotels & Resorts',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      desc: 'Consistent, silent comfort across lobbies, suites and spa areas.',
    },
    {
      label: 'Commercial Offices',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      desc: 'Zone-controlled heating that keeps workspaces usable year-round.',
    },
    {
      label: 'Renovation Projects',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',
      desc: 'Ultra-thin mat systems that retrofit into an existing floor.',
    },
  ],
};

/**
 * Manufacturer documentation. This is the page's most genuinely useful
 * content and the previous version buried it in a brand grid.
 *
 * `logo` is optional on purpose: Danfoss has a PDF but no logo file in
 * public/brandimages, and the old page pointed at /brandimages/danfoss.webp
 * regardless, which rendered a broken image. DocumentLibrary falls back to a
 * wordmark set in the display face when `logo` is absent.
 */
export const DOCS = {
  eyebrow: 'Documentation',
  title: 'Every manual, straight from the manufacturer.',
  intro:
    'The same documents our installers work from. No sign-up, no email capture, just the PDFs.',
  list: [
    {
      name: 'ProWarm',
      logo: '/brandimages/prowarm.webp',
      pdf: '/PDFs/prowarm.pdf',
      docTitle: 'Installation Brochure',
      docType: 'Brochure',
      pages: '24 pages',
    },
    {
      name: 'Warmup',
      logo: '/brandimages/warmup.webp',
      pdf: '/PDFs/Warmup-OM-Tempo-V1.3.pdf',
      docTitle: 'Tempo Owner Manual',
      docType: 'Manual',
      pages: '32 pages',
    },
    {
      name: 'Danfoss',
      logo: null,
      pdf: '/PDFs/Danfoss.pdf',
      docTitle: 'Hydronic Floor Heating Guide',
      docType: 'Handbook',
      pages: '12 pages',
    },
    {
      name: 'ThermoSphere',
      logo: '/brandimages/thermosphere.webp',
      // Filename contains a space; the href is encoded at render.
      pdf: '/PDFs/ThermoSphere Ultimate_Instructions.pdf',
      docTitle: 'Ultimate Cable Instructions',
      docType: 'Instructions',
      pages: '31 pages',
    },
    {
      name: 'FastWarm',
      logo: '/brandimages/fastwarm.webp',
      pdf: '/PDFs/fastwarm.pdf',
      docTitle: 'Mat System Manual',
      docType: 'Manual',
      pages: '15 pages',
    },
    {
      name: 'AmberHeat',
      logo: '/brandimages/amberheat.webp',
      pdf: '/PDFs/Amber-Installation-Guide.pdf',
      docTitle: 'AmberMat Installation Guide',
      docType: 'Guide',
      pages: '12 pages',
    },
    {
      name: 'nVent',
      logo: '/brandimages/nvent.png',
      pdf: '/PDFs/nvent.pdf',
      docTitle: 'nVent Installation Guide',
      docType: 'Guide',
      pages: '12 pages',
    },
  ],
};

export const CTA = {
  eyebrow: 'Next step',
  title: 'Have it specified for your own floor.',
  sub: 'A free site visit turns the standards on this page into a layout, a wattage and a written price for your actual rooms.',
};
