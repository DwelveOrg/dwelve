"use client";

import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LANGUAGE_ENDONYMS,
  LANGUAGE_TAGS,
  supportedLanguages,
} from "@/i18n/resources";
import { useLanguage, useUnprefixedPathname } from "@/lib/routing";
import { localizedPath } from "@/lib/seo-routes";
import { cn } from "@/lib/utils";

/**
 * The language menu — and the only way to change language on the site.
 *
 * Three things it deliberately does:
 *
 *   1. **Navigates, rather than swapping strings in place.** Language is part of
 *      the URL now, so switching it is a navigation. This also means the reader
 *      can bookmark and share the Russian page as the Russian page.
 *   2. **Stays on the page you are reading.** It rebuilds the *current* path in
 *      the target language rather than sending everyone to the home page, which
 *      is what makes it usable from the middle of the terms of service.
 *   3. **Names each language in that language.** A reader looking for Russian is
 *      scanning for "Русский", not for the word "Russian" written in a language
 *      they are trying to leave. `hrefLang` and `lang` are set per item so
 *      assistive technology switches voice on the label instead of reading
 *      Cyrillic through an English pronunciation model.
 *
 * These are plain `<a>` elements, not `next/link`, and that is load-bearing
 * rather than an oversight.
 *
 * A client-side transition keeps the live i18next instance and the mounted tree
 * and asks them to become Russian in place. That is how this shipped, and it
 * threw on the first switch: the instance is created in a `useState`
 * initialiser, so the `changeLanguage()` it triggered ran during `Providers`'
 * render, and `languageChanged` fires synchronously — so every `useTranslation`
 * still mounted from the previous page called `setState` mid-render. React's
 * "Cannot update a component while rendering a different component".
 *
 * A full document load sidesteps the whole class of problem. Language is a
 * property of the document, not of a component: `<html lang>`, the metadata, the
 * canonical, the `hreflang` set and the i18next instance all have to change
 * together, and every one of them is already correct in the server's response
 * for the target URL. Every page here is prerendered, so the reload is cheap.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const current = useLanguage();
  const pathname = useUnprefixedPathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language.label")}
        className={cn(
          "interactive inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-transparent px-2.5 text-sm font-medium text-muted-foreground outline-none",
          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
          className,
        )}
      >
        <Languages aria-hidden className="size-4" />
        <span className="uppercase">{current}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel className="type-micro text-muted-foreground">
          {t("language.label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((lang) => {
          const isCurrent = lang === current;
          return (
            <DropdownMenuItem key={lang} asChild>
              <a
                href={localizedPath(pathname, lang)}
                hrefLang={LANGUAGE_TAGS[lang]}
                lang={LANGUAGE_TAGS[lang]}
                aria-current={isCurrent ? "true" : undefined}
                className="flex w-full items-center justify-between gap-3"
              >
                {LANGUAGE_ENDONYMS[lang]}
                {isCurrent ? <Check aria-hidden className="size-4 text-primary" /> : null}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
