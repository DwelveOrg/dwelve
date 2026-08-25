# SEO and Route Map

## Language and URLs

The site is published in three languages on three sets of URLs. English is the
default and is **unprefixed**; Russian and Uzbek carry their code.

| Language | Home | A page |
|---|---|---|
| English | `/` | `/pricing` |
| Russian | `/ru` | `/ru/pricing` |
| Uzbek (Latin) | `/uz` | `/uz/pricing` |

Everything renders from `src/app/[lang]`, which is the root layout (there is no
`src/app/layout.tsx`). `src/proxy.ts` rewrites unprefixed requests to `/en/...`
so the address bar keeps the clean URL, and **308-redirects `/en/...` back to the
unprefixed form** so the prefixed English URL cannot become a second indexable
copy. An unrecognised language segment 404s rather than falling back to English.

Consequences worth knowing:

- `<html lang>` carries the BCP-47 tag (`uz-Latn`, not `uz`) from
  `LANGUAGE_TAGS`.
- Titles, descriptions, canonicals and JSON-LD are resolved **on the server** in
  the page's language via `src/i18n/server.ts`. Nothing is corrected after
  hydration.
- The client reads a **per-language** i18next instance (`getI18n(lang)`), never a
  shared one that changes language. Not a style choice: a shared instance leaks
  across server requests — `"use client"` components are still SSR'd, where the
  module is one per-process singleton — and on the client `changeLanguage()`
  during render updates every mounted component mid-render. See
  `.agent-memory/gotchas/i18n-instance-per-language.md`.
- There is no stored language preference: a saved language that rewrote
  `/pricing` into Russian would give one URL two contents and contradict its own
  canonical.
- `LanguageSwitcher` navigates to the same page in the target language rather
  than resetting to the home page, and does so as a **full document load** —
  language is a property of the document (`<html lang>`, metadata, canonical,
  `hreflang`, the instance), and every page is prerendered, so the reload is
  cheap.

## Routes

| Route/family | Purpose | Behavior | Implementation |
|---|---|---|---|
| `/`, `/ru`, `/uz` | Marketing home | Public, canonical, indexable | `src/app/[lang]/(landing)/page.tsx` |
| `/pricing` | Plan, plus the FAQ a free plan raises | Public, indexable | `.../(landing)/pricing` |
| `/about` | What Dwelve is for and where it is | Public, indexable | `.../(landing)/about` |
| `/contact` | Support, schools, bug reports | Public, indexable | `.../(landing)/contact` |
| `/privacy`, `/terms` | Legal | Public, indexable, server-rendered | `.../(landing)/privacy`, `/terms` |
| `/robots.txt` | Crawl policy | Allows marketing; disallows app families in all three language forms | `src/app/robots.ts` |
| `/sitemap.xml` | Canonical public URLs | One entry per page with `hreflang` alternates | `src/app/sitemap.ts` |
| Application prefixes | Old bookmarks/invites/auth links | 308 to `app.dwelve.uz`, query preserved, language prefix stripped | `src/proxy.ts` |
| Any other page | Missing route | Marketing-styled 404, server-rendered | `src/app/global-not-found.tsx` |

`PUBLIC_INDEXABLE_ROUTES` and `PRIVATE_ROUTE_PREFIXES` in `src/lib/seo-routes.ts`
are the route registries. A registry entry describes a **page**, not a URL: one
entry produces three URLs. It also carries the catalog keys for that page's
title and description, so a page cannot be registered without its copy existing
in all three catalogs.

## Adding an indexable page

1. Add its copy to `landing.<page>.*` and its `seo.<page>.{title,description}` in
   `en.ts`, `ru.ts` **and** `uz.ts`.
2. Add an entry to `PUBLIC_INDEXABLE_ROUTES` with those keys.
3. Create `src/app/[lang]/(landing)/<page>/page.tsx` whose `generateMetadata`
   returns `pageMetadata("/<page>", lang)` and which 404s on an unsupported
   language.
4. Link it from `Navbar` and/or `Footer` using `LocaleLink`, never a raw
   `next/link` — a raw link drops a Russian reader into English.
5. Check nothing in `PRIVATE_ROUTE_PREFIXES` shadows the path.

The sitemap, `hreflang` set, canonical, Open Graph locales and robots policy all
follow from steps 1–2. Nothing else needs editing.

## Metadata

`src/lib/page-metadata.ts` is the single builder. For each page it emits:

- a canonical pointing at **that language's** URL;
- reciprocal `hreflang` alternates for all three languages plus `x-default`
  (which points at the unprefixed English URL);
- `og:locale` for the page and `og:locale:alternate` for the other two;
- index/follow with large previews and unlimited snippets (`PUBLIC_ROBOTS`);
- a 1200×630 social image and a Twitter summary-large-image card.

`homeStructuredData` emits `WebSite` and `SoftwareApplication` JSON-LD in the
page's language, from the home page only — the `@id`s are language-neutral so
three translations describe one entity rather than competing.

`src/lib/seo.ts` holds only the canonical origin and shared robots/image
constants; it must stay free of `@/` imports because `next.config.ts` imports it
outside the app's module graph. Canonical host redirects for `www.dwelve.uz` and
`dwelve.vercel.app` live in `next.config.ts`.

## The 404

`app/global-not-found.tsx` handles every unmatched URL, enabled by
`experimental.globalNotFound` in `next.config.ts`.

This is not a stylistic choice. With the root layout at `app/[lang]/layout.tsx`,
Next has no single root layout to compose a 404 from, and a `not-found.tsx`
renders into an `__next_error__` document whose `<body>` is **empty** — the real
content arrives only in the flight payload, so the page is blank until JS
hydrates. Status code and `noindex` are correct either way, and nothing is
logged, which is what makes it easy to miss. `global-not-found.tsx` renders real
server HTML instead.

Two consequences to keep in mind:

- It bypasses every layout, so it re-imports `globals.css` and the fonts (hence
  `src/app/fonts.ts` — one font declaration, two consumers) and cannot use
  i18next, next-themes, the navbar or the footer.
- It takes **no props**, so it cannot know the reader's language. It renders in
  English and offers all three home links rather than guessing.

`dynamicParams = false` on `src/app/[lang]/layout.tsx` keeps bad language
segments in the same routing-level path rather than throwing `notFound()` from
inside a segment, which would hit the empty-document behaviour again.

## Known gaps

- No analytics or search-console verification integration exists in code.
- The legal pages are written to be accurate about what the product does, but
  they have **not been reviewed by a lawyer**. Treat them as a starting draft.
- Pricing states that early access is free and that 30 days' notice precedes any
  change. Those are commitments; keep the page and the product honest together.
- Changelog, help-center and blog pages do not exist.
- Preview-deployment noindex behavior depends on hosting configuration and needs
  verification outside the repository.
