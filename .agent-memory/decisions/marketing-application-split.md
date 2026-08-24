# Marketing Application Split

## Context

The original repository combined public marketing pages with authentication and the product. Those
surfaces require opposite indexing/caching policies and now deploy independently.

## Knowledge

This repository owns the public, indexable `dwelve.uz` marketing site. The sibling `app` repository
owns the authenticated, always-noindex product at `app.dwelve.uz`. Marketing CTAs use `appHref()`;
old application paths received on the marketing host redirect permanently to the app with path and
query preserved.

## Relevant files

- `src/lib/hosts.ts`
- `src/lib/seo-routes.ts`
- `src/proxy.ts`
- `docs/architecture/DOMAINS.md`
- `../app/docs/architecture/DOMAINS.md`

## Implications

Do not rebuild sessions, dashboards, studio, exam, invite, or school workflows here. Do not put
public SEO pages in the app repository. A feature spanning both hosts needs coordinated links and
documentation but remains two deployments.

## Related memories

- [[Application residue after split]]
- [[Indexable route registration]]
