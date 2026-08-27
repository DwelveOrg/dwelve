# Section Sheets Are The Ambient Layer

## Context

A task asked for "background animation in every two or three sections, like other
websites" (reference: bridgemind.ai — generic animated atmosphere). The
[[Hero backdrop is product metaphor]] rule forbids exactly that: a backdrop must
depict the product's own object or it must not exist.

## Knowledge

The resolution: the landing page's three muted `border-y bg-muted/45` bands became
*sheets* — the product's paper, quietly alive — while the flat sections between
them stay bare ground. That alternation, not per-section decoration, is the
"every other section" rhythm the task asked for. The figures are per-band and tied
to each band's argument:

- teacher control: ruled paper + a slow scan of brand light (the review pass);
- roles: miniature OMR sheets rising, each *graded* mid-flight by a drawn green
  check — the one second hue allowed, because success-green is product state;
- analytics: graph paper + the distribution curve as a full-width ribbon in the
  band's bottom padding (the only strip the opaque panel never covers);
- closing band: one slow light pass across `.cta-rules`.

Ink ceilings are inherited from the measured precedents and matter: ruling ≤5.5%
foreground (7% dark); brand washes peak ≤8% light / 9% dark, inside the ~9% where
`--muted-foreground` still held 5.1:1. Line *figures* (the flyer sheets, the
curve) may carry more ink than washes because they are hairlines in open strips,
not fields under text. Everything animates transform/opacity/dash-offset only.
An earlier draft used anonymous drifting grid squares for the roles band; the user
rejected them as "boring cubes" — abstract shapes fail where product objects work.

## Relevant files

- `src/app/[lang]/(landing)/_components/SectionBackdrop.tsx`
- `src/app/globals.css` ("Section sheets" block, `.cta-sheen`)
- `docs/ui/UI_SYSTEM.md` ("Section sheets")

## Implications

New sections wanting a backdrop must name their product object first. Reduced
motion keeps the paper, removes the scan (a parked stripe reads as printed),
and rests the sheets already graded.

## Related memories

- [[Hero backdrop is product metaphor]]
- [[Svg backdrop sizing and pathlength]]
