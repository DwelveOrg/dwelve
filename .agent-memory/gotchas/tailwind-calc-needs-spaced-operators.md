# Tailwind Calc Needs Spaced Operators

## Context

The landing hero is sized `min-h-[calc(100svh_-_var(--header-h))]`. Written the obvious way —
`min-h-[calc(100svh-var(--header-h))]` — the hero silently kept its content height and the full
viewport scene never appeared. Nothing errored: not the build, not `tsc`, not ESLint, not the
browser console.

## Knowledge

`calc(100svh-var(--header-h))` is **not a subtraction**. CSS `calc()` requires whitespace around `+`
and `-`, because without it the tokenizer reads `100svh-var(...)` as a single ident-like token. The
declaration is then invalid and dropped whole, taking the `min-height` with it — the classic silent
CSS failure.

In a Tailwind arbitrary value a literal space would end the class, so **the space is written as an
underscore**: `min-h-[calc(100svh_-_var(--header-h))]`. Tailwind converts `_` back to a space when it
generates the rule. `*` and `/` do not need this, which is why the mistake survives review.

A second trap sat behind the first. Turbopack served a **stale compiled `globals.css`** after a new
token was added to `:root`: the Tailwind utility scan picked up the new class from the TSX, so the
rule `min-height: calc(100svh - var(--header-h))` existed, while `--header-h` itself was missing from
the compiled `:root`. A var that resolves to nothing produces exactly the same silent invalid `calc`,
so the symptom is identical and the two causes are easy to confuse. The console shows
`No link element found for chunk …css` when this is happening. `rm -rf .next` plus a dev-server
restart fixes it.

## Relevant files

- `src/app/[lang]/(landing)/_sections/MainPage.tsx`
- `src/app/globals.css`

## Implications

Do not diagnose a missing arbitrary utility from the DOM alone. Fetch the compiled stylesheet the
page links and check for **both** the generated rule and every custom property it references:

```
curl -s -L http://localhost:3000/en -o /tmp/pg.html
CSS=$(grep -oE 'href="[^"]*\.css[^"]*"' /tmp/pg.html | head -1 | sed 's/href="//;s/"//')
curl -s "http://localhost:3000$CSS" | grep -o -- '--header-h:[^;]*'
```

Arbitrary *variants* are a separate limit: `[@media_(min-width:64rem)_and_(min-height:46rem)]:flex`
and `lg:[@media(min-height:46rem)]:flex` both reached the HTML and neither produced a rule. Reserve
space by construction instead of reaching for an exotic variant.

## Related memories

- [[Hero is a full viewport scene]]
