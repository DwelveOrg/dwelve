import type { Metadata } from "next";

import { BRAND_NAME } from "@/constants/brand";
import {
  defaultLanguage,
  OPEN_GRAPH_LOCALES,
  supportedLanguages,
  type AppLanguage,
} from "@/i18n/resources";
import { tServer } from "@/i18n/server";
import { OG_IMAGE, PUBLIC_ROBOTS, TWITTER_IMAGE } from "@/lib/seo";
import {
  canonicalRouteUrl,
  languageAlternates,
  publicRoute,
  type PublicPathname,
} from "@/lib/seo-routes";

/**
 * One builder for every indexable page's metadata.
 *
 * Seven pages times three languages is twenty-one heads of markup. Written by
 * hand that is twenty-one chances to canonicalise a Russian page onto its
 * English twin, to forget an `hreflang`, or to leave `og:locale` reading
 * `en_US` on a page that is not English — which is exactly the drift
 * `docs/web/SEO_AND_ROUTES.md` used to list as a known gap. Registering the page
 * in `PUBLIC_INDEXABLE_ROUTES` and calling this is now the only supported way to
 * add one.
 *
 * What it guarantees per page:
 *   - the canonical points at *this* URL, not the English one;
 *   - all three languages plus `x-default` appear as reciprocal alternates;
 *   - `og:locale` matches the page, and the other two are `og:locale:alternate`;
 *   - index/follow with full-size previews;
 *   - a social card.
 */
export function pageMetadata(pathname: PublicPathname, lang: AppLanguage): Metadata {
  const route = publicRoute(pathname);
  const title = tServer(lang, route.titleKey);
  const description = tServer(lang, route.descriptionKey);
  const url = canonicalRouteUrl(pathname, lang);

  return {
    // `absolute` on every page: the layout's `%s | Dwelve` template would
    // double the brand name, since these titles already carry it where it helps
    // the search result read as a sentence.
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(pathname),
    },
    robots: PUBLIC_ROBOTS,
    openGraph: {
      type: "website",
      url,
      siteName: BRAND_NAME,
      title,
      description,
      locale: OPEN_GRAPH_LOCALES[lang],
      alternateLocale: supportedLanguages
        .filter((other) => other !== lang)
        .map((other) => OPEN_GRAPH_LOCALES[other]),
      images: [{ ...OG_IMAGE, alt: tServer(lang, "seo.ogImageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

/**
 * The site-wide JSON-LD nodes, in the language of the page carrying them.
 *
 * Only the home page emits these: repeating `WebSite`/`Organization` on every
 * page does not strengthen them, and three language copies of the same `@id`
 * would be three conflicting descriptions of one entity. The `@id`s are
 * language-neutral for the same reason.
 */
export function homeStructuredData(lang: AppLanguage) {
  const description = tServer(lang, "seo.home.description");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonicalRouteUrl("/", defaultLanguage)}/#website`,
        url: canonicalRouteUrl("/", lang),
        name: BRAND_NAME,
        description,
        inLanguage: [...supportedLanguages],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalRouteUrl("/", defaultLanguage)}/#software`,
        name: BRAND_NAME,
        url: canonicalRouteUrl("/", lang),
        description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        image: `${canonicalRouteUrl("/", defaultLanguage)}${OG_IMAGE.url}`,
        inLanguage: [...supportedLanguages],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: tServer(lang, "seo.offerDescription"),
        },
      },
    ],
  };
}

/** Serialises a JSON-LD node for `dangerouslySetInnerHTML` without letting it close the script. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
