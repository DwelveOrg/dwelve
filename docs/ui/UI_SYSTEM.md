# Marketing UI System

## Page composition

The site is seven pages, all under `src/app/[lang]/(landing)/`. The navbar and
footer live in that group's `layout.tsx`, so every page carries the same chrome.

The **home page** is a single vertical narrative assembled in `page.tsx`: hero,
AI drafting, teacher control, features, roles, process, analytics, FAQ, and the
final CTA. Sections use stable IDs for in-page navigation and `scroll-mt-*`
offsets for the sticky header.

**Every other page** opens with `PageHeader` — eyebrow, `<h1>`, lead, optional
actions — and closes with `ClosingCta`, the violet band the home page ends on.
That is deliberate: five pages each inventing their own opening would give the
site five first impressions, and a page that argues a case and then simply stops
leaves the reader at the footer with no offer.

**Sub-pages are centred**, on the same axis `SectionHeading` already puts every
home-page section on. Headings, leads and short prose are centre-aligned inside
`mx-auto` columns; each element carries its own measure (the heading is allowed
to be wider than the lead) so the block does not go ragged.

Two things stay left-aligned inside those centred columns, and should:

- **Legal clauses.** Centred legal prose is unreadable, and a numbered heading
  whose number does not share a left edge is not a numbered heading. On
  `/privacy` and `/terms` the date and the opening paragraph are centred; the
  document below them is not.
- **Numbered and bulleted lists**, for the same reason — a list whose markers do
  not line up is not a list.

The standard content frame is `max-w-6xl` with `px-4 sm:px-6`; prose measures
are `max-w-2xl`/`max-w-3xl` (roughly 70–90 characters) centred inside it.

Section spacing is intentionally generous (`py-24` with larger medium
breakpoints). The sticky navbar switches from transparent to a bordered, blurred
background after the hero edge.

## The hero scene

The home page opens on a **scene** rather than a section: the hero's inner frame
is `min-h-[calc(100svh_-_var(--header-h))]`, so the first thing a visitor gets is
one full viewport with the copy centred in it. `SchoolsBand` is therefore the
first thing below the fold, and its top rule is the scene's horizon.

The underscores in that class are load-bearing. `calc(100svh-var(--header-h))`
is not a subtraction — CSS needs whitespace around the operator — and a `calc`
the parser rejects takes the whole `min-height` with it, silently. `--header-h`
is a token rather than a copied number, and `Navbar` applies it as a `min-h` on
its own row, so the token *sets* the header height instead of describing it.

### The ground

`HeroField` is a full-bleed WebGL layer behind the scene: a lattice of answer
bubbles crossed by a slow band of light that brightens and fills the ones it
passes. It is the loudest of the page's ambient layers (the "Section sheets"
below carry the rest), and the reason it is allowed to exist is that it depicts
the product's own object rather than being atmosphere — see the file's header
for the full argument, and for the
measured contrast numbers that keep it off the headline. Re-measure if the focus
point or mask falloff changes. Its focus is expressed in normalised UV with an
aspect-corrected falloff, so giving the scene a taller box moves no pixel of it
relative to the headline column.

`.hero-bloom` still sits inside the 3D scene's own box and is still the
WebGL-absent fallback for `HeroScene`. Both scenes stop when off-screen or in a
hidden tab and paint one still frame under reduced motion.

### The entrance

The hero is the one screen a visitor *arrives* at rather than scrolls to, so it
is the one screen that assembles itself. `BEAT` in `MainPage.tsx` is the whole
score in one object — badge, headline, mark, lede, CTAs, proof, object, hint —
and it holds delays, not durations. `--dur-*` still tops out at 360ms for every
control in the product; a page entrance is not a control, so the individual
moves stay short and only the sequence is long.

Two devices carry it:

- **The headline reveals a line at a time.** `useLineSplit` measures where the
  browser actually broke the `<h1>` (`Range.getClientRects()` after
  `document.fonts.ready`) and each line becomes its own clipped box to rise out
  of. The breaks are measured rather than authored because the headline is
  `text-balance` in three languages — nobody can predict them, and hard-coding
  them per language stops the headline being responsive. Server and first client
  render emit plain text, so there is no hydration mismatch; the split is
  dropped on resize and never happens under reduced motion. Each clip box is
  grown past its line box and pulled back by the same margin, which is what
  keeps Cyrillic descenders and the breve on Uzbek `Oʻ` from being shaved off.
- **`MarkingStroke` signs the headline.** An underline, a lift, and a tick, in
  `--brand`, drawn with `pathLength`. It answers the same objection `HeroField`
  had to: it is the gesture a teacher makes on a page, not a swoosh, and it
  lands under the sentence claiming tests come back graded.

Under reduced motion every beat collapses to an opacity fade at zero delay and
the mark is painted already drawn — it is the page's only visual claim about
grading above the fold, so it is not dropped.

