/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  /**
   * /local-experience and /global-experience were merged into /why-choose-us.
   * All three were answering "why buy this from you" and splitting the answer
   * three ways, so none of them made the whole case and none had the weight to
   * rank. Permanent (308) so whatever authority the two had consolidates onto
   * the surviving URL instead of dying with them.
   *
   * They land on the anchors of the movements they used to be, not at the top
   * of the page, so an inbound link about our Kashmir coverage still arrives at
   * the Kashmir coverage.
   */
  async redirects() {
    return [
      {
        source: '/local-experience',
        destination: '/why-choose-us#local',
        permanent: true,
      },
      {
        source: '/global-experience',
        destination: '/why-choose-us#global',
        permanent: true,
      },

      /**
       * /SpaceVerification became /book-site-visit.
       *
       * The old path was CamelCase (case-sensitive on most hosts, and it reads
       * as a filename), it named the internal process rather than what the
       * visitor gets, and it was Disallowed in robots.txt while being the
       * target of the site-wide secondary CTA on roughly fifteen pages.
       *
       * Permanent so the inbound links and whatever authority the old URL
       * accumulated consolidate onto the new one.
       */
      {
        source: '/SpaceVerification',
        destination: '/book-site-visit',
        permanent: true,
      },
    ];
  },
  // Tree-shake large libraries so only the icons/components actually used ship to the client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  images: {
    /**
     * images.unsplash.com and picsum.photos were removed.
     *
     * The site was serving 61 photographs from Unsplash, including the
     * homepage's Open Graph card. Every one of them was a request to a third
     * party on the critical path, from a country where that adds latency, and
     * an availability dependency nobody here controls: if Unsplash reorganises
     * a photo ID, the page loses its image. One of the 61 had ALREADY died
     * (photo-1545259742-f4f55c610ee1 now 404s), which is exactly the failure
     * mode. All of them are now WebP files in /public/images/stock.
     *
     * Cloudinary stays: it hosts the customer video files and their posters in
     * TrustVideos, which are genuinely remote media rather than decoration.
     * The YouTube thumbnail hosts stay for VideoGallery's `thumbnailUrl`.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Modern formats first. Next serves AVIF to browsers that accept it and
    // falls back to WebP, which matters on the connections this site is read
    // on: AVIF is typically 20-30% smaller than WebP at the same quality.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
