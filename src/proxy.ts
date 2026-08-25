import { NextRequest, NextResponse } from "next/server";

import { defaultLanguage } from "./i18n/resources";
import { APP_URL } from "./lib/hosts";
import {
    LANGUAGE_EXEMPT_PATHS,
    PRIVATE_ROUTE_PREFIXES,
    splitLanguagePrefix,
} from "./lib/seo-routes";

/**
 * Two jobs, in this order.
 *
 * **1. Old application URLs leave.** This deployment serves only the marketing
 * site. Every application URL — the signed-in product, the auth screens, the
 * invite-token workflow — lives on the app origin (`DwelveOrg/app`,
 * app.dwelve.uz), and requests for them here are old bookmarks or emailed links
 * (invites, password resets): 308 keeps method and body and keeps those links
 * alive forever. The prefix list is shared with robots.txt, which disallows
 * exactly what is redirected. There is no session handling in this repository.
 *
 * **2. Everything else gets a language.** The site renders from `app/[lang]`,
 * but English is published unprefixed — `/pricing`, not `/en/pricing` — because
 * a default locale that carries a prefix splits every inbound link and every
 * existing ranking across two URLs. So:
 *
 *   `/pricing`     → rewritten to `/en/pricing`; the address bar keeps `/pricing`
 *   `/ru/pricing`  → passes through untouched
 *   `/en/pricing`  → 308 to `/pricing`, so the prefixed form cannot become a
 *                    second indexable copy of the English page
 *
 * A rewrite rather than a redirect for the first case: a redirect would put the
 * prefix in the address bar, which is the outcome being avoided.
 *
 * The language check runs on the path *with any prefix stripped*, so `/ru/login`
 * is recognised as the application URL it is and redirects to `/login` on the
 * app — the product has no localized URLs, and sending someone to `/ru/login`
 * there would 404.
 */
export default function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if ((LANGUAGE_EXEMPT_PATHS as readonly string[]).includes(path)) {
        return NextResponse.next();
    }

    const { lang, rest, hadPrefix } = splitLanguagePrefix(path);

    const isAppRoute = PRIVATE_ROUTE_PREFIXES.some(
        (route) => rest === route || rest.startsWith(route.endsWith('/') ? route : `${route}/`),
    );

    if (isAppRoute) {
        return NextResponse.redirect(
            new URL(`${rest}${req.nextUrl.search}`, APP_URL),
            308,
        );
    }

    // `/en/...` is a duplicate of the unprefixed English URL. Collapse it before
    // a crawler can index both.
    if (hadPrefix && lang === defaultLanguage) {
        const url = req.nextUrl.clone();
        url.pathname = rest === "/" ? "/" : rest;
        return NextResponse.redirect(url, 308);
    }

    if (hadPrefix) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLanguage}${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
}

/**
 * Skip the proxy for static assets and Next internals so the language rewrite
 * and the redirect check only run on real navigations. `_next/data` matters as
 * much as `_next/static` here: rewriting a client-navigation payload request
 * would hand React a tree for the wrong route.
 */
export const config = {
    matcher: ["/((?!_next/static|_next/image|_next/data|favicon.ico|logo|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)"],
};
