import {
  defaultLanguage,
  LANGUAGE_TAGS,
  supportedLanguages,
  type AppLanguage,
} from "@/i18n/resources";
import { SITE_URL } from "@/lib/seo";

/**
 * Public pages that are useful, canonical, and intentionally indexable.
 *
 * Keep this list explicit: application URLs must never enter the sitemap just
 * because a new App Router page is added. Auth pages and invite-token workflows
 * are publicly reachable, but they emit `noindex` and therefore do not belong
 * here.
 *
 * `pathname` is the *unprefixed* (English) path. Every entry is published in all
 * three languages — `/pricing`, `/ru/pricing`, `/uz/pricing` — so this list
 * describes pages, not URLs, and one entry produces three of them.
 *
 * `titleKey`/`descriptionKey` point into the message catalogs. Metadata is built
 * from them per language in `pageMetadata()`, which is why a page cannot be
 * registered here without its copy existing in all three catalogs.
 */
export const PUBLIC_INDEXABLE_ROUTES = [
  {
    pathname: "/",
    changeFrequency: "weekly",
    priority: 1,
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
  },
  {
    pathname: "/pricing",
    changeFrequency: "monthly",
    priority: 0.9,
    titleKey: "seo.pricing.title",
    descriptionKey: "seo.pricing.description",
  },
  {
    pathname: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
    titleKey: "seo.about.title",
    descriptionKey: "seo.about.description",
  },
  {
    pathname: "/contact",
    changeFrequency: "monthly",
    priority: 0.6,
    titleKey: "seo.contact.title",
    descriptionKey: "seo.contact.description",
  },
  {
    pathname: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
    titleKey: "seo.privacy.title",
    descriptionKey: "seo.privacy.description",
  },
  {
    pathname: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
    titleKey: "seo.terms.title",
    descriptionKey: "seo.terms.description",
  },
] as const;

export type PublicRoute = (typeof PUBLIC_INDEXABLE_ROUTES)[number];
/** The unprefixed pathname of any registered public page. */
export type PublicPathname = PublicRoute["pathname"];

/** Registry lookup, so a page can read its own metadata keys without repeating them. */
export function publicRoute(pathname: PublicPathname): PublicRoute {
  const route = PUBLIC_INDEXABLE_ROUTES.find((entry) => entry.pathname === pathname);
  if (!route) throw new Error(`Unregistered public route: ${pathname}`);
  return route;
}

/**
 * Application route families. They live on the app origin (`DwelveOrg/app`,
 * app.dwelve.uz); here they are exactly what the proxy 308-redirects there
 * and what robots.txt disallows. The auth pages are listed too — they are
 * application URLs like any other now.
 */
export const PRIVATE_ROUTE_PREFIXES = [
  "/api/",
  "/login",
  "/signup",
  "/password-reset",
  "/reset-password",
  "/assignments",
  "/dashboard",
  "/exam",
  "/groups",
  "/invite",
  "/notifications",
  "/onboarding",
  "/profile",
  "/school",
  "/schools",
  "/settings",
  "/studio",
  "/tests",
] as const;

/**
 * Paths that must never be language-prefixed or rewritten: generated metadata
 * routes and well-known files. `/sitemap.xml` in Russian is not a thing, and a
 * rewrite would turn it into a 404.
 */
export const LANGUAGE_EXEMPT_PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
] as const;

/**
 * Splits a language prefix off an incoming path.
 *
 * The proxy needs this before it can decide anything: `/ru/login` is the same
 * application URL as `/login` and has to redirect to the app the same way, and
 * `/en/pricing` is a duplicate of `/pricing` that has to be collapsed. Returns
 * the default language when there is no prefix, which is the whole point of the
 * default being unprefixed.
 */
export function splitLanguagePrefix(pathname: string): {
  lang: AppLanguage;
  /** The path with no language prefix, always starting with `/`. */
  rest: string;
  /** Whether the incoming path actually carried a prefix. */
  hadPrefix: boolean;
} {
  const segments = pathname.split("/").filter(Boolean);
  const [first, ...tail] = segments;

  if (first && (supportedLanguages as readonly string[]).includes(first)) {
    return {
      lang: first as AppLanguage,
      rest: `/${tail.join("/")}`,
      hadPrefix: true,
    };
  }

  return { lang: defaultLanguage, rest: pathname || "/", hadPrefix: false };
}

/**
 * The public URL path for a page in one language.
 *
 * English is unprefixed (`/pricing`); the others carry their code (`/ru/pricing`).
 * The root is `/`, `/ru`, `/uz` — never `/ru/`, because a trailing slash would
 * make a second URL for the same page.
 */
export function localizedPath(pathname: string, lang: AppLanguage): string {
  const clean = pathname === "/" ? "" : pathname;
  if (lang === defaultLanguage) return clean || "/";
  return `/${lang}${clean}`;
}

/**
 * Builds sitemap and canonical URLs from the one production origin without
 * introducing trailing-slash, query-string, or alternate-host variants.
 */
export function canonicalRouteUrl(pathname: string, lang: AppLanguage = defaultLanguage) {
  if (
    !pathname.startsWith("/") ||
    pathname.includes("?") ||
    pathname.includes("#") ||
    (pathname.length > 1 && pathname.endsWith("/"))
  ) {
    throw new Error(`Invalid canonical sitemap pathname: ${pathname}`);
  }

  const path = localizedPath(pathname, lang);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * The `hreflang` map for one page.
 *
 * Every language points at every other, itself included — a reciprocal set is
 * what makes Google treat the three URLs as one page in three languages rather
 * than as three competing pages. `x-default` goes to the unprefixed English URL,
 * which is where a reader whose language we do not ship should land.
 */
export function languageAlternates(pathname: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const lang of supportedLanguages) {
    alternates[LANGUAGE_TAGS[lang]] = canonicalRouteUrl(pathname, lang);
  }
  alternates["x-default"] = canonicalRouteUrl(pathname, defaultLanguage);
  return alternates;
}
