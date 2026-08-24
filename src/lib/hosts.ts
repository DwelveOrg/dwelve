/**
 * This repository is the marketing site (`dwelve.uz`) of the two-repo split;
 * the application lives in `DwelveOrg/app` and owns `app.dwelve.uz`. See
 * `docs/architecture/DOMAINS.md`.
 *
 * The application's origin, for the landing CTAs and the proxy's redirects of
 * old application URLs. Overridable so a local run of both repos side by side
 * can point at a local app instance (`NEXT_PUBLIC_APP_URL=http://localhost:3001`).
 * `NEXT_PUBLIC_*` values are inlined at build time.
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.dwelve.uz";

/** Href for links that leave the marketing site for the application. */
export function appHref(path: `/${string}`): string {
  return `${APP_URL}${path}`;
}
