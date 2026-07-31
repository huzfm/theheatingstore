import HomeHero from "./HomeHero";

import WhyElectricHamamShowcase from "@/components/sections/WhyElectricHamam/WhyElectricHamam";
import FaqSection from "./FaqSection";
import ArticlesSection from "./ArticlesSection";
import FloorRevealSection from "../../components/sections/FloorRevealSection";
import WhyChooseUFH from "./WhyChooseUFH";


export default function HomePage() {
  return (
    <>
      <HomeHero />
      {/* Scroll-driven 3D cutaway: floor lifts away, heating mat is revealed,
          then turns through 360° with its feature callouts. Three.js is
          lazy-loaded inside this component, so it costs the hero nothing. */}
      <FloorRevealSection />
      <WhyElectricHamamShowcase />
      {/* <VideoGallery/> */}
      {/* <TrustedBrandsSection /> */}
      {/* <OurProcess /> */}

      <FaqSection />

      <ArticlesSection/>

      <WhyChooseUFH/>
      
      {/* <ContactPage /> */}
    </>
  );
}
