// export const metadata = {
//   title: "Electric Hamam Installation | Premium Underfloor Heating Systems in India",
//   description:
//     "Expert electric hamam and underfloor heating installation across India. Professional installation of imported heating systems with Kashmir installation warranty. Serving homes, villas, hotels, and luxury spas.",
//   keywords: [
//     "electric hamam installation India",
//     "underfloor heating",
//     "premium floor heating systems",
//     "luxury steam bath installation",
//     "hamam systems India",
//     "warm floor installation",
//   ],
//   openGraph: {
//     title: "Electric Hamam Installation | Premium Underfloor Heating Systems in India",
//     description:
//       "Expert electric hamam and underfloor heating installation across India with Kashmir installation warranty.",
//     type: "website",
//     images: ["/images/electric.png"],
//   },
// };

// app/page.jsx, top of file, before the component
import { pageMetadata } from "@/app/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { faqPage } from "@/components/seo/schema";
import { ALL_FAQS } from "@/content/faqs";

export const metadata = pageMetadata("/");

/**
 * FAQPage, generated from content/faqs.js, the same array the accordion
 * below renders. All 31 questions, not a separate hand-written six.
 *
 * The LocalBusiness block that used to sit here is gone: it duplicated the
 * one in the root layout under the same @id, and the two disagreed. This one
 * put the showroom at Lal Chowk 190001; every area page put it at Rajbagh
 * 190008. There is now exactly one LocalBusiness on the site.
 */
const faqSchema = faqPage(ALL_FAQS);

import HomePage from "./components/home";

export default function Home() {
  return (
    <>
      <JsonLd id="ld-faq" data={faqSchema} />
      <HomePage />
    </>
  );
}
