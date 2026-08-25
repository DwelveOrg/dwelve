# Uzbek Okina Renders Wide

## Context

Uzbek Latin copy throughout the site (`Oʻzbekcha`, `oʻquvchi`, `yoʻq`) uses U+02BB MODIFIER LETTER
TURNED COMMA, which is the linguistically correct okina and was chosen deliberately — there is a
commit named "Use the correct Uzbek okina in the uz catalog".

## Knowledge

In IBM Plex Sans that character renders almost as wide as a lowercase `o` (10.8px versus 10.08px at
16px), so `oʻq` reads visually as `o ʻ q`. This is **not** a missing glyph or a font fallback:
`document.fonts.check` confirms the loaded face covers U+02BB (it sits in Google Fonts' standard
`latin` unicode-range, `U+2BB-2BC`), and the width comes from the glyph's own sidebearings as a
spacing modifier letter.

It affects every Uzbek string on the site, including copy that predates any recent work, so seeing it
on a new page is not evidence that the new page introduced it.

## Relevant files

- `src/i18n/messages/uz.ts`
- `src/app/[lang]/layout.tsx` (font configuration)

## Implications

Do not "fix" this by silently switching the catalog to `'` or `‘` — that overrides a deliberate
linguistic decision. The options are to keep it, or to add a narrow-okina face ahead of IBM Plex Sans
with `unicode-range: U+02BB-02BC`. Either is a call for the product owner, not a drive-by edit.

## Related memories

- [[Localized url routing]]
