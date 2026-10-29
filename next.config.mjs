/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The Journal became the Blog; old links keep working.
    return [{ source: "/journal", destination: "/blog", permanent: true }];
  },
  /*
   * The content store is read at runtime with `fs`, from a path built
   * at run time — which file tracing cannot infer. Without this, the
   * documents would not be bundled into the serverless function and
   * the first deploy would have nothing to seed from.
   */
  outputFileTracingIncludes: {
    "/**": ["./data/**/*"],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 640, 828, 1080, 1200, 1600, 1920],
  },
};

export default nextConfig;
