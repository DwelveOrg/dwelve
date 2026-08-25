# Persistent Agent Memory

This directory stores non-obvious decisions, discoveries, and gotchas worth carrying between tasks.
Current system behavior belongs in `/docs`; temporary task status belongs in issues or handoff notes,
not permanent memory.

## Index

### Decisions

- [[Marketing application split]] — why this repository owns only public/indexable routes
- [[Localized url routing]] — why every route lives under `[lang]` and English is unprefixed
- [[Hero backdrop is product metaphor]] — the one backdrop the anti-decoration rule permits, and its measured limits

### Discoveries

- [[Application residue after split]] — active marketing code versus stranded application code

### Gotchas

- [[Indexable route registration]] — the files that must agree for a new public route
- [[Uzbek okina renders wide]] — U+02BB is wide in IBM Plex Sans; it is not a missing glyph
- [[Not found under a dynamic root]] — why the 404 needs `global-not-found.tsx`, and how it fails silently
- [[I18n instance per language]] — never `changeLanguage()` during render, and never share one instance across server requests

## Maintenance

Search by task domain before editing, then read relevant linked notes and inspect current code.
Prefer updating a note to creating another. Memories should contain one durable subject and must not
contain secrets, personal information, command logs, speculative architecture, or stale progress.

Source priority: executable code; current configuration; `AGENTS.md`; `/docs`; memory; historical
comments and task notes. Investigate conflicts rather than deleting whichever source is inconvenient.
