# Persistent Agent Memory

This directory stores non-obvious decisions, discoveries, and gotchas worth carrying between tasks.
Current system behavior belongs in `/docs`; temporary task status belongs in issues or handoff notes,
not permanent memory.

## Index

### Decisions

- [[Marketing application split]] — why this repository owns only public/indexable routes
- [[Localized url routing]] — why every route lives under `[lang]` and English is unprefixed
- [[Hero backdrop is product metaphor]] — the one backdrop the anti-decoration rule permits, and its measured limits
- [[Hero is a full viewport scene]] — what the entry-scene rebuild took from the reference site, and what it refused
- [[Section sheets are the ambient layer]] — the muted bands carry product-figure backdrops; flats stay bare ground

### Discoveries

- [[Application residue after split]] — active marketing code versus stranded application code

### Gotchas

- [[Indexable route registration]] — the files that must agree for a new public route
- [[Uzbek okina renders wide]] — U+02BB is wide in IBM Plex Sans; it is not a missing glyph
- [[Not found under a dynamic root]] — why the 404 needs `global-not-found.tsx`, and how it fails silently
- [[I18n instance per language]] — never `changeLanguage()` during render, and never share one instance across server requests
- [[Tailwind calc needs spaced operators]] — `calc(100svh-var(...))` is not a subtraction, and it fails silently
- [[Headless capture misses late animation]] — `--virtual-time-budget` does not buy real time; the pane never animates at all
- [[Svg backdrop sizing and pathlength]] — inset alone does not size an absolute svg, and `pathLength` breaks under non-scaling-stroke

## Maintenance

Search by task domain before editing, then read relevant linked notes and inspect current code.
Prefer updating a note to creating another. Memories should contain one durable subject and must not
contain secrets, personal information, command logs, speculative architecture, or stale progress.

Source priority: executable code; current configuration; `AGENTS.md`; `/docs`; memory; historical
comments and task notes. Investigate conflicts rather than deleting whichever source is inconvenient.
