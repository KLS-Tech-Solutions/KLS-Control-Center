import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Standalone output — everywhere except Vercel.
   *
   * `output: "standalone"` emits a self-contained server, which is what
   * `docs/DEPLOYMENT.md` runs under systemd when the console is self-hosted.
   * That path is the fallback, so this is gated rather than deleted.
   *
   * On Vercel it must be off. Next 16.3.x has a bug where Vercel's build
   * adapter suppresses `.next/next-server.js.nft.json` while the standalone
<<<<<<< HEAD
   * writer still expects it, and the build dies in `onBuildComplete` with
   * ENOENT on that file. Upstream: vercel/next.js#96646.
   *
   * Vercel sets `VERCEL=1` on every build, and produces its own optimised
   * output, so nothing is lost by leaving this undefined there.
=======
   * writer still expects it, so the build dies in `onBuildComplete` with:
   *
   *     ENOENT: no such file or directory,
   *     open '/vercel/path0/.next/next-server.js.nft.json'
   *
   * Upstream: vercel/next.js#96646. Vercel sets `VERCEL=1` on every build and
   * produces its own optimised output, so nothing is lost by leaving this
   * undefined there.
>>>>>>> 4b86b5379c83a1fbf94a841e5a1909f9c0467238
   */
  output: process.env.VERCEL ? undefined : "standalone",
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
