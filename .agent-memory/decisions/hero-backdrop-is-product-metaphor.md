# Hero Backdrop Is Product Metaphor

## Context

`globals.css` records that the landing page's two corner light-washes were deleted on purpose: "a
pair of soft radial glows bleeding in from the corners is the marketing-page half of the same tell as
the shell orbs — atmosphere applied to a page that has not earned any, and the first thing every
generated landing page reaches for." A later task asked for a hero background anyway.

## Knowledge

That deletion was not a rule against hero backdrops; it was a rule against **decoration** — a
gradient that could sit behind any product in any industry. `HeroField` satisfies the constraint by
depicting the product's own object: a lattice of OMR answer bubbles, crossed by a slow band of light
that brightens and fills the ones it passes. The grid is being marked, continuously, behind the
sentence claiming tests come back graded.

A generic mesh gradient or aurora — including via a library like `@paper-design/shaders-react` — would
have been faster and is what the reference site does, and it is exactly what the deleted washes were
deleted for. If a future task proposes one, this is the argument it has to answer.

It is a single fragment shader on a full-screen quad using the three.js already installed for
`HeroScene`, so it adds no dependency: a few hundred bubbles individually lit and filled would be a
few hundred DOM nodes in CSS or a few hundred `arc()` calls per frame in canvas 2D, on school
hardware.

**The contrast numbers are measured, not estimated,** and they are load-bearing. Rendering the
shipped shader offscreen across a full 24-second cycle and sampling per pixel: over the left 45% of
the section — the column the `<h1>` occupies — the brightest pixel is 6.7% opacity in dark, mean 0.2%.
An earlier, gentler mask falloff let a filled bubble reach 25% there. The tight cubed falloff
(`0.05 → 0.80`) is what fixed it. Changing `uFocus` or the falloff means re-measuring; neither is
obvious by eye, because the offending pixel appears only at one moment of the cycle.

## Relevant files

- `src/app/[lang]/(landing)/_components/HeroField.tsx`
- `src/app/[lang]/(landing)/_sections/MainPage.tsx`
- `src/app/globals.css` (`.landing-shell-bg`, `.hero-bloom`, `.shell-backdrop`)

## Implications

Backticks cannot appear inside the GLSL template literal — they terminate it, and the build error
points at the comment rather than the shader. Both hero scenes stop off-screen and in hidden tabs, so
a background tab shows a static frame; that is correct behaviour, not a broken animation.

## Related memories

- [[Localized url routing]]
