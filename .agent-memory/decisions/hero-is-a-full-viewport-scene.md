# Hero Is A Full-Viewport Scene

## Context

A task asked to replicate the entry scene of `jamals.uz` — an SAT academy site that opens on one
full-viewport, cinematic hero — "with a different approach that suits our style".

The reference scene, read off its live DOM, is six things: a `min-h-svh` frame; a layered ground
(stock `<video>` at `scale-[1.06]`, a vertical scrim, a horizontal scrim darkest under the copy, an
accent radial, a grain layer); a choreographed entrance keyed off `data-hero-*` attributes; a
line-by-line masked headline reveal; a hand-drawn accent underline animated by `stroke-dashoffset`;
and a glass panel of count-up statistics (`data-hero-count="10000"`).

## Knowledge

**The choreography transferred; the cinematics and the statistics did not.** That split was forced by
two things this repository had already decided.

[[Hero backdrop is product metaphor]] pre-answers the ground: a wash that could sit behind any
product in any industry is the thing the corner glows were deleted for, and it names this exact
reference site as the example. `HeroField` already occupies that slot honestly, so the scene's ground
stayed the marking lattice and simply got the whole viewport. A stock video and a grain layer would
have been the deleted decoration wearing a different costume.

The count-up statistics were refused for a different reason: the copy is deliberately modest — "Now
in early access", "Built with teacher feedback", "Shaped by real teachers and tutors reviewing draft
tests". There is no honest "10 000+ students" to display, so the reference's strongest single element
had to be dropped rather than filled with an invented number. **If a future task proposes hero
metrics, that is the constraint it has to satisfy, not an oversight to correct.**

What did transfer, and why each earns itself:

- **The scene framing.** `min-h-[calc(100svh_-_var(--header-h))]`, so the page opens as a place.
  `SchoolsBand` moved below the fold and its rule became the horizon.
- **The masked line reveal**, via `useLineSplit`. Measured, not authored — see `/docs/ui/UI_SYSTEM.md`.
- **`MarkingStroke`.** An underline, a lift, and a tick. This is the piece that answers the
  anti-decoration rule the same way `HeroField` did: it is the gesture a teacher makes on a page, and
  it lands under the sentence claiming tests come back graded. A luminous swoosh would not have.

`HeroField` needed no re-measure for the taller box: its `uFocus` is normalised UV with an
aspect-corrected falloff, so a taller frame moves the bright region *away* from the headline column,
never toward it.

## Relevant files

- `src/app/[lang]/(landing)/_sections/MainPage.tsx` (`BEAT` is the whole entrance in one object)
- `src/app/[lang]/(landing)/_components/MarkingStroke.tsx`
- `src/app/[lang]/(landing)/_hooks/useLineSplit.ts`
- `src/app/globals.css` (`--header-h`), `_components/Navbar.tsx` (applies it)

## Implications

`--header-h` is applied as a `min-h` on the navbar's own row, so the token *sets* the header height.
Changing the bar's padding no longer silently desynchronises the hero.

## Related memories

- [[Hero backdrop is product metaphor]]
- [[Tailwind calc needs spaced operators]]
