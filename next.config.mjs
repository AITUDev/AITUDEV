/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js image optimization with modern formats
    formats: ["image/avif", "image/webp"],
    // Optionally adjust device/image sizes for better responsive behavior
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      // Add other allowed image hosts here if needed
    ],
  },
  // Strong caching for static assets
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(css|js)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          // Compression is typically handled by the platform (e.g., Vercel/CDN)
        ],
      },
    ]
  },
  experimental: {
    // Reduce bundle size by optimizing package imports
    optimizePackageImports: ["lucide-react"],
  },
}

export default nextConfig
