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

export default function HomePage() {
  return (
    <>
      <Hero />
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
