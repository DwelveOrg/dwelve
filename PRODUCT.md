# Dwelve Marketing Product

## Purpose

This site explains Dwelve: a platform that helps schools and learning centers
create, deliver, grade, and analyze academic tests. Its job is to communicate
the value clearly and move visitors to login or signup in the separate product
application.

## Audience

- school and learning-center administrators evaluating the platform;
- teachers looking to reduce test-authoring and grading work;
- students who need to understand the test-taking experience.

The current copy and interface support English, Russian, and Uzbek Latin.

## Existing experience

The single landing route covers AI-assisted drafting, teacher controls,
features, role-specific value, the operating flow, analytics, common questions,
and final login/signup calls to action. Product UI shown on the page is
illustrative marketing content, not live user data.

## Boundaries

- This repository does not authenticate users or render product workflows.
- Application routes live in `DwelveOrg/app` and are redirected there when old
  links arrive on the marketing host.
- Pricing, help-center, privacy, terms, about, and blog routes do not currently
  exist. The footer does not pretend otherwise; support/legal items use email.

## Brand and interaction direction

Dwelve is structured, academic, modern, and quietly premium. Violet is brand
identity; near-black/near-white ink is the repeated action color. Reuse the
token system in `src/app/globals.css`; color otherwise carries state or data.
IBM Plex Sans is the UI face, IBM Plex Serif is controlled display text, IBM
Plex Mono is for aligned figures, and Manrope 700 is reserved for the wordmark.

See [`docs/ui/UI_SYSTEM.md`](docs/ui/UI_SYSTEM.md) for implementation rules.
