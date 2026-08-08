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
    ];
  },
  // Tree-shake large libraries so only the icons/components actually used ship to the client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
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
  },
};

export default nextConfig;
