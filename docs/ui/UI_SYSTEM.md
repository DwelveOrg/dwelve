# Marketing UI System

## Page composition

The home page is a single vertical narrative assembled in
`src/app/(landing)/page.tsx`: hero, AI drafting, teacher control, features,
roles, process, analytics, FAQ, final CTA, and footer. Sections use stable IDs
for in-page navigation and `scroll-mt-*` offsets for the sticky header.

The standard content frame is `max-w-6xl` with `px-4 sm:px-6`. Section spacing
is intentionally generous (`py-24` with larger medium breakpoints). The sticky
navbar switches from transparent to a bordered, blurred background after the
hero edge.

## Tokens and typography

`src/app/globals.css` is the executable token source. Key rules:

- `--brand` is violet identity; `--primary` is quiet ink action. They are not
  interchangeable.
- Use semantic success/warning/destructive/info and `--chart-*` tokens for
  meaning, never arbitrary Tailwind palette colors.
- Resting depth is a hairline and low elevation; strong shadows belong to
  genuinely floating chrome.
- Motion uses the `--dur-*`/`--ease-*` system and must respect reduced motion.
- IBM Plex Sans is normal UI, IBM Plex Serif controlled display, IBM Plex Mono
  aligned numeric content, and Manrope 700 the wordmark only.

Run `npm run check:contrast` after any token change.

## Components to reuse

| Need | Existing implementation |
|---|---|
| Buttons or button-shaped links | `src/components/ui/Button.tsx` |
| Bordered/raised content surface | `src/components/ui/Surface.tsx` |
| Brand mark | `src/components/Custom/DwelveLogo.tsx` |
| FAQ disclosure | `src/components/ui/accordion.tsx` |
| Section heading | `src/app/(landing)/_components/SectionHeading.tsx` |
| Feature bullet list | `src/app/(landing)/_components/FeatureBullets.tsx` |

Keep landing-only components next to the route. Promote one only after it has a
real cross-route consumer.

## Interaction and responsiveness

- Desktop (`lg`) shows centered section navigation with a scroll-spy underline.
- Narrow screens intentionally show only the brand and login/signup actions;
  there is no mobile menu.
- Layouts progressively move from stacked to multi-column at `sm`/`lg`.
- Motion components use `useReducedMotion`; CSS motion must also honor
  `prefers-reduced-motion`.
- Interactive controls need visible hover, focus, active, disabled, and busy
  states without shifting layout.

## Internationalization

All visible landing copy is read through `useTranslation()`. Add each new key to
`src/i18n/messages/en.ts`, `ru.ts`, and `uz.ts` in the same change. The root
starts at `lang="en"`; `Providers` changes the HTML language to the saved/current
client language after hydration.

## Accessibility rules

- Preserve semantic headings, lists, nav labels, and native disclosure/button
  behavior.
- Never encode meaning through color alone.
- Keep keyboard focus rings visible and logical in document order.
- Decorative mockups/marks must remain hidden from assistive technology when
  they convey no unique information.
- Verify 200% zoom, keyboard-only use, reduced motion, and text expansion in
  Russian and Uzbek.

## UI agent rules

Do not create random colors, alternate font stacks, one-off spacing systems,
duplicate buttons/surfaces, nested cards, decorative gradients, or new motion
recipes. Extend the token/component owner when the system genuinely needs a new
variant and document the stable addition here.
