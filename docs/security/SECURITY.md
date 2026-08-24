# Marketing Security

## Trust boundary

The marketing site handles public content and client preferences only. It has
no login, session cookie, supported backend request, database, upload, or
authorization path. Authentication and product data belong to `DwelveOrg/app`
and the NestJS API.

## Response protections

`next.config.ts` applies CSP, HSTS, frame denial, MIME-sniff prevention,
referrer policy, opener policy, and a restrictive permissions policy. Images
are restricted to same-origin/data/blob/HTTPS; remote Next Image patterns are
empty.

The CSP currently permits inline scripts and styles, and still lists Google
Identity origins although no active marketing auth flow uses them. Treat that
as inherited compatibility, not permission to inject HTML. React escaping and
the absence of raw user HTML remain important.

## Cross-host safety

- `NEXT_PUBLIC_APP_URL` is public build output, never a secret.
- Application links use `appHref()`.
- Redirect targets come from the configured app origin plus the original path
  and query; do not accept a request-controlled target origin.
- Keep `frame-ancestors 'none'`/`X-Frame-Options: DENY` intact.

## Secrets and data

- Do not commit `.env`, `.env.local`, credentials, tokens, or private user data.
- `.env.example` contains names/placeholders only.
- Do not add product API calls or collect personal data without explicitly
  designing the server-side trust boundary, validation, consent, retention,
  failure handling, and documentation.

## Known gaps

- CSP is static and includes `'unsafe-inline'`; there is no nonce-based policy.
- No error-monitoring or security-reporting service is configured.
- Preview-host crawl protection is not verifiable from repository code alone.
