# Headless Capture Misses Late Animation

## Context

The landing hero's entrance is a staggered sequence (`BEAT` in `MainPage.tsx`). Verifying it with
headless Chrome `--screenshot --virtual-time-budget=N` showed every beat landing **except the last**,
the scroll hint, which was blank at `N` = 5000 and still blank at `N` = 20000.

## Knowledge

It was not a bug. Bisecting proved it three ways: rendered without Motion the hint paints correctly;
rendered with Motion at `delay: 0` it paints correctly; and under `--force-prefers-reduced-motion`
(which collapses every delay to zero) it paints correctly. Only the delayed case was missing.

**`--virtual-time-budget` does not hold the capture open for that many real milliseconds.** Raising
it does not buy more animation. The screenshot lands at roughly **1.2 s of real time**, and the
cut-off is sharp enough to read off the beat table: the CTAs finish at 1.07 s and the proof row at
1.17 s and both appear; the hint finished at 1.27 s and did not.

The DOM is no help here either. `--dump-dom` showed `opacity: 0` inline on elements that were plainly
visible in the same run, because Motion drives opacity through WAAPI, which never writes to inline
style. A large budget made it worse: at `N` = 20000 the dump came back **pre-hydration**, showing
React's SSR values for everything.

The in-app browser pane cannot substitute. Its document is `visibilityState: "hidden"`, so
`requestAnimationFrame` never fires (measured: 0 frames in 500 ms), Motion starts nothing at all
(`el.getAnimations()` is empty), and everything sits at its `initial` value forever. Patching
`window.requestAnimationFrame` from the console does not help — Motion captured the real one at
module load.

## Implications

The pane is still correct for **layout, colour and computed styles**; only motion is dead there. To
screenshot a settled UI in it, inject an override rather than waiting:

```css
#home [style*="opacity"]{opacity:1!important}
#home h1 span span{transform:none!important}
#home svg path{stroke-dasharray:none!important;stroke-dashoffset:0!important}
```

To verify motion itself, use headless Chrome and keep the beats under ~1.2 s, or bisect against
`delay: 0` and `--force-prefers-reduced-motion`. Do not conclude an element is broken because a
headless capture is missing it — check what the beat's delay plus duration comes to first.

## Related memories

- [[Hero is a full viewport scene]]
