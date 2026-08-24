import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";
import { PRIVATE_ROUTE_PREFIXES } from "@/lib/seo-routes";

/**
 * The marketing site is the indexable face of Dwelve. Application URL
 * families are disallowed — they only exist here as 308 redirects onto
 * app.dwelve.uz (see `src/proxy.ts`), and crawlers need not follow them.
 * Preview deployments are kept out of the index by the platform's own
 * `X-Robots-Tag` header, so this file can stay static.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_ROUTE_PREFIXES],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
