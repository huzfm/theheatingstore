'use client';

import WhyUsHero from '@/components/sections/WhyUs/WhyUsHero';
import ChapterNav from '@/components/sections/WhyUs/ChapterNav';
import ProofStats from '@/components/sections/WhyUs/ProofStats';
import Guarantees from '@/components/sections/WhyUs/Guarantees';
import Testimonials from '@/components/sections/WhyUs/Testimonials';
import StoryBeat from '@/components/sections/WhyUs/StoryBeat';
import CoverageIndex from '@/components/sections/WhyUs/CoverageIndex';
import BrandWall from '@/components/sections/WhyUs/BrandWall';
import CountryIndex from '@/components/sections/WhyUs/CountryIndex';
import DocumentLibrary from '@/components/sections/WhyUs/DocumentLibrary';
import CertificationMarquee from '@/components/sections/WhyUs/CertificationMarquee';
import WhyUsCTA from '@/components/sections/WhyUs/WhyUsCTA';
import { LOCAL_STORY, GLOBAL_STORY } from '@/components/sections/WhyUs/data';

/**
 * /why-choose-us — the merge of three routes into one.
 *
 * /why-choose-us, /local-experience and /global-experience were all answering
 * "why buy this from you", split three ways. Each was too thin to rank on its
 * own and none of them made the whole argument, so a visitor who read one got a
 * third of the case. The other two URLs now 301 here (next.config.mjs), into
 * the #local and #global anchors respectively.
 *
 * The page is one argument in three movements, and the order is the argument:
 *
 *   The claim      hero, then the four figures, unqualified
 *   01 The promise what we owe you when it fails, then the trade corroborating
 *                  it — the guarantees come before the testimonials that vouch
 *                  for them, not after
 *   02 Here        why a Kashmir winter is a different brief, the towns we
 *                  reach, the brands we can service
 *   03 Elsewhere   why certification decides a buried cable's life, the nine
 *                  countries, the manuals
 *   The ask        certifications strip, one CTA
 *
 * Eleven sections down from the three routes' combined sixteen. What went, and
 * why, is documented at the top of components/sections/WhyUs/data.js — the
 * short version is two heroes, two CTAs, and eleven Unsplash stock photographs
 * that were carrying no argument.
 */
export default function WhyChooseUsClient() {
  return (
    <main className="bg-ink-950">
      <WhyUsHero />
      <ChapterNav />

      {/* The claim */}
      <ProofStats />

      {/* 01 — what we promise */}
      <Guarantees />
      <Testimonials />

      {/* 02 — here */}
      <StoryBeat story={LOCAL_STORY} />
      <CoverageIndex />
      <BrandWall />

      {/* 03 — elsewhere */}
      <StoryBeat story={GLOBAL_STORY} />
      <CountryIndex />
      <DocumentLibrary />

      {/* The ask */}
      <CertificationMarquee />
      <WhyUsCTA />
    </main>
  );
}
