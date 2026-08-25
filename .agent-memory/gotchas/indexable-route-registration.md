# Indexable Route Registration

## Context

SEO behavior is distributed across route registries, generated files, page metadata, and compatibility
redirects. Adding a page in only one location creates silent crawl or canonicalization drift.

## Knowledge

`PUBLIC_INDEXABLE_ROUTES` is the allow-list for public pages; `PRIVATE_ROUTE_PREFIXES` identifies
legacy application paths. `src/app/sitemap.ts`, `src/app/robots.ts`, page metadata/canonical output,
navigation, and `src/proxy.ts` must remain consistent with those registries.

Since localization, a registry entry describes a **page, not a URL**: one entry produces three URLs
(`/pricing`, `/ru/pricing`, `/uz/pricing`). The entry also carries the catalog keys for that page's
title and description, so a page cannot be registered without its copy existing in all three
catalogs. Everything downstream — sitemap row, canonical, reciprocal `hreflang` set, Open Graph
locales, robots policy — is derived from the entry by `src/lib/page-metadata.ts`, so the failure mode
is no longer "edited one file of five" but "forgot to register at all".

## Relevant files

- `src/lib/seo-routes.ts`
- `src/lib/page-metadata.ts`
- `src/lib/seo.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/proxy.ts`
- `src/app/[lang]/layout.tsx`

## Implications

A new public route is not complete until metadata, canonical URL, sitemap, robots, route registry,
navigation, and redirect conflicts are reviewed together. Preserve query strings when redirecting old
application URLs.

## Related memories

- [[Marketing application split]]
- [[Localized url routing]]
