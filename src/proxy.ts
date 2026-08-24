import { NextRequest, NextResponse } from "next/server";

import { APP_URL } from "./lib/hosts";
import { PRIVATE_ROUTE_PREFIXES } from "./lib/seo-routes";

/**
 * This deployment serves only the marketing site. Every application URL —
 * the signed-in product, the auth screens, the invite-token workflow — lives
 * on the app origin (`DwelveOrg/app`, app.dwelve.uz), and requests for them
 * here are old bookmarks or emailed links (invites, password resets): 308
 * keeps method and body and keeps those links alive forever.
 *
 * The prefix list is shared with robots.txt, which disallows exactly what is
 * redirected. There is no session handling in this repository at all.
 */
export default function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isAppRoute = PRIVATE_ROUTE_PREFIXES.some(
        (route) => path === route || path.startsWith(route.endsWith('/') ? route : `${route}/`),
    );

    if (isAppRoute) {
        return NextResponse.redirect(
            new URL(`${path}${req.nextUrl.search}`, APP_URL),
            308,
        );
    }

    return NextResponse.next();
}

/**
 * Skip the proxy for static assets and Next internals so the redirect check
 * only runs on real navigations.
 */
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
