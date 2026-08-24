# Application Residue After Split

## Context

The marketing/application split removed active product routes but did not fully prune their shared
dependency graph.

## Knowledge

The only page route is `src/app/(landing)/page.tsx`. Authentication helpers, React Query provider
plumbing, many UI components, translation namespaces, packages, CSS tokens, and CI environment
values remain from the former combined application. Presence in `src`, a catalog, or `package.json`
does not prove a supported marketing capability; trace reachability from the landing route before
reusing it.

The old application documentation was removed from this repository because byte-identical/current
copies belong in `../app/docs` and the pre-split files remain in Git history.

## Relevant files

- `src/app/(landing)/page.tsx`
- `src/app/providers.tsx`
- `src/i18n/messages/`
- `package.json`
- `.github/workflows/ci.yml`

## Implications

Do not document or revive residue as active architecture. Pruning it is a separate, behavior-sensitive
cleanup: establish the route dependency graph and run a production build before deleting anything.

## Related memories

- [[Marketing application split]]
