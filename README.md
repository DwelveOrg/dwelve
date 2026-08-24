# Dwelve Marketing Site

The public, indexable site for Dwelve. It serves the marketing experience on
`dwelve.uz` and links into the separate authenticated application on
`app.dwelve.uz`.

Start with:

- [`AGENTS.md`](AGENTS.md) — repository operating rules
- [`docs/README.md`](docs/README.md) — context router and documentation map
- [`PRODUCT.md`](PRODUCT.md) — product and marketing scope
- [`.agent-memory/README.md`](.agent-memory/README.md) — durable memory policy

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. `NEXT_PUBLIC_APP_URL` is optional; set it to a
local app origin only when running the separate product repository alongside
this site. Without it, CTAs target `https://app.dwelve.uz`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run check:contrast
npm run build
```

There is no configured first-party test suite. Browser verification is required
for meaningful UI, responsive, accessibility, language, SEO, or redirect work.
