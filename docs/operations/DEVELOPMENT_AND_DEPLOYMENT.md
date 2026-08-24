# Development, Quality, and Deployment

## Prerequisites and setup

- Node.js `>=22.13.0` (from `package.json`)
- npm and the committed `package-lock.json`

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The site runs on `http://localhost:3000`. To test local cross-repository CTAs,
run the application separately and set `NEXT_PUBLIC_APP_URL` to its origin.

## Environment

| Variable | Purpose | Required | Exposure |
|---|---|---:|---|
| `NEXT_PUBLIC_APP_URL` | Override login/signup/redirect application origin | No; defaults to `https://app.dwelve.uz` | Browser-visible, build-time |

No server secret is required by current marketing code. Application-era API,
session, Google, and support variables do not belong in this deployment.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Turbopack development server |
| `npm run dev:webpack` | Webpack development fallback |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check (used in CI, no package alias) |
| `npm run check:contrast` | Validate design-token contrast/palette constraints |
| `npm run build` | Webpack production build |
| `npm run start` | Serve the built app |

No first-party `test` script or browser automation is configured. Meaningful
changes require manual browser verification in addition to the static gates.

## CI

`.github/workflows/ci.yml` runs install, lint, typecheck, contrast, build, and a
high-severity npm audit on pushes and pull requests. CodeQL scans JavaScript and
TypeScript on main/pull requests and weekly.

The CI workflow still supplies app-era API/session environment values; current
marketing code does not consume them. Removing that residue is a separate
configuration cleanup, not required to understand runtime behavior.

## Deployment

Verified repository intent: Vercel hosts `dwelve.uz`, canonicalizes `www` and
the legacy Vercel hostname, and builds this Next app. DNS ownership, exact
deployment triggers, preview indexing controls, rollback procedure, and project
environment values are outside the repository and **need verification**.

Before release:

1. run lint, typecheck, contrast, and build;
2. test `/`, `/robots.txt`, `/sitemap.xml`, 404, app CTAs, and one legacy app URL;
3. verify mobile/desktop, dark/light, reduced motion, and en/ru/uz;
4. inspect metadata and structured data in production output;
5. review the final diff and confirm no local environment file is tracked.
