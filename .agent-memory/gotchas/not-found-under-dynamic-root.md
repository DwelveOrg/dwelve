# Not-Found Under A Dynamic Root

## Context

Moving the root layout to `src/app/[lang]/layout.tsx` — which is what makes the language a root
parameter — silently broke every 404 on the site. Nothing errored, nothing was logged, and the
status code stayed correct, so the build and the smoke tests all passed.

## Knowledge

With no `app/not-found.tsx` beside a *non-dynamic* root layout, Next has nothing to compose a 404
from. Three behaviours were measured, in this order:

1. `not-found.tsx` at `app/[lang]/` alone: never rendered. Every 404 fell through to Next's built-in
   black-and-white page.
2. `not-found.tsx` at `app/[lang]/` **and** at `app/[lang]/(landing)/`: the nested one rendered — but
   into an `__next_error__` document whose `<body>` is **empty**. The content existed only in the
   flight payload, so the page was blank until JS hydrated. Correct 404, correct `noindex`, nothing
   in the log.
3. `app/global-not-found.tsx` with `experimental.globalNotFound: true`: real server HTML. This is
   what Next's own documentation prescribes for a root layout "defined using top-level dynamic
   segments".

A second trap sits behind the first: `useTranslation()` cannot be used in anything that renders
outside the layout tree. i18next is now initialised inside `Providers` (so the first client render
matches the URL's language), so a client component rendered without it gets an uninitialised
instance and renders **nothing** — again with no error. `global-not-found.tsx` uses `tServer`, and it
takes no props, so it also cannot know the reader's language: it renders in English and offers all
three home links.

`dynamicParams = false` on `app/[lang]/layout.tsx` keeps an unknown language segment in the
routing-level path instead of throwing `notFound()` from inside a segment, which would land back on
behaviour 2.

## Relevant files

- `src/app/global-not-found.tsx`
- `src/app/fonts.ts` (the global 404 bypasses layouts, so fonts are shared from here)
- `src/app/[lang]/layout.tsx`
- `next.config.ts` (`experimental.globalNotFound`)

## Implications

Verify a 404 by reading the response **body**, not the status code — every broken variant above
returned a correct 404. `curl <url> | grep '<h1'` is enough; an empty body is the tell.

If `experimental.globalNotFound` is ever removed from Next, the fallback is the built-in 404 page:
degraded, not broken.

## Related memories

- [[Localized url routing]]
