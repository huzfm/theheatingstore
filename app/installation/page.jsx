import { pageMetadata } from '@/app/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { installationService } from '@/components/seo/schema';
import InstallationClient from './InstallationClient';

export const metadata = pageMetadata('/installation');

/**
 * Service markup for the thing this page describes.
 *
 * `provider` is a reference to the LocalBusiness @id emitted by the root
 * layout rather than a second copy of the company, so both blocks resolve to
 * one entity instead of competing.
 */
const serviceSchema = installationService();

export default function InstallationPage() {
  return (
    <>
      <JsonLd id="ld-service" data={serviceSchema} />
      <InstallationClient />
    </>
  );
}
