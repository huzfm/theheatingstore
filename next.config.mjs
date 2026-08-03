/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Tree-shake large libraries so only the icons/components actually used ship to the client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  images: {
    // Matches every `quality` value actually passed to next/image across the
    // app: 70-72 for lazy/below-fold cards, 78 for above-fold hero plates,
    // 80/95 for the two pre-existing home hero images. Next 16 clamps any
    // quality not listed here to the nearest configured value.
    qualities: [70, 72, 75, 78, 80, 95],
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
