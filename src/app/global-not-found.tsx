import type { Metadata } from "next";
import Link from "next/link";
import { House } from "lucide-react";

import "./globals.css";
import { FONT_VARIABLES } from "./fonts";
import { BRAND_NAME } from "@/constants/brand";
import {
  defaultLanguage,
  LANGUAGE_ENDONYMS,
  LANGUAGE_TAGS,
  supportedLanguages,
} from "@/i18n/resources";
import { tServer } from "@/i18n/server";
import { localizedPath } from "@/lib/seo-routes";
import { cn } from "@/lib/utils";

/**
 * The 404, handled at the routing level.
 *
 * **Why this file and not `not-found.tsx`.** Moving the root layout under
 * `app/[lang]` — which is what makes the language a root parameter — means Next
 * has no single root layout to compose a 404 from. Its own documentation names
 * this case exactly ("Your root layout is defined using top-level dynamic
 * segments") and points here. What happens without it is worse than it looks: a
 * `not-found.tsx` beside a dynamic root layout renders into an `__next_error__`
 * document whose `<body>` is **empty**, with the real content only in the flight
 * payload. The status code and `noindex` are right, JS hydrates it in a moment,
 * and nothing is logged — so the page is blank for anyone on a slow connection
 * and nobody finds out for months. That was measured, not assumed.
 *
 * This renders on the server, as real HTML, for every unmatched URL.
 *
 * **The costs, stated plainly.** It bypasses every layout, so it re-imports
 * `globals.css` and the fonts (hence `src/app/fonts.ts` — one declaration, two
 * consumers) and cannot use anything from `providers.tsx`: no i18next, no
 * next-themes, no navbar, no footer. And it takes **no props**, so it cannot know
 * which language the reader wanted. It is written in the default language and
 * offers all three home links instead of guessing — which is also the more
 * useful answer for the traffic a 404 actually gets: mistyped URLs and dead
 * external links, where the visitor's language is unknown anyway.
 *
 * `experimental.globalNotFound` in `next.config.ts` enables it. If that flag is
 * ever dropped, the fallback is Next's built-in 404 page — degraded, not broken.
 */

export const metadata: Metadata = {
  title: `${tServer(defaultLanguage, "root.notFound.title")} | ${BRAND_NAME}`,
  description: tServer(defaultLanguage, "root.notFound.description"),
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  const t = (key: string) => tServer(defaultLanguage, key);

  return (
    <html lang={LANGUAGE_TAGS[defaultLanguage]} className={cn("font-sans", ...FONT_VARIABLES)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <p className="type-micro text-primary">404</p>

          <h1 className="mt-4 max-w-3xl text-balance text-[clamp(2.1rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.02em] text-foreground">
            {t("root.notFound.title")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("root.notFound.description")}
          </p>

          {/*
            Not a `Button`: that component is a client component, and a page that
            renders outside every provider should not be the one place that
            discovers a client boundary is unavailable. The classes are the
            `brand`/`xl` recipe, kept in step with `Button.tsx` by hand.
          */}
          <div className="mt-9 flex justify-center">
            <Link
              href={localizedPath("/", defaultLanguage)}
              className="inline-flex h-12 items-center gap-2 rounded-md border border-transparent bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-elev-1 outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <House aria-hidden className="size-4" />
              {t("root.notFound.home")}
            </Link>
          </div>

          {/* The language the reader wanted is unknowable here, so offer all three
              rather than stranding two thirds of the audience on an English page. */}
          <nav aria-label={t("language.label")} className="mt-12 w-full max-w-2xl border-t border-border/60 pt-8">
            <p className="type-micro text-muted-foreground">{t("language.label")}</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {supportedLanguages.map((language) => (
                <li key={language}>
                  <Link
                    href={localizedPath("/", language)}
                    hrefLang={LANGUAGE_TAGS[language]}
                    lang={LANGUAGE_TAGS[language]}
                    className="rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {LANGUAGE_ENDONYMS[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </body>
    </html>
  );
}
