# Dwelve Marketing Documentation

This is the context router for the marketing repository. Read only the pages
needed for the task; application behavior belongs to the separate `app` repo.

## Find context by task

| Task | Read |
|---|---|
| Product purpose, audience, or marketing scope | [`../PRODUCT.md`](../PRODUCT.md) |
| Repository layers, data flow, state, or dependencies | [`architecture/ARCHITECTURE.md`](architecture/ARCHITECTURE.md) |
| Host split, app links, or cross-host redirects | [`architecture/DOMAINS.md`](architecture/DOMAINS.md) |
| Layout, tokens, components, responsiveness, a11y, or i18n | [`ui/UI_SYSTEM.md`](ui/UI_SYSTEM.md) |
| Metadata, structured data, robots, sitemap, or public routes | [`web/SEO_AND_ROUTES.md`](web/SEO_AND_ROUTES.md) |
| CSP, headers, trust boundaries, or security gaps | [`security/SECURITY.md`](security/SECURITY.md) |
| Setup, environment, CI, testing, or deployment | [`operations/DEVELOPMENT_AND_DEPLOYMENT.md`](operations/DEVELOPMENT_AND_DEPLOYMENT.md) |
| A non-obvious decision, discovery, or gotcha | [`../.agent-memory/README.md`](../.agent-memory/README.md) |

## Canonical boundaries

- `/docs` describes what is true about this marketing site now.
- `.agent-memory` records why decisions were made and costly discoveries.
- `AGENTS.md` defines how agents work.
- Temporary task plans and progress do not belong in any of those locations.

The application-era documentation removed from this repo remains preserved in
the authenticated `DwelveOrg/app` repository, where the corresponding code now
lives. Git history also retains the exact pre-split state.

## Source-of-truth order

When sources conflict, investigate in this order:

1. executable code;
2. current configuration;
3. `AGENTS.md`;
4. current `/docs`;
5. persistent memory;
6. old comments, task notes, and history.

Do not automatically erase a documented invariant just because code violates
it; determine whether code or documentation drifted and record the resolution.

## Maintenance

- One canonical owner per topic; cross-link rather than copy.
- Update route/SEO docs with public route or redirect changes.
- Update UI docs with stable token, component, or layout changes.
- Update environment docs and `.env.example` together.
- Label uncertainty as **Needs verification**.
- Never include credentials, tokens, private keys, or real user data.
