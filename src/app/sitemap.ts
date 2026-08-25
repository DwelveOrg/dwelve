import type { MetadataRoute } from "next";

import { defaultLanguage } from "@/i18n/resources";
import {
  canonicalRouteUrl,
  languageAlternates,
  PUBLIC_INDEXABLE_ROUTES,
} from "@/lib/seo-routes";

/**
 * One entry per *page*, not per URL.
 *
 * A trilingual site can be listed two ways: three rows per page, or one row per
 * page carrying `xhtml:link` alternates. The second is what Google documents for
 * `hreflang` in a sitemap, and it keeps the file honest about how many pages
 * this site actually has — seven, in three languages, not twenty-one unrelated
 * URLs. `alternates.languages` is Next's name for those `xhtml:link` elements.
 *
 * The `<loc>` is always the unprefixed English URL, matching each page's own
 * canonical for English; the Russian and Uzbek URLs reach the index through the
 * alternates, which point back at each other reciprocally.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_INDEXABLE_ROUTES.map(({ pathname, changeFrequency, priority }) => ({
    url: canonicalRouteUrl(pathname, defaultLanguage),
    changeFrequency,
    priority,
    alternates: { languages: languageAlternates(pathname) },
  }));
}