## Section sheets

Between the hero and the closing band the page breathes on a two-section
rhythm: flat ground, then a muted `border-y bg-muted/45` band. Each band
carries a quiet ambient layer — `SectionBackdrop` in `_components`, styles
under "Section sheets" in `globals.css` — that answers the same constraint
`HeroField` did: a backdrop must depict the product's own object or it must
not exist. No auroras, mesh gradients, or orbs.

- **Teacher control — `review`.** Ruled paper, and a slow band of brand light
  reading down it the way the mock's cursor reads the options.
- **Roles — `flow`.** Faint ruling with miniature answer sheets rising through
  it; mid-rise a green check draws across each — the product's loop
  (submitted → marked) told at a whisper. The green is the product's own
  "graded" state, and the one second hue the ambient layer is allowed.
- **Analytics — `measure`.** Graph paper, and the score-distribution curve
  drawing itself as a full-width ribbon in the band's bottom padding, directly
  under the histogram it mirrors.
- **Closing band.** `.cta-sheen`: one slow pass of light across `.cta-rules`,
  travelling for a third of its loop and resting for the rest.

The budget rules are inherited from the measured precedents: only `transform`,
`opacity` and dash-offset ever animate; soft edges are gradients that reach
zero inside their own box; ruling stays ≤5.5% foreground (7% dark) and brand
washes peak ≤8% light / 9% dark — inside the ~9% at which `--muted-foreground`
was still measured at 5.1:1. The host section is `relative isolate` and the
layer sits at `-z-10`, which paints above the section's own background but
under all its content. Under reduced motion the paper stays, the scan is
removed rather than parked, the sheets rest still and already graded, and the
curve is simply there.

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
| Section heading | `_components/SectionHeading.tsx` |
| Feature bullet list | `_components/FeatureBullets.tsx` |
| Grader's mark under display text | `_components/MarkingStroke.tsx` |
| Rendered-line split for reveals | `_hooks/useLineSplit.ts` |
| Sub-page opening (centred) | `_components/PageHeader.tsx` |
| Violet closing band | `_components/ClosingCta.tsx` |
| FAQ list without a heading | `_components/FaqList.tsx` |
| Legal prose | `_components/LegalDocument.tsx` |
| Internal link | `src/components/Custom/LocaleLink.tsx` |
| Language menu | `src/components/Custom/LanguageSwitcher.tsx` |

Keep landing-only components next to the route. Promote one only after it has a
real cross-route consumer.

**Use `LocaleLink`, not `next/link`, for every internal marketing link.** A raw
`<Link href="/about">` renders and navigates perfectly well; it just drops a
Russian reader onto the English page, and then that is the URL they share.
`next/link` is correct only for `appHref()` destinations and `mailto:`.

## Interaction and responsiveness

- The bar carries four items: two home-page sections and the two pages a visitor
  evaluating Dwelve actually opens. Desktop (`lg`) shows them with a moving
  underline. It marks the
  active *section* on the home page (scroll-spy) and the active *page*
  everywhere else, so the same indicator means one thing.
- Section items in the bar are buttons on the home page (they scroll) and links
  elsewhere (`/#features` navigates home and lands on the section).
- Below `lg` the bar collapses into a disclosure sheet. This replaces the
  earlier "brand plus sign-up only" decision, which was defensible while the
  site was one page and became a dead end at seven: a phone reader on `/terms`
  had no route to `/pricing` except the footer.
- The mobile sheet's open state is keyed to the current path rather than held as
  a boolean, so a navigation closes it within the same render instead of via an
  effect that lets the new page paint once with the sheet still over it.
- Layouts progressively move from stacked to multi-column at `sm`/`lg`.
- Motion components use `useReducedMotion`; CSS motion must also honor
  `prefers-reduced-motion`.
- Interactive controls need visible hover, focus, active, disabled, and busy
  states without shifting layout.

## Internationalization

Language is part of the URL. Client components read copy through
`useTranslation()`; server components read it through `tServer` /
`tListServer` / `tLegalSectionsServer` in `src/i18n/server.ts`. Add every new key
to `src/i18n/messages/en.ts`, `ru.ts`, and `uz.ts` in the same change.

`<html lang>` is correct from the first byte — it is not corrected after
hydration any more. See [`../web/SEO_AND_ROUTES.md`](../web/SEO_AND_ROUTES.md)
for the routing and metadata half of this.

One component cannot use `useTranslation()`: `app/global-not-found.tsx` renders
outside every layout, so `Providers` — and therefore the i18next instance — does
not exist there. It reads the catalogs with `tServer` instead. Any future
component that can render outside the provider tree has the same constraint.

Client copy comes from a **per-language** instance supplied by `I18nextProvider`.
Never call `i18n.changeLanguage()`: it notifies every mounted `useTranslation`
synchronously, and the instance is also shared across server requests. Switching
language is a navigation, not a state change.

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
