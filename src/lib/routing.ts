"use client";

import { useParams, usePathname } from "next/navigation";

import { defaultLanguage, isSupportedLanguage, type AppLanguage } from "@/i18n/resources";
import { localizedPath, splitLanguagePrefix } from "@/lib/seo-routes";

/**
 * The language of the page being rendered, read from the route rather than from
 * the address bar.
 *
 * `useParams()` reports the *matched* route, which always carries a language
 * segment because the proxy rewrites `/pricing` to `/en/pricing` before Next
 * routes it. `usePathname()` reports what the reader sees, which for English has
 * no prefix at all — so it is the wrong source for this and the right source for
 * `useUnprefixedPathname()` below.
 */
export function useLanguage(): AppLanguage {
  const params = useParams<{ lang?: string }>();
  return isSupportedLanguage(params?.lang) ? params.lang : defaultLanguage;
}

/**
 * The current page with any language prefix removed — `/pricing` whether the
 * reader is on `/pricing`, `/ru/pricing` or `/uz/pricing`.
 *
 * This is what the language switcher needs: the page identity, so it can offer
 * the same page in the other two languages rather than sending everyone home.
 */
export function useUnprefixedPathname(): string {
  const pathname = usePathname() ?? "/";
  return splitLanguagePrefix(pathname).rest || "/";
}

/**
 * Returns a function that turns an unprefixed path into a href for the current
 * language. Hash-only and cross-origin targets pass through untouched, so a
 * caller can hand it `#features` or an `appHref()` result without special-casing.
 *
 * Use this — or `LocaleLink` — for every internal link. A raw `<Link href="/pricing">`
 * on a Russian page navigates the reader into English, and nothing in the type
 * system would catch it.
 */
export function useLocalizedHref(): (path: string) => string {
  const lang = useLanguage();

  return (path: string) => {
    if (!path.startsWith("/")) return path;

    const [pathname, hash] = path.split("#");
    const localized = localizedPath(pathname || "/", lang);
    return hash ? `${localized}#${hash}` : localized;
  };
}
