# Domains: this repository is the marketing site

Dwelve runs the pattern used by products like bridgemind.ai, as **two
repositories**:

| Repo | Host | Serves | Indexable |
|---|---|---|---|
| `DwelveOrg/frontend` (this one) | `dwelve.uz` | Marketing site: landing, future pricing/about/blog | Yes — owns robots allow-rules and `sitemap.xml` |
| `DwelveOrg/app` | `app.dwelve.uz` | Auth, dashboard, studio, exam, invites — the product | Never (robots disallow + `X-Robots-Tag: noindex` there) |

The split was executed on 2026-08-24 at the maintainer's direction. Each repo
is its own Vercel project with its own domain; there is no host sniffing left
in either.

## How this repo behaves

- `src/proxy.ts` 308-redirects every application URL family — the
  `PRIVATE_ROUTE_PREFIXES` list in `src/lib/seo-routes.ts`, which includes
  the auth pages — to the app origin, path and query preserved. That keeps
  every old bookmark and emailed link (teacher invites, password resets)
  working forever. There is no session code in this repository.
- `robots.ts` allows crawling and disallows exactly the redirected families;
  `sitemap.ts` lists `PUBLIC_INDEXABLE_ROUTES`. **A new indexable marketing
  page must register there** to enter the sitemap.
- Links into the application (the landing's login/signup CTAs) go through
  `appHref()` from `src/lib/hosts.ts`. `APP_URL` defaults to
  `https://app.dwelve.uz` and can be overridden with `NEXT_PUBLIC_APP_URL`
  (build-time inlined) — e.g. `http://localhost:3001` when running both
  repos locally side by side.
- `www.dwelve.uz` and `dwelve.vercel.app` 308 to `dwelve.uz` via
  `next.config.ts`, as before.
- Preview deployments stay out of the index through the platform's own
  `X-Robots-Tag` header on preview URLs; nothing host-aware is needed here.

## Deployment expectations

- Vercel project with domains `dwelve.uz` and `www.dwelve.uz`.
- No required env. `SESSION_SECRET` and `DWELVE_API_BASE_URL` are app-repo
  concerns and can be removed from this project once the split is deployed.
- Deploy ordering on the day of the split: the `DwelveOrg/app` project must
  be live on `app.dwelve.uz` **before** this repo's marketing-only build
  reaches production — otherwise dwelve.uz would redirect application URLs
  at a host that is not answering.

## Residue

The i18n catalogs and parts of `docs/` still carry application-era content
(dead keys, feature docs). Harmless; trim opportunistically. Application
behaviour's source of truth is the `DwelveOrg/app` repository and this
repo's git history (the split point is the commit that introduced this
version of the document).
