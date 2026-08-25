"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";

import i18n, { initI18n } from "@/i18n";
import type { AppLanguage } from "@/i18n/resources";
import QueryProvider from "@/lib/query/QueryProvider";

/**
 * `lang` comes from the URL, through the root layout.
 *
 * `initI18n` is called from the `useState` initialiser rather than an effect on
 * purpose: that runs during this component's first render, before any child
 * renders, so the tree's very first output is already in the right language and
 * matches the server's. An effect would run *after* hydration, which is one
 * frame of English on every Russian and Uzbek page and a hydration mismatch on
 * every translated string.
 *
 * There is no stored language preference any more. It used to live in
 * `localStorage` and override whatever the server sent, which is unworkable now
 * that the language is part of the URL — it would let one URL show two different
 * contents and quietly contradict the page's own `canonical`/`hreflang`. The URL
 * is the preference; `LanguageSwitcher` changes it by navigating.
 */
export default function Providers({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: AppLanguage;
}) {
  const [instance] = useState(() => initI18n(lang));

  // Client-side navigation between `/pricing` and `/ru/pricing` remounts nothing
  // above this component, so the initialiser above does not re-run.
  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
  }, [lang]);

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
