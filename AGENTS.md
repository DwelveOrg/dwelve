# Dwelve Marketing Site — Agent Guide

This repository is the public, indexable Dwelve marketing site. Read this file
before meaningful work, then use [`docs/README.md`](docs/README.md) to load only
the domain context the task needs.

## Project identity

Dwelve is an academic testing and performance platform for schools and learning
centers. This repository explains that product and routes visitors into the
separate authenticated application. It serves `dwelve.uz`; the product app is
`DwelveOrg/app` on `app.dwelve.uz`.

Current state: one production-oriented, trilingual landing page. There is no
authentication, product dashboard, database, or supported backend API flow in
this repository. Application-era code remains in a few shared folders; do not
mistake residue for an active feature.

## Technology stack

- Next.js 16 App Router, React 19, strict TypeScript
- Tailwind CSS 4 with CSS tokens in `src/app/globals.css`
- i18next/react-i18next for English, Russian, and Uzbek Latin
- Motion for interaction/section motion; Three.js for the hero scene
- next-themes for class-based light/dark mode
- Vercel is the documented hosting target
- ESLint, TypeScript, production build, and the custom contrast checker are the
  available quality gates; no first-party test runner is configured

Verify versions in `package.json` before dependency-specific work. Next.js 16
differs from older training knowledge; consult the installed Next documentation
when changing framework behavior.

## Repository map

```text
src/app/(landing)/       -> landing route, sections, and local components
src/app/layout.tsx       -> fonts, metadata defaults, global providers
src/app/robots.ts        -> marketing crawl policy
src/app/sitemap.ts       -> explicit indexable route list
src/proxy.ts             -> legacy application-route redirects
src/lib/hosts.ts         -> app origin and appHref()
src/lib/seo*.ts          -> canonical origin, metadata constants, route registry
src/i18n/messages/       -> en/ru/uz catalogs
src/components/ui/       -> shared primitives; only a subset is active here
public/logo/             -> canonical brand and social assets
docs/                    -> stable marketing-site knowledge
.agent-memory/           -> durable decisions, discoveries, and gotchas
```

## Critical engineering rules

- Marketing pages and indexable content belong here. Authentication, sessions,
  dashboards, studio, exams, invites, and school workflows belong in `app`.
- Send every application CTA through `appHref()`; do not hard-code a second app
  origin.
- Register a new public route in `PUBLIC_INDEXABLE_ROUTES` and review metadata,
  sitemap, robots, canonical URL, and redirects together.
- Keep `PRIVATE_ROUTE_PREFIXES`, `src/proxy.ts`, and `robots.ts` aligned. Legacy
  application links must preserve path and query when redirected.
- Reuse `Button`, `Surface`, `DwelveLogo`, section helpers, and existing tokens.
  Do not invent one-off colors, fonts, spacing scales, or shadows.
- New user-facing copy must be added to all three catalogs. Verify Russian
  Cyrillic and Uzbek Latin rendering at realistic widths.
- Preserve reduced-motion behavior and keyboard/focus behavior.
- `NEXT_PUBLIC_*` values are browser-visible. Never place secrets in them or in
  documentation.
- Do not revive unused application-era helpers or dependencies without a real
  marketing requirement and a documentation update.

## Default agent loop

For every non-trivial task:

1. Read this file.
2. Identify the affected domain in [`docs/README.md`](docs/README.md).
3. Search `.agent-memory/` for related decisions or gotchas.
4. Inspect the current implementation and its imports; residue is not proof of
   active architecture.
5. Write a short plan and identify likely files before editing.
6. Implement within scope, reusing established components and tokens.
7. Verify the affected behavior and review the diff.
8. Update `/docs` when stable behavior changes.
9. Update memory only for non-obvious knowledge worth rediscovering.

## Verification before completion

Run what applies:

```bash
npm run lint
npx tsc --noEmit
npm run check:contrast
npm run build
git diff --check
```

For UI or routing work also verify the affected page in a browser, responsive
widths, keyboard navigation, reduced motion, all three languages, metadata, and
redirect behavior. Never claim a change works only because code was written.

## Documentation responsibility

> When implementation changes stable project behavior, update the relevant
> `/docs` source of truth in the same task.

> When you discover a non-obvious fact, decision, limitation, recurring bug, or
> important gotcha that future agents may otherwise rediscover, write or update
> a persistent memory note.

Keep temporary plans, command logs, and in-progress status out of `/docs` and
`.agent-memory/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing framework-sensitive code and heed
deprecation notices.

This block is managed by `next dev`; removing it only causes it to be restored.

<!-- END:nextjs-agent-rules -->
