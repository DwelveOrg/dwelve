"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkle } from "lucide-react";

import Button from "@/components/ui/Button";
import { appHref } from "@/lib/hosts";
import MarkingStroke from "../_components/MarkingStroke";
import useLineSplit from "../_hooks/useLineSplit";

// Lazy, client-only: the three.js scene is its own chunk and never blocks paint.
// The CSS glow behind it stays visible while it loads and if WebGL is missing.
const HeroScene = dynamic(() => import("../_components/HeroScene"), { ssr: false });

// The scene's ground — a lattice of answer bubbles being marked by a passing
// band of light. Same deal: its own chunk, never blocks paint, and the page's
// flat `--background` is the fallback if it never arrives. See `HeroField` for
// why the hero has a backdrop again at all.
const HeroField = dynamic(() => import("../_components/HeroField"), { ssr: false });

// Avatar tints come from the chart ramp, not raw Tailwind hues. The four-hue rainbow that used to
// live here (and, verbatim, in the login and signup panels) was the loudest violation of the
// one-palette rule and would have clashed with any brand change.
const SOCIAL_PROOF_AVATARS = [
  { initials: "AY", color: "var(--chart-1)" },
  { initials: "KM", color: "var(--chart-2)" },
  { initials: "SR", color: "var(--chart-3)" },
  { initials: "NB", color: "var(--chart-4)" },
] as const;
const USE_CASES = ["quizzes", "placement", "mock", "homework", "finals", "progress"] as const;

/**
 * The entrance, written out as a score rather than scattered across the markup.
 *
 * The hero is the one screen on this site that a visitor arrives at rather than
 * scrolls to, so it is the one screen allowed to assemble itself instead of
 * simply being there. Everything below the fold still animates on entry into
 * view and nothing here changes that.
 *
 * These are seconds of *delay*, not duration. `--dur-*` deliberately tops out at
 * 360ms because "users are mid-task; nobody should wait for choreography" — and
 * that is still true of every control in the product. It is not true of the
 * three quarters of a second between opening a page and reading it, which is
 * why the individual moves stay short and the sequence is what is long.
 */
const BEAT = {
  badge: 0.06,
  headline: 0.15,
  /** Added per headline line after the first. */
  line: 0.075,
  /** How long after the last line lands before the mark chases it. */
  strokeAfterLines: 0.22,
  lede: 0.42,
  ctas: 0.52,
  proof: 0.62,
  /** The object itself: it has its own seven-second loop, so it arrives early. */
  object: 0.22,
  hint: 0.95,
} as const;

