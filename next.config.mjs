/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 640, 828, 1080, 1200, 1600, 1920],
  },
};

export default nextConfig;
