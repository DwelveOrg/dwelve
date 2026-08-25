"use client";

import Link from "next/link";
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
 * These are plain `<a>` navigations (`prefetch={false}`): a client-side
 * transition would keep the old `<html lang>` until React reconciled, and the
 * whole point is that the document's language is correct from the first byte.
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
              <Link
                href={localizedPath(pathname, lang)}
                hrefLang={LANGUAGE_TAGS[lang]}
                lang={LANGUAGE_TAGS[lang]}
                prefetch={false}
                aria-current={isCurrent ? "true" : undefined}
                className="flex w-full items-center justify-between gap-3"
              >
                {LANGUAGE_ENDONYMS[lang]}
                {isCurrent ? <Check aria-hidden className="size-4 text-primary" /> : null}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
