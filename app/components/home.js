import Hero from "../hero/page";
import OurProcess from "./OurProcess";
import TrustedBrandsSection from "./TrustedBrandsSection";
import FiveReasonsSection from "./FiveReasonsSection";
import FaqSection from "./FaqSection";
import ContactPage from "../contact/ContactClient";
import AboutSectionPremium from "../about/AboutClient";
import ArticlesSection from "./ArticlesSection";
import VideoGallery from "./VideoGallery";
import InstallationContent from "../installation/InstallationClient";
import WhyChooseUFH from "./WhyChooseUFH";
import WhyElectricHamam from "./WhyElectricHamam";
import MeasuringUpClient from "../measuring-up/MeasuringUpClient";
import WarrantyCheck from "../warranty-check/WarrantyCheckClient";
import FloorRevealSection from "../../components/sections/FloorRevealSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Scroll-driven 3D cutaway: floor lifts away, heating mat is revealed,
          then turns through 360° with its feature callouts. Three.js is
          lazy-loaded inside this component, so it costs the hero nothing. */}
      <FloorRevealSection />
      <FiveReasonsSection />
      {/* <VideoGallery/> */}
      <TrustedBrandsSection />
      <OurProcess />
      <AboutSectionPremium/>
      
      <InstallationContent/>
      {/* <HowItWorksPage /> */}
      
      
      <FaqSection />

      <ArticlesSection/>
      <WhyElectricHamam />
      <ContactPage />
      <WhyChooseUFH/>


    </>
  );
}
