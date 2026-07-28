import HomeHero from "./HomeHero";

import WhyElectricHamamShowcase from "@/components/sections/WhyElectricHamam/WhyElectricHamam";
import FaqSection from "./FaqSection";
import ArticlesSection from "./ArticlesSection";
import FloorRevealSection from "../../components/sections/FloorRevealSection";
import WarmthRevealSection from "../../components/sections/WarmthRevealSection";


export default function HomePage() {
  return (
    <>
      <HomeHero />
      {/* Scroll-driven 3D cutaway: floor lifts away, heating mat is revealed,
          then turns through 360° with its feature callouts. Three.js is
          lazy-loaded inside this component, so it costs the hero nothing. */}
      <FloorRevealSection />
      {/* Scroll-linked colour-flow statement: the copy starts white and a
          wave of colour (green → orange) moves through it word by word as the
          section scrolls past. */}
      <WarmthRevealSection />
      <WhyElectricHamamShowcase />
      {/* <VideoGallery/> */}
      {/* <TrustedBrandsSection /> */}
      {/* <OurProcess /> */}

      <FaqSection />

      <ArticlesSection/>
      
      {/* <ContactPage /> */}
    </>
  );
}
