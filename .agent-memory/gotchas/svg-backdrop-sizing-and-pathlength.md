# Svg Backdrop Sizing And Pathlength

## Context

The analytics band's distribution curve (an absolutely-positioned decorative SVG
drawn in with Motion's `pathLength`) shipped twice looking like a broken corner
squiggle before either cause was found. Both causes are invisible in code review.

## Knowledge

Two independent traps, one element:

1. **An absolutely-positioned `<svg>` does not stretch from `left/right: 0`.**
   It is a replaced element: with `width: auto`, opposing insets resolve to the
   *intrinsic* size, not the inset box. Given only a `height`, it sizes to the
   viewBox ratio and parks at the left edge (5.5rem tall × 700:240 ≈ 257px wide).
   A `<div>` in the same position stretches; the svg needs explicit
   `width: 100%; height: <n>`.

2. **`pathLength` normalisation and `vector-effect: non-scaling-stroke` disagree
   under non-uniform scale.** Motion's draw-in sets `pathLength="1"` and dash
   values as fractions; `non-scaling-stroke` makes the browser compute dashes in
   screen space, so with `preserveAspectRatio="none"` stretching 700×240 into
   1440×88 the "fully drawn" dash covered ~half the path — at rest, not just
   mid-animation. Fix: author the path at the strip's own geometry (viewBox
   1440×88, vertical scale 1:1) and drop the vector-effect; stroke width then
   stays visually constant because the height is a fixed rem.

Diagnosis that worked: an isolated `file://` HTML with the same svg twice —
explicit size vs inset-only — screenshotted headless. Ten seconds, no dev server.

## Relevant files

- `src/app/[lang]/(landing)/_components/SectionBackdrop.tsx` (`DistributionCurve`)
- `src/app/globals.css` (`.sheet-curve` — the `width: 100%` comment)

## Implications

Any future decorative SVG layer positioned by inset needs explicit dimensions,
and any `pathLength` draw-in must author its path near the rendered aspect
rather than leaning on `preserveAspectRatio="none"` plus `non-scaling-stroke`.

## Related memories

- [[Section sheets are the ambient layer]]
- [[Headless capture misses late animation]]
