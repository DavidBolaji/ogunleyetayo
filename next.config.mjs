/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The Journal became the Blog; old links keep working.
    return [{ source: "/journal", destination: "/blog", permanent: true }];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 640, 828, 1080, 1200, 1600, 1920],
  },
};

export default nextConfig;
