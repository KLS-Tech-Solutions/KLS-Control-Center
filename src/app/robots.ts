import type { MetadataRoute } from "next";

/** The admin console must never appear in a search index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
