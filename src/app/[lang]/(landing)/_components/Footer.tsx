"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

import DwelveLogo from "@/components/Custom/DwelveLogo";
import LanguageSwitcher from "@/components/Custom/LanguageSwitcher";
import LocaleLink from "@/components/Custom/LocaleLink";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/constants/brand";
import { appHref } from "@/lib/hosts";

/**
 * The site footer.
 *
 * It used to be two thin strips — a logo, three links, a copyright — while the
 * `landing.footer` catalog carried a dozen keys nobody rendered. That is the
 * shape a footer takes when it is treated as page furniture: it ends the
 * document without ending the argument, and it leaves someone who scrolled all
 * the way down with nowhere to go but back up.
 *
 * This one is a map, and now it is a map of a site rather than of a page. The
 * Product column still points at the home page's own sections; Company and Legal
 * point at real routes. **Every destination here exists** — a footer link to a
 * 404 is worse than an absent one, which is why `pricing`, `privacy` and `terms`
 * spent a release as `mailto:` links and only became links when the pages did.
 */

type FooterLink = {
  key: string;
  href: string;
  /** The href is already final — an app URL or a mail address. Skips `LocaleLink`. */
  raw?: boolean;
};

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "landing.footer.product",
    links: [
      // Nav keys throughout, not the `footer.*` twins: `footer.howItWorks` is
      // title case ("How It Works") while every other label on this page is
      // sentence case, and a column that mixes the two reads as a typo.
      { key: "landing.nav.aiDrafting", href: "/#ai-generation" },
      { key: "landing.nav.features", href: "/#features" },
      { key: "landing.nav.howItWorks", href: "/#how-it-works" },
      { key: "landing.nav.analytics", href: "/#analytics" },
      { key: "landing.nav.accordion", href: "/#accordion" },
    ],
  },
  {
    title: "landing.footer.company",
    links: [
      { key: "landing.nav.pricing", href: "/pricing" },
      { key: "landing.nav.about", href: "/about" },
      { key: "landing.nav.contact", href: "/contact" },
    ],
  },
  {
    title: "landing.footer.account",
    links: [
      { key: "landing.nav.login", href: appHref("/login"), raw: true },
      { key: "landing.nav.signup", href: appHref("/signup"), raw: true },
      { key: "landing.footer.privacy", href: "/privacy" },
      { key: "landing.footer.terms", href: "/terms" },
    ],
  },
];

const LINK_CLASS =
  "rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Brand column, then the site's map. The brand column takes the wider
            track because it carries prose; the link columns are lists and want to
            stay narrow enough to scan in one glance. */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <LocaleLink
              href="/"
              aria-label={t("landing.footer.home")}
              className="inline-flex w-fit rounded-md outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <DwelveLogo variant="form" />
            </LocaleLink>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("landing.footer.description")}
            </p>

            {/* A real address rather than a "Contact us" that opens a form: the
                product has no support desk yet, and a mailto is the honest
                version of the promise. */}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Mail aria-hidden className="size-4" />
              {SUPPORT_EMAIL}
            </a>

            {/* The switcher is in the bar too. It is repeated here because the
                footer is where a reader who has finished the page looks for the
                site's own controls, and on a phone the bar is a scroll away. */}
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <h2 className="type-micro text-foreground">{t(column.title)}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.key}>
                    {link.raw ? (
                      <Link href={link.href} className={LINK_CLASS}>
                        {t(link.key)}
                      </Link>
                    ) : (
                      <LocaleLink href={link.href} className={LINK_CLASS}>
                        {t(link.key)}
                      </LocaleLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {`© ${year} ${BRAND_NAME}. ${t("landing.footer.rights")}`}
          </span>
          <span className="text-xs text-muted-foreground">{t("landing.main.badge")}</span>
        </div>
      </div>
    </footer>
  );
}