/** `--ease-out-expo`, in the array form Motion wants. */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function MainPage() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = !!shouldReduceMotion;

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const title = t("landing.main.title");
  // Null until the browser has laid the headline out — and permanently null
  // under reduced motion, where there is nothing to reveal a line at a time.
  const lines = useLineSplit(headlineRef, title, !reduceMotion);

  /** A short rise into place. Reduced motion keeps the fade and drops the move. */
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.25 : 0.55,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_OUT_EXPO,
    },
  });

  const strokeDelay =
    BEAT.headline + ((lines?.length ?? 1) - 1) * BEAT.line + BEAT.strokeAfterLines;

  return (
    <section id="home" className="relative w-full scroll-mt-24">
      {/* THE SCENE. One viewport tall, minus the bar standing in it — the page
          opens as a place rather than starting with a strip of content. The
          field is full-bleed and behind everything: it is this box's ground, not
          a panel inside it, and `isolate` keeps its z-index local so it can
          never rise over the navbar. */}
      <div className="relative isolate flex min-h-[calc(100svh-var(--header-h))] w-full flex-col justify-center px-4 pb-28 pt-10 sm:px-6 md:pt-14">
        <HeroField className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="flex flex-col items-start text-left">
            <motion.span
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-foreground"
              {...rise(BEAT.badge)}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {t("landing.main.badge")}
            </motion.span>

            <div className="relative mt-6 w-full">
              {/* Two renderings of one sentence. Server-side and until the lines
                  have been measured it is plain text, so there is nothing for
                  hydration to disagree about and a crawler reads an ordinary
                  `<h1>`. Once `useLineSplit` reports where the browser broke it,
                  each line becomes its own clipped box to rise out of, the
                  sentence moves to `aria-label`, and the boxes go `aria-hidden`
                  so it is announced once, whole. */}
              <h1
                ref={headlineRef}
                aria-label={lines ? title : undefined}
                className="max-w-xl text-balance text-[clamp(2.5rem,6vw,3.85rem)] font-bold leading-[1.05] tracking-[-0.02em] text-foreground"
              >
                {lines
                  ? lines.map((line, index) => (
                      <span
                        key={`${index}-${line}`}
                        aria-hidden="true"
                        /* The clip box is grown past the line box and pulled
                           back by the same amount, so the mask stays tight to
                           the line while leaving room for the parts of a glyph
                           that live outside it — Cyrillic descenders and the
                           breve on Uzbek `Oʻ` both sit outside a 1.05 line box
                           and would otherwise be shaved off mid-reveal. */
                        className="-mb-[0.18em] -mt-[0.1em] block overflow-clip pb-[0.18em] pt-[0.1em]"
                      >
                        <motion.span
                          className="block"
                          initial={{ y: "125%" }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.66,
                            delay: BEAT.headline + index * BEAT.line,
                            ease: EASE_OUT_EXPO,
                          }}
                        >
                          {line}
                        </motion.span>
                      </span>
                    ))
                  : title}
              </h1>

              <MarkingStroke
                delay={strokeDelay}
                reduceMotion={reduceMotion}
                className="mt-3 w-[min(19rem,72%)] text-brand"
              />
            </div>

            <motion.p
              className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
              {...rise(BEAT.lede)}
            >
              {t("landing.main.subtitle")}
            </motion.p>

            <motion.div className="mt-8 flex flex-wrap items-center gap-3" {...rise(BEAT.ctas)}>
              <Button asChild variant="brand" size="xl">
                <Link href={appHref("/signup")}>{t("landing.main.primaryCta")}</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href={appHref("/login")}>
                  {t("landing.main.secondaryCta")}
                  <ArrowRight className="transition-transform duration-[var(--dur-2)] group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div className="mt-9 flex items-center gap-3" {...rise(BEAT.proof)}>
              <div className="flex -space-x-2.5">
                {SOCIAL_PROOF_AVATARS.map((avatar) => (
                  <div
                    key={avatar.initials}
                    style={{ background: avatar.color }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background text-3xs font-bold text-white shadow-elev-2"
                  >
                    {avatar.initials}
                  </div>
                ))}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-secondary text-xs font-semibold text-foreground shadow-sm">
                  +
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t("landing.main.socialProofTitle")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("landing.main.socialProofSubtitle")}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: the 3D hero scene — one answer sheet being marked. Row by row
              the chosen bubble fills and a tick lands, then a score ring closes
              beside the page. Pointer interaction is fenced to this box. */}
          <motion.div className="relative" {...rise(BEAT.object)}>
            {/* Capped against the viewport's *height* as well as its width: the
                object is square, so on a short laptop an unbounded 600px would
                be what pushes the buttons under the fold. */}
            <div className="relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden sm:aspect-[5/4] lg:aspect-square lg:max-w-[min(600px,54svh)]">
              {/* Brand glow / WebGL fallback backdrop: a concentrated core behind the
                  sheet + chart inside a wider halo. `.hero-bloom` (globals.css) owns
                  the ramps, because both have to reach zero alpha before this box's
                  `overflow-hidden` clips them — otherwise the wash ends in a visible
                  rectangle. Also the graceful fallback when WebGL is unavailable. */}
              <div aria-hidden="true" className="hero-bloom pointer-events-none absolute inset-0" />
              {/* The two labels are painted into the model itself — the title onto
                  the page, the pill beside the score ring — so the copy reads as
                  part of the object rather than as tags floating over it. */}
              <HeroScene
                className="absolute inset-0 h-full w-full"
                labels={{
                  quiz: t("landing.main.scene.quiz"),
                  graded: t("landing.main.scene.graded"),
                }}
              />
              <span className="sr-only">{t("landing.main.scene.alt")}</span>
            </div>
          </motion.div>
        </div>

        {/* A full-height scene has to say the page continues, or its bottom edge
            reads as the bottom of the document. Hidden from assistive tech: it
            describes a gesture a screen-reader user does not make, and the
            content it points at is the next thing in the document anyway. */}
        <motion.p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto hidden w-max flex-col items-center gap-3 text-3xs font-medium uppercase tracking-[0.24em] text-muted-foreground lg:flex"
          {...rise(BEAT.hint)}
        >
          <span className="block h-8 w-px bg-border" />
          {t("landing.main.scrollHint")}
        </motion.p>
      </div>

      {/* School / learning-center positioning band — a flowing ribbon of real use
          cases. The continuous scroll reads as "and everything in between". Now
          the first thing below the fold, and its rule is the scene's horizon. */}
      <SchoolsBand reduceMotion={reduceMotion} />
    </section>
  );
}

/** Renders one pass of the use-case ribbon: a violet spark before each phrase. */
function UseCaseItems() {
  const { t } = useTranslation();
  return (
    <>
      {USE_CASES.map((key) => (
        <li key={key} className="flex items-center gap-3 whitespace-nowrap">
          <Sparkle className="h-3.5 w-3.5 shrink-0 text-primary" fill="currentColor" />
          <span className="text-lg font-medium text-foreground/80 sm:text-xl">
            {t(`landing.main.useCases.${key}`)}
          </span>
        </li>
      ))}
    </>
  );
}

function SchoolsBand({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useTranslation();
  const edgeFade = {
    maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-6xl border-t border-border/60 px-4 pb-4 pt-14 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
    >
      <p className="mx-auto max-w-2xl text-center text-sm font-medium text-muted-foreground">
        {t("landing.main.schoolsTitle")}
      </p>

      {reduceMotion ? (
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5">
          <UseCaseItems />
        </ul>
      ) : (
        <div className="landing-marquee group relative mt-7 flex overflow-hidden" style={edgeFade}>
          <div className="landing-marquee-track flex w-max items-center">
            <ul className="flex w-max items-center gap-x-10 pr-10">
              <UseCaseItems />
            </ul>
            <ul aria-hidden className="flex w-max items-center gap-x-10 pr-10">
              <UseCaseItems />
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default MainPage;
