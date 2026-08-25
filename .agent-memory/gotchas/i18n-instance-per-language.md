# One i18next Instance Per Language

## Context

Putting the language in the URL forced a rewrite of how the client i18next instance is created.
Two shapes were tried before the current one, and both were wrong in ways that stayed quiet.

## Knowledge

**Never call `changeLanguage()` during render.** It emits `languageChanged` synchronously, and every
mounted `useTranslation` answers with a `setState`. Called from a `useState` initialiser in
`Providers`, that is a state update in another component's render body, and React throws "Cannot
update a component (`X`) while rendering a different component (`Providers`)". It only fires on the
*second* language, so a single-language smoke test never sees it.

**`"use client"` does not mean "only on the client".** Client components are still server-rendered,
and on the server the module is a **per-process singleton shared by every request**. A guard like
`if (!i18n.isInitialized) init({ lng })` therefore pins the whole process to whichever language
happened to arrive first: after one request for `/`, `/ru` server-renders in English. In production
that is a page served in the wrong language under load; in dev it shows up as a hydration mismatch,
which is the only reason it was caught.

The fix is to stop mutating a shared instance at all. `getI18n(lang)` keeps a
`Map<AppLanguage, i18n>` and returns the instance *for that language*, created with
`i18next.createInstance()` on first use. Nothing is mutated after creation, so there is no
cross-request leakage and no synchronous event storm; a brand-new instance has no subscribers, so
creating one during render notifies nobody. At most three ever exist. The tree reads it through
`I18nextProvider`.

`LanguageSwitcher` uses plain `<a>` rather than `next/link` for the same reason: language is a
property of the document — `<html lang>`, metadata, canonical, `hreflang` and the instance all change
together — and every page is prerendered, so the reload is cheap.

## Relevant files

- `src/i18n/index.ts`
- `src/app/[lang]/providers.tsx`
- `src/components/Custom/LanguageSwitcher.tsx`

## Implications

Test a language change by *switching*, not by loading one URL — and warm the server with one language
before requesting another, because the leak only appears on the second language a process sees:

```
curl -s localhost:3000/ >/dev/null && curl -s localhost:3000/ru | grep -o '<h1[^>]*>[^<]*'
```

## Related memories

- [[Localized url routing]]
- [[Not found under a dynamic root]]
