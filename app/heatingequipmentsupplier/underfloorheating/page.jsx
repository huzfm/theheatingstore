import { pageMetadata } from '@/app/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { service } from '@/components/seo/schema';
export const metadata = pageMetadata("/heatingequipmentsupplier/underfloorheating");

import UnderfloorHeatingClient from './UnderfloorHeatingClient';

const jsonLd = service({
  name: "Underfloor Heating Installation",
  description:
    "Supply and installation of underfloor heating cables and mats sealed in screed, engineered for Kashmir winters and frequent power cuts.",
});

export default function UnderfloorHeatingPage() {
  return (
    <>
      <JsonLd id="ld-service" data={jsonLd} />
      <UnderfloorHeatingClient />
    </>
  );
}
