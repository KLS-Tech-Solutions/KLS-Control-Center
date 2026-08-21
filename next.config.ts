import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Traces the modules actually used and emits a self-contained server, so
  // the runtime image carries no node_modules and no build toolchain. It is
  // what keeps the Docker image small enough to be worth containerising.
  output: "standalone",
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
