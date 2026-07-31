import HomeHero from "./HomeHero";

import WhyElectricHamamShowcase from "@/components/sections/WhyElectricHamam/WhyElectricHamam";
import FaqSection from "./FaqSection";
import HeatingMatViewerSection from "../../components/sections/HeatingMatViewerSection";


export default function HomePage() {
  return (
    <>
      <HomeHero />
      {/* The mat as a product you can turn. Three.js is lazy-loaded and the
          render loop only runs while the panel is on screen. */}
      <HeatingMatViewerSection />
      <WhyElectricHamamShowcase />
      {/* <VideoGallery/> */}
      {/* <TrustedBrandsSection /> */}
      {/* <OurProcess /> */}

      <FaqSection />

      {/* The Journal now lives on its own route, /journal. */}

      {/* <ContactPage /> */}
    </>
  );
}
