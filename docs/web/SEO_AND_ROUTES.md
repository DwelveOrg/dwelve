# SEO and Route Map

## Routes

| Route/family | Purpose | Behavior | Implementation |
|---|---|---|---|
| `/` | Marketing home | Public, canonical, indexable | `src/app/(landing)/page.tsx` |
| `/robots.txt` | Crawl policy | Allows marketing; disallows app families | `src/app/robots.ts` |
| `/sitemap.xml` | Canonical public URLs | Currently contains `/` only | `src/app/sitemap.ts` |
| Application prefixes | Old bookmarks/invites/auth links | 308 to `app.dwelve.uz`, query preserved | `src/proxy.ts` |
| Any other page | Missing route | Marketing-styled 404 | `src/app/not-found.tsx` |

`PUBLIC_INDEXABLE_ROUTES` and `PRIVATE_ROUTE_PREFIXES` in
`src/lib/seo-routes.ts` are the route registries. A new indexable page is not
complete until the first registry, sitemap output, page metadata, canonical URL,
navigation, and robots policy agree.

## Metadata

`src/lib/seo.ts` owns the canonical origin, home title, and description.
`src/app/layout.tsx` supplies the metadata base, title template, icons, and
application category. The home page adds:

- absolute home title and description;
- canonical `/`;
- index/follow directives;
- Open Graph website metadata and 1200×630 image;
- Twitter summary-large-image metadata;
- JSON-LD `WebSite` and `SoftwareApplication` nodes.

Canonical host redirects for `www.dwelve.uz` and `dwelve.vercel.app` live in
`next.config.ts`.

## Known gaps

- Language selection is client-side on one URL. There are no localized URLs,
  `hreflang` alternates, or language-specific server metadata.
- Open Graph declares `en_US` even when a returning visitor selects Russian or
  Uzbek client-side.
- No analytics or search-console verification integration exists in code.
- Pricing, privacy, terms, help, about, and blog pages do not exist.
- Preview-deployment noindex behavior depends on hosting configuration and
  needs verification outside the repository.
