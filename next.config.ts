import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Screenshots and documents served from Cloudflare R2.
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.klstechsolutions.in" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
