"use client";

import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";

import { getI18n } from "@/i18n";
import type { AppLanguage } from "@/i18n/resources";
import QueryProvider from "@/lib/query/QueryProvider";

/**
 * `lang` comes from the URL, through the root layout.
 *
 * `getI18n(lang)` is called straight from the render body — no `useState`, no
 * effect. It returns the instance *for that language*, so there is nothing to
 * mutate and nothing to synchronise: the first render is already in the right
 * language on both the server and the client, which is what keeps hydration
 * quiet on `/ru` and `/uz`.
 *
 * Both of the obvious alternatives are bugs, and both were shipped before this:
 * a `useState` initialiser that calls `changeLanguage` updates every mounted
 * `useTranslation` during render, and doing it in an effect renders one frame in
 * the wrong language. `src/i18n/index.ts` has the full account.
 *
 * There is no stored language preference. It used to live in `localStorage` and
 * override whatever the server sent, which is unworkable now that the language
 * is part of the URL — it would let one URL show two different contents and
 * quietly contradict the page's own `canonical`/`hreflang`. The URL is the
 * preference; `LanguageSwitcher` changes it by loading the other URL.
 */
export default function Providers({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: AppLanguage;
}) {
  const instance = getI18n(lang);

  return (
    <I18nextProvider i18n={instance}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        storageKey="dwelve-theme"
        // Without this, next-themes leaves the body's colour transition running
        // during a theme swap, so every surface cross-fades one at a time and the
        // flip reads as a smear rather than a switch.
        disableTransitionOnChange
      >
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
