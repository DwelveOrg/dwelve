# CLAUDE.md

Guidance for Claude Code when working in this repository.

Read `AGENTS.md` for general repository rules.

**This repository is the marketing site** (`dwelve.uz`) of a two-repo split,
bridgemind.ai-style. The application — auth, dashboard, studio, exam, invites,
sessions — lives in the separate `DwelveOrg/app` repository and owns
`app.dwelve.uz`. This repo is the indexable face of Dwelve: it owns
`robots.txt` and `sitemap.xml`, and `src/proxy.ts` 308-redirects every
application URL family to the app origin so old bookmarks and emailed links
keep working. There is **no session or auth code here**. Application features
are never added to this repository — they go to `DwelveOrg/app`. See
`docs/architecture/DOMAINS.md` before touching hosts, redirects, robots, or
the sitemap.

---

## Project

Dwelve, package name `gf-frontend`, is the Next.js App Router marketing site
for a digital academic testing and performance-management platform for schools
and private learning centers.

Stack:

- Next.js App Router, React, TypeScript strict mode
- Tailwind CSS v4, shadcn/ui primitives in `src/components/ui`
- i18next / react-i18next (en / ru / uz)
- next-themes, motion, three

Verify package versions in `package.json` before making dependency-specific
changes.

---

## Commands

- `npm install` — restore dependencies from `package-lock.json`
- `npm run dev` — local dev server
- `npm run build` — production build and output validation
- `npm run start` — serve production build
- `npm run lint` — ESLint through `eslint.config.mjs`
- `npm run check:contrast` — WCAG gate over the `globals.css` token layer; must pass after any palette change

There is no test script. Validate with `npm run lint`, `npm run build`, and
manual route testing.

---

## Structure

- `src/app/(landing)` — the marketing pages (sections in `_sections`, local
  components in `_components`)
- `src/app/robots.ts`, `src/app/sitemap.ts` — the indexable face; a new
  indexable page must register in `PUBLIC_INDEXABLE_ROUTES`
  (`src/lib/seo-routes.ts`) to enter the sitemap
- `src/proxy.ts` — 308s application URL families (`PRIVATE_ROUTE_PREFIXES`)
  to the app origin; no session handling
- `src/lib/hosts.ts` — `APP_URL` and `appHref()`; every link into the
  application (login/signup CTAs) goes through `appHref()`
- `src/components/ui`, `src/components/Custom` — shared primitives (Button is
  the only button; `DwelveLogo` is the brand mark)
- `src/i18n/messages/{en,ru,uz}.ts` — trilingual catalogs; new UI copy must
  land in all three. Missing keys pass the type-checker and render as raw
  dotted strings — verify at runtime.

Design tokens and rules: `docs/design/design-system.md`,
`src/app/globals.css`. The catalogs and some `docs/` files still carry
application-era content; treat `git history` and the `DwelveOrg/app` repo as
the source of truth for application behaviour.

---

## Conventions

- Type everything; use `@/*` path aliases; PascalCase component files.
- Tailwind classes with `cn` from `@/lib/utils`; tokens over hard-coded hex.
- Dark mode via `next-themes` class strategy.
- Icons use `lucide-react`.
- Short imperative commit messages; PRs note what changed, how tested,
  affected routes, screenshots for UI changes, affected translations.
- Never commit secrets or local env files.
