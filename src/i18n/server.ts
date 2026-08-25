import {
  defaultLanguage,
  resources,
  type AppLanguage,
} from "./resources";

/**
 * Reading the message catalogs from a Server Component.
 *
 * The client runs i18next; the server cannot. `generateMetadata` is a server
 * function, and page titles, descriptions and JSON-LD are exactly the strings a
 * crawler reads — so they have to be resolved during the render, in the
 * language the URL asked for, not swapped in later by a `useEffect`. That was
 * the whole point of moving to `/[lang]` URLs: the markup is already correct
 * when it leaves the server.
 *
 * The catalogs are plain TypeScript objects, so no loader is needed. This walks
 * one, and falls back to English per key rather than per catalog: a Russian page
 * with one untranslated string should show that one string in English, not drop
 * back to an English page.
 */

type Catalog = Record<string, unknown>;

function lookup(catalog: Catalog, path: readonly string[]): unknown {
  let node: unknown = catalog;
  for (const segment of path) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Catalog)[segment];
  }
  return node;
}

/** `{{name}}` interpolation, matching i18next's default so both sides agree. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Resolves one dot-separated key, e.g. `landing.pricing.title`.
 *
 * Returns the key itself when nothing is found, which is i18next's behaviour and
 * makes a missing string loud in the page title instead of silently empty.
 */
export function tServer(
  lang: AppLanguage,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const path = key.split(".");
  const value =
    lookup(resources[lang].translation as Catalog, path) ??
    lookup(resources[defaultLanguage].translation as Catalog, path);

  return typeof value === "string" ? interpolate(value, vars) : key;
}

/**
 * The array form, for the copy that is genuinely a list — legal clauses, the
 * bullets under a plan. Returns `[]` rather than throwing so a half-translated
 * catalog renders a short section instead of a 500.
 */
export function tListServer(lang: AppLanguage, key: string): string[] {
  const path = key.split(".");
  const value =
    lookup(resources[lang].translation as Catalog, path) ??
    lookup(resources[defaultLanguage].translation as Catalog, path);

  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

/**
 * A legal document, read straight out of the catalog.
 *
 * The privacy policy and the terms are the two pages on this site with no
 * interactivity at all, so they render on the server and ship no JavaScript for
 * their body. That only works if the structure — heading, paragraphs, optional
 * bullet list — comes out of the catalog as data rather than as forty
 * individually-keyed strings, which is what this reads.
 *
 * Anything malformed is dropped rather than thrown on: a half-finished
 * translation should cost the reader a section, not the page.
 */
export type LegalSection = {
  heading: string;
  body: string[];
  list?: string[];
};

export function tLegalSectionsServer(lang: AppLanguage, key: string): LegalSection[] {
  const path = key.split(".");
  const value =
    lookup(resources[lang].translation as Catalog, path) ??
    lookup(resources[defaultLanguage].translation as Catalog, path);

  if (!Array.isArray(value)) return [];

  return value.flatMap((raw): LegalSection[] => {
    if (typeof raw !== "object" || raw === null) return [];
    const section = raw as Record<string, unknown>;
    if (typeof section.heading !== "string") return [];

    return [
      {
        heading: section.heading,
        body: Array.isArray(section.body)
          ? section.body.filter((item): item is string => typeof item === "string")
          : [],
        list: Array.isArray(section.list)
          ? section.list.filter((item): item is string => typeof item === "string")
          : undefined,
      },
    ];
  });
}
