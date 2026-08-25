# Localized URL Routing

## Context

The site shipped one URL per page with i18next swapping strings client-side, and a saved language in
`localStorage["gf-language"]`. Google therefore only ever indexed the English copy, and Open Graph
declared `en_US` even for a returning Russian reader. `docs/web/SEO_AND_ROUTES.md` carried this as a
known gap while there was one page; six more pages would have multiplied it.

## Knowledge

Every route now lives under `src/app/[lang]`, which is the root layout — there is deliberately no
`src/app/layout.tsx`, because a dynamic segment above the root layout is what makes `lang` a root
parameter and lets server code resolve copy without prop drilling. This is the pattern Next 16's own
internationalization guide documents.

English is published unprefixed. `src/proxy.ts` rewrites `/pricing` to `/en/pricing` (a rewrite, so
the address bar keeps the clean URL) and **308-redirects `/en/pricing` back to `/pricing`**, because
otherwise the prefixed form becomes a second indexable copy of the same page. It also strips a
language prefix before matching application routes, so `/ru/login` is recognised as the app URL it is
— the product has no localized URLs and would 404 on `/ru/login`.

Two consequences that are easy to undo by accident:

- `Providers` calls `initI18n(lang)` from a `useState` initialiser, not an effect. That runs during
  the first render, before children render, so the client's first output matches the server's.
  Moving it to an effect reintroduces a hydration mismatch on every translated string.
- The stored language preference was **deliberately deleted**. A saved language that rewrote
  `/pricing` into Russian would give one URL two contents and contradict that page's own canonical
  and `hreflang`. The URL is the preference; `LanguageSwitcher` navigates.

`LANGUAGE_TAGS` supplies BCP-47 tags for `<html lang>` and `hreflang`: Uzbek is `uz-Latn`, because
bare `uz` leaves a crawler to guess between two scripts.

## Relevant files

- `src/proxy.ts`
- `src/app/[lang]/layout.tsx`, `src/app/[lang]/providers.tsx`
- `src/i18n/index.ts`, `src/i18n/resources.ts`, `src/i18n/server.ts`
- `src/lib/seo-routes.ts`, `src/lib/page-metadata.ts`, `src/lib/routing.ts`
- `docs/web/SEO_AND_ROUTES.md`

## Implications

Use `LocaleLink` for every internal marketing link; a raw `next/link` compiles, renders and silently
drops a Russian reader into English. Register a page once in `PUBLIC_INDEXABLE_ROUTES` — an entry
describes a page, not a URL, and produces three of them along with the sitemap row, canonical,
`hreflang` set and Open Graph locales.

## Related memories

- [[Not found under a dynamic root]]
- [[Indexable route registration]]
- [[Marketing application split]]
- [[Hero backdrop is product metaphor]]
