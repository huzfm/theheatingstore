import { pageMetadata } from '@/app/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { service } from '@/components/seo/schema';
export const metadata = pageMetadata("/heatingequipmentsupplier/radiantfloorheating");

import RadiantFloorHeatingClient from './RadiantFloorHeatingClient';

const jsonLd = service({
  name: "Radiant Floor Heating Installation",
  description:
    "Supply and installation of radiant floor heating for Kashmir homes, hotels and commercial buildings. UK-imported systems sealed in screed.",
});

export default function RadiantFloorHeatingPage() {
  return (
    <>
      <JsonLd id="ld-service" data={jsonLd} />
      <RadiantFloorHeatingClient />
    </>
  );
}
