"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import DwelveLogo from "@/components/Custom/DwelveLogo";
import LanguageSwitcher from "@/components/Custom/LanguageSwitcher";
import LocaleLink from "@/components/Custom/LocaleLink";
import Button from "@/components/ui/Button";
import { appHref } from "@/lib/hosts";
import { useUnprefixedPathname } from "@/lib/routing";
import { cn } from "@/lib/utils";

/**
 * The bar carries two kinds of destination now, and they behave differently.
 *
 * A `section` item is a place on the home page. From the home page it scrolls;
 * from `/pricing` it has to navigate home *and* land on the section, which is
 * what the `/#id` href does — so the same item is a button on one page and a
 * link on six others.
 *
 * A `page` item is a route. It is always a link, and it is active when the
 * reader is on it.
 *
 * Four items, chosen rather than accumulated: the product story (drafting,
 * features) and the two pages a visitor evaluating Dwelve actually opens.
 * Analytics, the FAQ and Contact are one scroll or one footer away and were
 * making the bar unreadable at Russian text lengths.
 */
type NavItem =
  | { kind: "section"; key: string; target: string }
  | { kind: "page"; key: string; href: string };

const NAV_ITEMS: readonly NavItem[] = [
  { kind: "section", key: "landing.nav.aiDrafting", target: "ai-generation" },
  { kind: "section", key: "landing.nav.features", target: "features" },
  { kind: "page", key: "landing.nav.pricing", href: "/pricing" },
  { kind: "page", key: "landing.nav.about", href: "/about" },
];

/** Stable reference for the scroll-spy observer (must not be re-created each render). */
const SECTION_IDS = NAV_ITEMS.flatMap((item) => (item.kind === "section" ? [item.target] : []));

/** True once the page leaves the hero edge — fades in a hairline divider under the bar. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * Scroll-spy: returns the id of the section currently crossing the viewport's
 * centre band, or null.
 *
 * `enabled` is false away from the home page, where none of the sections exist.
 * The disabled case is handled by *deriving* the return value rather than by
 * clearing state in the effect: the effect never observes anything, so whatever
 * the last home-page value was would otherwise sit in state and light up a nav
 * item on `/pricing` for one frame.
 */
function useActiveSection(targets: readonly string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // First visible section in document order, so the indicator never flickers
        // between two sections that briefly share the band.
        setActive(targets.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    const els = targets
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [targets, enabled]);

  return enabled ? active : null;
}

const NAV_LINK_CLASS =
  "relative cursor-pointer py-1 text-sm font-medium tracking-tight outline-none transition-colors focus-visible:text-foreground";

export default function Navbar() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const scrolled = useScrolled();
  const pathname = useUnprefixedPathname();
  const isHome = pathname === "/";
  const active = useActiveSection(SECTION_IDS, isHome);
  const menuId = useId();

  /*
   * The sheet's open state is stored as *which page it was opened on*, not as a
   * boolean.
   *
   * Leaving a mobile menu open across a navigation is the classic bug in this
   * component, and the usual fix is `useEffect(() => setMenuOpen(false), [pathname])`
   * — a state update in an effect, so the new page renders once with the sheet
   * still over it and then again without. Keying the state to the path means a
   * navigation closes it as part of the same render, with no effect at all.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const menuOpen = openedOn === pathname;
  const setMenuOpen = useCallback(
    (open: boolean) => setOpenedOn(open ? pathname : null),
    [pathname],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    },
    [reduceMotion],
  );

  // Escape closes it, and the body must not scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, setMenuOpen]);

  const underlineTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 38 };

  const isItemActive = (item: NavItem) =>
    item.kind === "section" ? isHome && active === item.target : pathname === item.href;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled || menuOpen
            ? "border-border/60 bg-background/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex min-h-[var(--header-h)] w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Brand mark */}
          <div className="flex items-center justify-self-start">
            <LocaleLink
              href="/"
              aria-label={t("landing.footer.home")}
              className="rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <DwelveLogo variant="form" />
            </LocaleLink>
          </div>

          {/* Section and page links — collapsed into the sheet below `lg`. */}
          <nav className="hidden lg:flex lg:justify-center" aria-label={t("landing.nav.primary")}>
            <LayoutGroup>
              <ul className="flex items-center gap-7">
                {NAV_ITEMS.map((item) => {
                  const isActive = isItemActive(item);
                  const underline = isActive ? (
                    <motion.span
                      layoutId="landing-nav-underline"
                      transition={underlineTransition}
                      className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                    />
                  ) : null;
                  const tone = isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground";

                  return (
                    <li key={item.key}>
                      {item.kind === "section" && isHome ? (
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.target)}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(NAV_LINK_CLASS, tone)}
                        >
                          {t(item.key)}
                          {underline}
                        </button>
                      ) : (
                        <LocaleLink
                          href={item.kind === "section" ? `/#${item.target}` : item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(NAV_LINK_CLASS, tone)}
                        >
                          {t(item.key)}
                          {underline}
                        </LocaleLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-self-end gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button asChild variant="outline" size="lg" className="hidden sm:inline-flex">
              <Link href={appHref("/login")}>{t("landing.nav.login")}</Link>
            </Button>
            <Button asChild variant="brand" size="lg">
              <Link href={appHref("/signup")}>{t("landing.nav.signup")}</Link>
            </Button>

            {/*
              A mobile menu exists now because the site does. While this was one
              page, "brand plus sign-up" was a defensible bar: everything else was
              below the fold of the page you were already on. With seven pages, a
              phone reader on /terms had no route to /pricing that did not go
              through the footer.
            */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={t(menuOpen ? "landing.nav.closeMenu" : "landing.nav.openMenu")}
              className="interactive inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 lg:hidden"
            >
              {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id={menuId}
            aria-label={t("landing.nav.primary")}
            className="border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <LocaleLink
                    href={item.kind === "section" ? `/#${item.target}` : item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-3 text-base font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                      isItemActive(item) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(item.key)}
                  </LocaleLink>
                </li>
              ))}
              <li className="border-t border-border/60 pt-2 sm:hidden">
                <Link
                  href={appHref("/login")}
                  className="block rounded-md px-2 py-3 text-base font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {t("landing.nav.login")}
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
