# Marketing and Application Domains

Dwelve is split into two independent repositories and deployments.

| Repository | Host | Responsibility | Indexing |
|---|---|---|---|
| `DwelveOrg/frontend` (this repo) | `dwelve.uz` | Marketing pages, robots allow-rules, sitemap | Public/indexable |
| `DwelveOrg/app` | `app.dwelve.uz` | Auth, dashboard, studio, exam, invites | Always noindex |

The split was committed on 2026-08-24. Do not add application features here or
marketing pages to the application repository.

## Links into the app

`APP_URL` in `src/lib/hosts.ts` defaults to `https://app.dwelve.uz` and may be
overridden at build time with public `NEXT_PUBLIC_APP_URL`. All login/signup and
future application CTAs must use `appHref()` so the origin has one owner.

## Old application links

`src/proxy.ts` checks `PRIVATE_ROUTE_PREFIXES` from `src/lib/seo-routes.ts` and
returns a permanent 308 to the app origin. It preserves the path and query, so
old bookmarks, password-reset links, and invitation links remain usable. The
same prefixes are disallowed in `robots.ts`.

`next.config.ts` also contains compatibility redirects for retired `/settings`
paths and canonical-host redirects from `www.dwelve.uz` and
`dwelve.vercel.app`. Next config redirects run before the proxy.

## Deployment expectations

The documented target is a Vercel project serving `dwelve.uz` and
`www.dwelve.uz`. The app must be available at its configured origin before the
marketing deployment begins redirecting old application URLs there.

Preview-environment indexing behavior is platform-owned and **needs
verification** in the deployed project; repository code defines the production
marketing crawl policy but does not inspect preview hosts.
