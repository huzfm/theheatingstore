import Hero from "../hero/page";
import OurProcess from "./OurProcess";
import TrustedBrandsSection from "./TrustedBrandsSection";
import WhyElectricHamamShowcase from "@/components/sections/WhyElectricHamam/WhyElectricHamam";
import FaqSection from "./FaqSection";
import ContactPage from "../contact/ContactClient";
import ArticlesSection from "./ArticlesSection";
import VideoGallery from "./VideoGallery";
import WhyElectricHamam from "./WhyElectricHamam";
import MeasuringUpClient from "../measuring-up/MeasuringUpClient";
import WarrantyCheck from "../warranty-check/WarrantyCheckClient";
import FloorRevealSection from "../../components/sections/FloorRevealSection";
import WarmthRevealSection from "../../components/sections/WarmthRevealSection";

export default function HomePage() {
  return (
    <>
      <Hero />
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
      <TrustedBrandsSection />
      <OurProcess />

      <FaqSection />

      <ArticlesSection/>
      <WhyElectricHamam />
      <ContactPage />
    </>
  );
}
