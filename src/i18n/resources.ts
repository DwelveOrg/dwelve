import { enMessages } from "./messages/en";
import { ruMessages } from "./messages/ru";
import { uzMessages } from "./messages/uz";

export const supportedLanguages = ["en", "ru", "uz"] as const;
export type AppLanguage = (typeof supportedLanguages)[number];

/**
 * English is the default language and therefore the *unprefixed* one: `/pricing`
 * is English, `/ru/pricing` and `/uz/pricing` are the other two. Changing this
 * changes which URLs carry a prefix, so it is a routing decision as much as a
 * copy one — see `src/lib/seo-routes.ts` and `src/proxy.ts`.
 */
export const defaultLanguage: AppLanguage = "en";

export const resources = {
  en: enMessages,
  ru: ruMessages,
  uz: uzMessages,
} as const;

/**
 * Narrows an untrusted string — a URL segment, a stored preference — to a
 * language we actually ship. Every entry point that reads a language from
 * outside the app must go through this rather than casting.
 */
export function isSupportedLanguage(value: unknown): value is AppLanguage {
  return typeof value === "string" && (supportedLanguages as readonly string[]).includes(value);
}

/**
 * BCP-47 tags for `hreflang`, Open Graph `locale`, and the `<html lang>`
 * attribute. Uzbek ships in Latin script, which `uz-Latn` states explicitly —
 * bare `uz` leaves a crawler to guess between two scripts.
 */
export const LANGUAGE_TAGS: Record<AppLanguage, string> = {
  en: "en",
  ru: "ru",
  uz: "uz-Latn",
};

/** Open Graph wants an underscored territory form, not the `hreflang` tag. */
export const OPEN_GRAPH_LOCALES: Record<AppLanguage, string> = {
  en: "en_US",
  ru: "ru_RU",
  uz: "uz_UZ",
};

/** Endonyms — a language menu that names languages in the reader's own language. */
export const LANGUAGE_ENDONYMS: Record<AppLanguage, string> = {
  en: "English",
  ru: "Русский",
  uz: "Oʻzbekcha",
};
