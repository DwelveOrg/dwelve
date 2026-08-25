import type { MetadataRoute } from "next";

import { supportedLanguages } from "@/i18n/resources";
import { SITE_URL } from "@/lib/seo";
import { PRIVATE_ROUTE_PREFIXES } from "@/lib/seo-routes";

/**
 * The marketing site is the indexable face of Dwelve. Application URL families
 * are disallowed — they only exist here as 308 redirects onto app.dwelve.uz (see
 * `src/proxy.ts`), and crawlers need not follow them.
 *
 * Each family is disallowed in its language-prefixed forms too. `/ru/login` is
 * not a page anyone links to, but the proxy does answer it (it strips the prefix
 * and redirects to the app), so a crawler that guesses the URL would otherwise
 * find a live redirect chain that robots.txt had not accounted for. Listing all
 * three keeps the crawl policy and the proxy describing the same set of URLs.
 *
 * Preview deployments are kept out of the index by the platform's own
 * `X-Robots-Tag` header, so this file can stay static.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = PRIVATE_ROUTE_PREFIXES.flatMap((prefix) => [
    prefix,
    ...supportedLanguages.map((lang) => `/${lang}${prefix}`),
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
